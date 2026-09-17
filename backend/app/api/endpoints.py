import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from ..database import get_db, hash_password, verify_password
from ..models.entities import Location, Zone, WeatherObservation, ThermalStressRecord, RiskAssessmentRecord, ForecastRecord, AlertRecord, DataSourceRecord, User
from ..schemas.payloads import OverviewResponseSchema, SimulatorRequest, ReportGenerateRequest, LoginRequest, RegisterRequest, ForgotPasswordRequest, AuthResponse, UserSchema
from ..calculations.thermal_indices import calculate_heat_index, calculate_wbgt, calculate_utci, analyze_risk_amplification
from ..services.risk_engine import compute_multilayer_risk_fusion
from ..services.forecast_engine import generate_5day_forecast
from ..services.recommendation_engine import generate_recommendations, generate_ai_insights
from ..services.alert_engine import alert_manager
from ..services.report_engine import generate_pdf_report_bytes

router = APIRouter(prefix="/api")

@router.get("/health")
def health_check():
    return {"status": "ok", "service": "Sahayya.AI Heat Risk Intelligence Backend", "version": "2.4.0"}

@router.get("/overview")
def get_overview(zone_id: Optional[str] = "central-pune", db: Session = Depends(get_db)):
    """
    Returns complete dashboard state tailored for the selected zone (default: Central Pune).
    Matches 100% of the cards and visual KPIs on the reference UI.
    """
    zone = db.query(Zone).filter(Zone.id == zone_id).first()
    if not zone:
        zone = db.query(Zone).first()
        if not zone:
            raise HTTPException(status_code=404, detail="No zone data found")
        zone_id = zone.id

    w = db.query(WeatherObservation).filter(WeatherObservation.zone_id == zone_id).order_by(WeatherObservation.id.desc()).first()
    th = db.query(ThermalStressRecord).filter(ThermalStressRecord.zone_id == zone_id).order_by(ThermalStressRecord.id.desc()).first()
    r = db.query(RiskAssessmentRecord).filter(RiskAssessmentRecord.zone_id == zone_id).order_by(RiskAssessmentRecord.id.desc()).first()
    forecast_days = db.query(ForecastRecord).filter(ForecastRecord.zone_id == zone_id).all()
    all_zones = db.query(Zone).all()
    alerts = db.query(AlertRecord).filter(AlertRecord.status == "Active").all()
    data_sources = db.query(DataSourceRecord).all()
    
    # Priority Zones table list
    priority_list = []
    for z in all_zones[:4]:
        z_r = db.query(RiskAssessmentRecord).filter(RiskAssessmentRecord.zone_id == z.id).order_by(RiskAssessmentRecord.id.desc()).first()
        vuln_label = "High" if z.vulnerable_pop_count > 60000 else ("Moderate" if z.vulnerable_pop_count > 35000 else "Low")
        priority_list.append({
            "zone_id": z.id,
            "zone_name": z.name,
            "risk": z_r.risk_level if z_r else "High",
            "vulnerability": vuln_label,
            "priority": z_r.priority_level if z_r else "Critical"
        })

    # AI Diagnostic Insights
    ai_insights = generate_ai_insights(
        temp_c=w.temperature_c if w else 39.0,
        humidity=w.humidity_pct if w else 62.0,
        wind_kmh=w.wind_speed_kmh if w else 8.0,
        solar_rad=w.solar_radiation_level if w else "Very High",
        risk_score=r.overall_risk_score if r else 78,
        zone_name=zone.name
    )

    # Dynamic Recommended Actions
    recommended_actions = generate_recommendations(
        risk_level=r.risk_level if r else "High",
        thermal_stress=th.overall_thermal_status if th else "Very High",
        zone_name=zone.name
    )

    # Risk Amplification breakdown
    risk_amplification = {
        "level": r.amplification_level if r else "High",
        "combined_factors": [
            {"factor": "High Humidity", "trend": "up"},
            {"factor": "Very High Solar Radiation", "trend": "up"},
            {"factor": "Low Wind Speed", "trend": "down"}
        ],
        "highlight_box": "High humidity + very high solar radiation + low wind = increased thermal stress."
    }

    # Multi-layer Risk Fusion composition
    risk_composition = {
        "overall_score": r.overall_risk_score if r else 78,
        "layers": [
            {"name": "Environmental Risk", "pct": r.environmental_risk_pct if r else 58, "color": "#f97316"},
            {"name": "Thermal Stress", "pct": r.thermal_stress_pct if r else 22, "color": "#eab308"},
            {"name": "Population Vulnerability", "pct": r.vulnerability_pct if r else 14, "color": "#84cc16"},
            {"name": "Exposure", "pct": r.exposure_pct if r else 6, "color": "#0284c7"}
        ]
    }

    # Key stats
    key_stats = {
        "vulnerable_population": f"{round(zone.vulnerable_pop_count / 100000.0, 1)} L",
        "priority_zones": 4,
        "risk_confidence": "91%",
        "active_alerts": len(alerts)
    }

    # Complete summary of all zones for interactive map
    zones_summary = []
    for z in all_zones:
        zw = db.query(WeatherObservation).filter(WeatherObservation.zone_id == z.id).order_by(WeatherObservation.id.desc()).first()
        zth = db.query(ThermalStressRecord).filter(ThermalStressRecord.zone_id == z.id).order_by(ThermalStressRecord.id.desc()).first()
        zr = db.query(RiskAssessmentRecord).filter(RiskAssessmentRecord.zone_id == z.id).order_by(RiskAssessmentRecord.id.desc()).first()
        
        zones_summary.append({
            "id": z.id,
            "name": z.name,
            "zone_type": z.zone_type,
            "center_lat": z.center_lat,
            "center_lon": z.center_lon,
            "population": z.population,
            "vulnerable_pop_count": z.vulnerable_pop_count,
            "area_sqkm": z.area_sqkm,
            "green_cover_pct": z.green_cover_pct,
            "dense_housing_pct": z.dense_housing_pct,
            "polygon_geojson": z.polygon_geojson,
            "weather": {
                "temperature_c": zw.temperature_c if zw else 38.0,
                "feels_like_c": zth.heat_index_c if zth else 42.0,
                "humidity_pct": zw.humidity_pct if zw else 55.0,
                "wind_speed_kmh": zw.wind_speed_kmh if zw else 10.0,
                "wind_direction": zw.wind_direction if zw else "NW",
                "solar_radiation_level": zw.solar_radiation_level if zw else "High",
                "solar_radiation_wm2": zw.solar_radiation_wm2 if zw else 800.0,
                "aqi": zw.aqi if zw else 110,
                "aqi_status": zw.aqi_status if zw else "Moderate",
                "pm25": zw.pm25 if zw else 50.0,
                "pm10": zw.pm10 if zw else 80.0,
                "co": zw.co if zw else 1.0,
                "condition_text": zw.condition_text if zw else "Clear"
            },
            "thermal_stress": {
                "heat_index_c": zth.heat_index_c if zth else 42.0,
                "heat_index_category": zth.heat_index_category if zth else "High",
                "wbgt_c": zth.wbgt_c if zth else 30.0,
                "wbgt_category": zth.wbgt_category if zth else "High",
                "utci_c": zth.utci_c if zth else 40.0,
                "utci_category": zth.utci_category if zth else "High",
                "overall_thermal_status": zth.overall_thermal_status if zth else "High"
            },
            "risk": {
                "overall_risk_score": zr.overall_risk_score if zr else 70,
                "risk_level": zr.risk_level if zr else "High",
                "environmental_risk_pct": zr.environmental_risk_pct if zr else 55,
                "thermal_stress_pct": zr.thermal_stress_pct if zr else 22,
                "vulnerability_pct": zr.vulnerability_pct if zr else 15,
                "exposure_pct": zr.exposure_pct if zr else 8,
                "trend_vs_yesterday": zr.trend_vs_yesterday if zr else "+5%",
                "priority_level": zr.priority_level if zr else "High",
                "amplification_level": zr.amplification_level if zr else "Moderate",
                "amplification_summary": zr.amplification_summary if zr else "Elevated urban heat."
            }
        })

    return {
        "location_name": "Pune, Maharashtra",
        "selected_zone_name": zone.name,
        "selected_zone_id": zone.id,
        "last_updated": "10:32 AM | 24 Apr 2025",
        "current_risk": {
            "overall_risk_score": r.overall_risk_score if r else 78,
            "risk_level": r.risk_level if r else "High",
            "environmental_risk_pct": r.environmental_risk_pct if r else 58,
            "thermal_stress_pct": r.thermal_stress_pct if r else 22,
            "vulnerability_pct": r.vulnerability_pct if r else 14,
            "exposure_pct": r.exposure_pct if r else 6,
            "trend_vs_yesterday": r.trend_vs_yesterday if r else "+12%",
            "priority_level": r.priority_level if r else "Critical",
            "amplification_level": r.amplification_level if r else "High",
            "amplification_summary": r.amplification_summary if r else "High humidity + very high solar radiation + low wind = increased thermal stress."
        },
        "current_weather": {
            "temperature_c": w.temperature_c if w else 39.0,
            "feels_like_c": th.heat_index_c if th else 44.0,
            "humidity_pct": w.humidity_pct if w else 62.0,
            "wind_speed_kmh": w.wind_speed_kmh if w else 8.0,
            "wind_direction": w.wind_direction if w else "NW",
            "solar_radiation_level": w.solar_radiation_level if w else "Very High",
            "solar_radiation_wm2": w.solar_radiation_wm2 if w else 880.0,
            "aqi": w.aqi if w else 128,
            "aqi_status": w.aqi_status if w else "Moderate",
            "pm25": w.pm25 if w else 58.0,
            "pm10": w.pm10 if w else 92.0,
            "co": w.co if w else 1.2,
            "condition_text": w.condition_text if w else "Sunny / Extreme Heat"
        },
        "current_thermal": {
            "heat_index_c": th.heat_index_c if th else 44.0,
            "heat_index_category": th.heat_index_category if th else "Very High",
            "wbgt_c": th.wbgt_c if th else 31.4,
            "wbgt_category": th.wbgt_category if th else "High",
            "utci_c": th.utci_c if th else 41.2,
            "utci_category": th.utci_category if th else "Very High",
            "overall_thermal_status": th.overall_thermal_status if th else "Very High"
        },
        "key_stats": key_stats,
        "risk_amplification": risk_amplification,
        "risk_composition": risk_composition,
        "forecast_5day": [
            {
                "day_name": f.day_name,
                "date_str": f.date_str,
                "full_date": f.full_date,
                "temp_c": f.temp_c,
                "feels_like_c": f.feels_like_c,
                "humidity_pct": f.humidity_pct,
                "wind_kmh": f.wind_kmh,
                "solar_radiation": f.solar_radiation,
                "heat_risk_score": f.heat_risk_score,
                "heat_index_c": f.heat_index_c,
                "wbgt_c": f.wbgt_c,
                "utci_c": f.utci_c,
                "risk_level": f.risk_level,
                "thermal_stress": f.thermal_stress,
                "is_peak": f.is_peak
            } for f in forecast_days
        ],
        "priority_zones": priority_list,
        "ai_insights": ai_insights,
        "recommended_actions": recommended_actions,
        "active_alerts": [
            {
                "id": a.id,
                "zone_id": a.zone_id,
                "zone_name": a.zone_name,
                "title": a.title,
                "severity": a.severity,
                "category": a.category,
                "time_str": a.time_str,
                "date_str": a.date_str,
                "status": a.status,
                "description": a.description,
                "affected_population": a.affected_population,
                "protocol": a.protocol
            } for a in alerts
        ],
        "data_sources": [
            {
                "id": ds.id,
                "name": ds.name,
                "category": ds.category,
                "provider": ds.provider,
                "status": ds.status,
                "last_updated": ds.last_updated,
                "refresh_frequency": ds.refresh_frequency,
                "coverage": ds.coverage,
                "latency_ms": ds.latency_ms,
                "reliability_pct": ds.reliability_pct
            } for ds in data_sources
        ],
        "zones_summary": zones_summary
    }

@router.get("/zones")
def list_zones(db: Session = Depends(get_db)):
    """List all Pune zones with their complete data."""
    zones = db.query(Zone).all()
    results = []
    for z in zones:
        w = db.query(WeatherObservation).filter(WeatherObservation.zone_id == z.id).order_by(WeatherObservation.id.desc()).first()
        th = db.query(ThermalStressRecord).filter(ThermalStressRecord.zone_id == z.id).order_by(ThermalStressRecord.id.desc()).first()
        r = db.query(RiskAssessmentRecord).filter(RiskAssessmentRecord.zone_id == z.id).order_by(RiskAssessmentRecord.id.desc()).first()
        results.append({
            "id": z.id,
            "name": z.name,
            "zone_type": z.zone_type,
            "center_lat": z.center_lat,
            "center_lon": z.center_lon,
            "population": z.population,
            "vulnerable_pop_count": z.vulnerable_pop_count,
            "area_sqkm": z.area_sqkm,
            "green_cover_pct": z.green_cover_pct,
            "dense_housing_pct": z.dense_housing_pct,
            "polygon_geojson": z.polygon_geojson,
            "temperature_c": w.temperature_c if w else 38.0,
            "humidity_pct": w.humidity_pct if w else 55.0,
            "wind_speed_kmh": w.wind_speed_kmh if w else 10.0,
            "solar_radiation_level": w.solar_radiation_level if w else "High",
            "heat_index_c": th.heat_index_c if th else 42.0,
            "wbgt_c": th.wbgt_c if th else 30.0,
            "utci_c": th.utci_c if th else 40.0,
            "overall_risk_score": r.overall_risk_score if r else 70,
            "risk_level": r.risk_level if r else "High",
            "priority_level": r.priority_level if r else "High",
            "aqi": w.aqi if w else 110
        })
    return results

@router.get("/zones/{zone_id}")
def get_zone_detail(zone_id: str, db: Session = Depends(get_db)):
    """Retrieve in-depth analytical details for a specific zone."""
    zone = db.query(Zone).filter(Zone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    w = db.query(WeatherObservation).filter(WeatherObservation.zone_id == zone_id).order_by(WeatherObservation.id.desc()).first()
    th = db.query(ThermalStressRecord).filter(ThermalStressRecord.zone_id == zone_id).order_by(ThermalStressRecord.id.desc()).first()
    r = db.query(RiskAssessmentRecord).filter(RiskAssessmentRecord.zone_id == zone_id).order_by(RiskAssessmentRecord.id.desc()).first()
    forecast = db.query(ForecastRecord).filter(ForecastRecord.zone_id == zone_id).all()
    recommendations = generate_recommendations(r.risk_level if r else "High", th.overall_thermal_status if th else "High", zone.name)
    
    return {
        "zone": {
            "id": zone.id,
            "name": zone.name,
            "zone_type": zone.zone_type,
            "center_lat": zone.center_lat,
            "center_lon": zone.center_lon,
            "population": zone.population,
            "vulnerable_pop_count": zone.vulnerable_pop_count,
            "area_sqkm": zone.area_sqkm,
            "green_cover_pct": zone.green_cover_pct,
            "dense_housing_pct": zone.dense_housing_pct,
            "polygon_geojson": zone.polygon_geojson
        },
        "weather": w,
        "thermal_stress": th,
        "risk": r,
        "forecast": forecast,
        "recommendations": recommendations
    }

@router.post("/thermal-stress/simulate")
def simulate_thermal_stress(req: SimulatorRequest):
    """Interactive Thermal Stress Simulator with real-time recalculation."""
    hi, hi_cat = calculate_heat_index(req.temperature_c, req.humidity_pct)
    wbgt, wbgt_cat = calculate_wbgt(req.temperature_c, req.humidity_pct, req.wind_speed_kmh, req.solar_radiation_level)
    utci, utci_cat = calculate_utci(req.temperature_c, req.humidity_pct, req.wind_speed_kmh, req.solar_radiation_level)
    amplification = analyze_risk_amplification(req.temperature_c, req.humidity_pct, req.wind_speed_kmh, req.solar_radiation_level)
    
    # Calculate composite score
    fusion = compute_multilayer_risk_fusion(
        temp_c=req.temperature_c,
        humidity_pct=req.humidity_pct,
        wind_kmh=req.wind_speed_kmh,
        solar_radiation_level=req.solar_radiation_level,
        vulnerable_pop_count=60000,
        total_pop=350000,
        dense_housing_pct=50.0,
        green_cover_pct=15.0
    )
    
    return {
        "inputs": req.dict(),
        "heat_index": {"value": hi, "category": hi_cat, "unit": "°C"},
        "wbgt": {"value": wbgt, "category": wbgt_cat, "unit": "°C"},
        "utci": {"value": utci, "category": utci_cat, "unit": "°C"},
        "amplification": amplification,
        "fusion_result": fusion
    }

@router.get("/alerts")
def get_alerts(status: Optional[str] = None, db: Session = Depends(get_db)):
    """Fetch alerts with optional status filter (Active, Resolved, Historical)."""
    query = db.query(AlertRecord)
    if status and status != "All":
        query = query.filter(AlertRecord.status == status)
    alerts = query.order_by(AlertRecord.id.desc()).all()
    return {
        "alerts": alerts,
        "channel_status": alert_manager.channel_status
    }

@router.post("/alerts/acknowledge/{alert_id}")
def acknowledge_alert(alert_id: str, db: Session = Depends(get_db)):
    """Acknowledge or resolve an active alert."""
    alt = db.query(AlertRecord).filter(AlertRecord.id == alert_id).first()
    if not alt:
        raise HTTPException(status_code=404, detail="Alert not found")
    alt.status = "Resolved"
    db.commit()
    return {"message": f"Alert {alert_id} marked as Resolved", "alert_id": alert_id, "new_status": "Resolved"}

@router.post("/alerts/broadcast-test")
def test_broadcast(channel: str = "SMS Broadcast", zone_id: str = "central-pune"):
    """Simulate alert dispatch across external communication channels."""
    return {
        "status": "success",
        "channel": channel,
        "zone_id": zone_id,
        "message": f"Broadcast simulation test dispatched via {channel} to {zone_id} subscriber cluster.",
        "payload": {
            "title": "URGENT HEAT STRESS WARNING",
            "body": "Heat Index 44°C (Very High). Avoid outdoor exposure. Cooling centers open.",
            "timestamp": "10:32 AM IST",
            "dispatched_by": "Sahayya.AI Alert Engine / Municipal Disaster Command"
        }
    }

@router.get("/data-sources")
def get_data_sources(db: Session = Depends(get_db)):
    """List data sources, ingestion status, latency and reliability."""
    sources = db.query(DataSourceRecord).all()
    return {
        "data_sources": sources,
        "pipeline_status": "Healthy / Ingestion Nominal",
        "total_active_sources": len(sources),
        "data_fusion_latency_avg_ms": 110
    }

@router.post("/reports/generate")
def generate_report_endpoint(req: ReportGenerateRequest, db: Session = Depends(get_db)):
    """Generate dynamic report preview data or PDF bytes."""
    zone = db.query(Zone).filter(Zone.id == req.zone_id).first()
    if not zone:
        zone = db.query(Zone).first()
    
    w = db.query(WeatherObservation).filter(WeatherObservation.zone_id == zone.id).order_by(WeatherObservation.id.desc()).first()
    th = db.query(ThermalStressRecord).filter(ThermalStressRecord.zone_id == zone.id).order_by(ThermalStressRecord.id.desc()).first()
    r = db.query(RiskAssessmentRecord).filter(RiskAssessmentRecord.zone_id == zone.id).order_by(RiskAssessmentRecord.id.desc()).first()
    forecast = db.query(ForecastRecord).filter(ForecastRecord.zone_id == zone.id).all()
    
    report_dict = {
        "zone_id": zone.id,
        "zone_name": zone.name,
        "period": req.period,
        "risk_score": r.overall_risk_score if r else 78,
        "risk_level": r.risk_level if r else "High",
        "temp_c": w.temperature_c if w else 39.0,
        "feels_like_c": th.heat_index_c if th else 44.0,
        "heat_index_c": th.heat_index_c if th else 44.0,
        "wbgt_c": th.wbgt_c if th else 31.4,
        "utci_c": th.utci_c if th else 41.2,
        "aqi": w.aqi if w else 128,
        "forecast": [
            {
                "day_name": f.day_name,
                "date_str": f.date_str,
                "temp_c": f.temp_c,
                "feels_like_c": f.feels_like_c,
                "heat_index_c": f.heat_index_c,
                "wbgt_c": f.wbgt_c,
                "risk_level": f.risk_level,
                "is_peak": f.is_peak
            } for f in forecast
        ]
    }
    
    return {
        "report_id": f"REP-{zone.id}-20250424",
        "generated_at": "10:32 AM | 24 Apr 2025",
        "data": report_dict
    }

@router.get("/reports/download/{zone_id}")
def download_pdf_report(zone_id: str, period: str = "24 Apr 2025", db: Session = Depends(get_db)):
    """Directly download branded ReportLab PDF report."""
    zone = db.query(Zone).filter(Zone.id == zone_id).first()
    if not zone:
        zone = db.query(Zone).first()
        
    w = db.query(WeatherObservation).filter(WeatherObservation.zone_id == zone.id).order_by(WeatherObservation.id.desc()).first()
    th = db.query(ThermalStressRecord).filter(ThermalStressRecord.zone_id == zone.id).order_by(ThermalStressRecord.id.desc()).first()
    r = db.query(RiskAssessmentRecord).filter(RiskAssessmentRecord.zone_id == zone.id).order_by(RiskAssessmentRecord.id.desc()).first()
    forecast = db.query(ForecastRecord).filter(ForecastRecord.zone_id == zone.id).all()
    
    report_dict = {
        "zone_name": zone.name,
        "period": period,
        "risk_score": r.overall_risk_score if r else 78,
        "risk_level": r.risk_level if r else "High",
        "temp_c": w.temperature_c if w else 39.0,
        "feels_like_c": th.heat_index_c if th else 44.0,
        "heat_index_c": th.heat_index_c if th else 44.0,
        "wbgt_c": th.wbgt_c if th else 31.4,
        "utci_c": th.utci_c if th else 41.2,
        "aqi": w.aqi if w else 128,
        "forecast": [
            {
                "day_name": f.day_name,
                "date_str": f.date_str,
                "temp_c": f.temp_c,
                "feels_like_c": f.feels_like_c,
                "heat_index_c": f.heat_index_c,
                "wbgt_c": f.wbgt_c,
                "risk_level": f.risk_level,
                "is_peak": f.is_peak
            } for f in forecast
        ]
    }
    
    pdf_bytes = generate_pdf_report_bytes(report_dict)
    filename = f"Sahayya_HeatRisk_Report_{zone.id}.pdf"
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.post("/simulate-heatwave")
def simulate_heatwave(surge: bool = True, db: Session = Depends(get_db)):
    """
    Scenario toggle: Simulate sudden heatwave surge or restore normal baseline across Pune.
    """
    zones = db.query(Zone).all()
    for z in zones:
        w = db.query(WeatherObservation).filter(WeatherObservation.zone_id == z.id).first()
        th = db.query(ThermalStressRecord).filter(ThermalStressRecord.zone_id == z.id).first()
        r = db.query(RiskAssessmentRecord).filter(RiskAssessmentRecord.zone_id == z.id).first()
        if w and th and r:
            if surge:
                w.temperature_c += 2.5
                w.humidity_pct = min(90.0, w.humidity_pct + 8.0)
                th.heat_index_c += 3.5
                th.wbgt_c += 1.8
                th.utci_c += 2.8
                r.overall_risk_score = min(99, r.overall_risk_score + 10)
                r.risk_level = "Very High" if r.overall_risk_score >= 85 else "High"
            else:
                w.temperature_c = max(34.0, w.temperature_c - 2.5)
                w.humidity_pct = max(40.0, w.humidity_pct - 8.0)
                th.heat_index_c = max(36.0, th.heat_index_c - 3.5)
                th.wbgt_c = max(26.0, th.wbgt_c - 1.8)
                th.utci_c = max(34.0, th.utci_c - 2.8)
                r.overall_risk_score = max(45, r.overall_risk_score - 10)
                r.risk_level = "High" if r.overall_risk_score >= 70 else "Moderate"
    db.commit()
    return {"status": "success", "heatwave_surge": surge, "message": "Simulated meteorological conditions updated."}

# ================= AUTHENTICATION & USER MANAGEMENT ================= #

@router.post("/auth/login", response_model=AuthResponse)
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates a user with email and password.
    Supports default pre-seeded credentials or newly registered accounts.
    """
    email_clean = payload.email.strip().lower()
    user = db.query(User).filter(User.email.ilike(email_clean)).first()
    
    if not user:
        # Check if it matches a default demo user and auto-create if not yet in DB
        if email_clean in ["officer@sahayya.ai", "ward@sahayya.ai", "citizen@sahayya.ai", "demo@sahayya.ai"]:
            role_map = {
                "officer@sahayya.ai": ("Dr. Rajesh Kulkarni", "Disaster Management Officer", "Central Pune (Command HQ)"),
                "ward@sahayya.ai": ("Pooja Deshmukh", "Municipal Ward Officer", "Shivajinagar (Ward 7)"),
                "citizen@sahayya.ai": ("Anand Joshi", "Citizen Observer", "Kothrud (Ward 12)"),
                "demo@sahayya.ai": ("HeatShield Operator", "Disaster Management Officer", "Central Pune")
            }
            name, role, ward = role_map[email_clean]
            user = User(
                id=f"usr-{uuid.uuid4().hex[:8]}",
                name=name,
                email=email_clean,
                password_hash=hash_password(payload.password),
                role=role,
                ward=ward,
                phone="+91 98220 12345",
                organization="Pune Municipal Corporation"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            raise HTTPException(status_code=401, detail="Invalid email address or account not found.")

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect password. Please try again.")

    user.last_login = datetime.utcnow()
    db.commit()

    token = f"sahayya_token_{user.id}_{int(datetime.utcnow().timestamp())}"
    
    user_data = UserSchema(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        ward=user.ward,
        phone=user.phone,
        organization=user.organization,
        created_at=user.created_at.strftime("%Y-%m-%d %H:%M") if user.created_at else None
    )

    return {
        "status": "success",
        "message": f"Welcome back, {user.name}!",
        "token": token,
        "user": user_data
    }

@router.post("/auth/register", response_model=AuthResponse)
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Registers a new user account and saves to database.
    """
    email_clean = payload.email.strip().lower()
    
    if len(payload.name.strip()) < 2:
        raise HTTPException(status_code=400, detail="Please enter a valid full name.")
        
    if "@" not in email_clean or "." not in email_clean:
        raise HTTPException(status_code=400, detail="Please enter a valid email address.")
        
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")

    existing = db.query(User).filter(User.email.ilike(email_clean)).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email address already exists. Please log in.")

    new_user = User(
        id=f"usr-{uuid.uuid4().hex[:8]}",
        name=payload.name.strip(),
        email=email_clean,
        password_hash=hash_password(payload.password),
        role=payload.role or "Citizen Observer",
        ward=payload.ward or "Central Pune",
        phone=payload.phone,
        organization=payload.organization or "Pune Municipal Corporation",
        created_at=datetime.utcnow(),
        last_login=datetime.utcnow()
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = f"sahayya_token_{new_user.id}_{int(datetime.utcnow().timestamp())}"

    user_data = UserSchema(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        role=new_user.role,
        ward=new_user.ward,
        phone=new_user.phone,
        organization=new_user.organization,
        created_at=new_user.created_at.strftime("%Y-%m-%d %H:%M")
    )

    return {
        "status": "success",
        "message": "Account created successfully! Welcome to SAHAYYA.AI.",
        "token": token,
        "user": user_data
    }

@router.post("/auth/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Simulates sending a password reset link/OTP to registered email.
    """
    email_clean = payload.email.strip().lower()
    user = db.query(User).filter(User.email.ilike(email_clean)).first()
    
    # Even if demo, respond with success for smooth flow
    return {
        "status": "success",
        "message": f"Password reset instructions and verification link have been dispatched to {email_clean}.",
        "email": email_clean
    }

@router.get("/auth/users", response_model=List[UserSchema])
def list_demo_users(db: Session = Depends(get_db)):
    """
    Returns available accounts for quick role switching/demoing.
    """
    users = db.query(User).all()
    return [
        UserSchema(
            id=u.id,
            name=u.name,
            email=u.email,
            role=u.role,
            ward=u.ward,
            phone=u.phone,
            organization=u.organization,
            created_at=u.created_at.strftime("%Y-%m-%d %H:%M") if u.created_at else None
        )
        for u in users
    ]

