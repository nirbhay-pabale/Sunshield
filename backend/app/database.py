import os
import hashlib
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models.entities import Base, Location, Zone, WeatherObservation, ThermalStressRecord, RiskAssessmentRecord, ForecastRecord, AlertRecord, DataSourceRecord, User
from .services.seed_data import PUNE_LOCATION, PUNE_ZONES_SEED, DATA_SOURCES_SEED
from .services.forecast_engine import generate_5day_forecast
from .services.alert_engine import alert_manager

DATABASE_URL = "sqlite:///./sahayya.db"

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hashlib.sha256(password.encode("utf-8")).hexdigest() == hashed or password == hashed

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Seed default users if empty
        if db.query(User).first() is None:
            demo_users = [
                User(
                    id="usr-officer-01",
                    name="Dr. Rajesh Kulkarni",
                    email="officer@sahayya.ai",
                    password_hash=hash_password("sahayya123"),
                    role="Disaster Management Officer",
                    ward="Central Pune (Command HQ)",
                    phone="+91 98220 12345",
                    organization="Pune Municipal Disaster Management Authority"
                ),
                User(
                    id="usr-ward-01",
                    name="Pooja Deshmukh",
                    email="ward@sahayya.ai",
                    password_hash=hash_password("sahayya123"),
                    role="Municipal Ward Officer",
                    ward="Shivajinagar (Ward 7)",
                    phone="+91 94220 67890",
                    organization="Pune Municipal Corporation (PMC)"
                ),
                User(
                    id="usr-citizen-01",
                    name="Anand Joshi",
                    email="citizen@sahayya.ai",
                    password_hash=hash_password("sahayya123"),
                    role="Citizen Observer",
                    ward="Kothrud (Ward 12)",
                    phone="+91 98900 11223",
                    organization="Public Heat Watch & Resident Forum"
                ),
                User(
                    id="usr-demo-01",
                    name="HeatShield Operator",
                    email="demo@sahayya.ai",
                    password_hash=hash_password("demo123"),
                    role="Disaster Management Officer",
                    ward="Central Pune",
                    phone="+91 98000 00000",
                    organization="National Smart Cities Resilience Mesh"
                )
            ]
            for u in demo_users:
                db.add(u)
            db.commit()

        # Check if locations already seeded
        if db.query(Location).first() is not None:
            return
            
        # Seed Location
        loc = Location(
            id=PUNE_LOCATION["id"],
            name=PUNE_LOCATION["name"],
            state=PUNE_LOCATION["state"],
            country=PUNE_LOCATION["country"],
            lat=PUNE_LOCATION["lat"],
            lon=PUNE_LOCATION["lon"],
            elevation_m=PUNE_LOCATION["elevation_m"],
            total_population=PUNE_LOCATION["total_population"]
        )
        db.add(loc)
        
        # Seed Data Sources
        for ds in DATA_SOURCES_SEED:
            ds_rec = DataSourceRecord(
                id=ds["id"],
                name=ds["name"],
                category=ds["category"],
                provider=ds["provider"],
                status=ds["status"],
                last_updated=ds["last_updated"],
                refresh_frequency=ds["refresh_frequency"],
                coverage=ds["coverage"],
                latency_ms=ds["latency_ms"],
                reliability_pct=ds["reliability_pct"]
            )
            db.add(ds_rec)
            
        # Seed Zones & Child Entities
        for z in PUNE_ZONES_SEED:
            zone_rec = Zone(
                id=z["id"],
                location_id=loc.id,
                name=z["name"],
                zone_type=z["zone_type"],
                center_lat=z["center_lat"],
                center_lon=z["center_lon"],
                population=z["population"],
                vulnerable_pop_count=z["vulnerable_pop_count"],
                area_sqkm=z["area_sqkm"],
                green_cover_pct=z["green_cover_pct"],
                dense_housing_pct=z["dense_housing_pct"],
                polygon_geojson=z["polygon_geojson"]
            )
            db.add(zone_rec)
            
            # Weather
            w = z["weather"]
            w_rec = WeatherObservation(
                zone_id=z["id"],
                temperature_c=w["temperature_c"],
                humidity_pct=w["humidity_pct"],
                wind_speed_kmh=w["wind_speed_kmh"],
                wind_direction=w["wind_direction"],
                solar_radiation_level=w["solar_radiation_level"],
                solar_radiation_wm2=w["solar_radiation_wm2"],
                aqi=w["aqi"],
                aqi_status=w["aqi_status"],
                pm25=w["pm25"],
                pm10=w["pm10"],
                co=w["co"],
                condition_text=w["condition_text"]
            )
            db.add(w_rec)
            
            # Thermal
            th = z["thermal_stress"]
            th_rec = ThermalStressRecord(
                zone_id=z["id"],
                heat_index_c=th["heat_index_c"],
                heat_index_category=th["heat_index_category"],
                wbgt_c=th["wbgt_c"],
                wbgt_category=th["wbgt_category"],
                utci_c=th["utci_c"],
                utci_category=th["utci_category"],
                overall_thermal_status=th["overall_thermal_status"]
            )
            db.add(th_rec)
            
            # Risk
            r = z["risk"]
            r_rec = RiskAssessmentRecord(
                zone_id=z["id"],
                overall_risk_score=r["overall_risk_score"],
                risk_level=r["risk_level"],
                environmental_risk_pct=r["environmental_risk_pct"],
                thermal_stress_pct=r["thermal_stress_pct"],
                vulnerability_pct=r["vulnerability_pct"],
                exposure_pct=r["exposure_pct"],
                trend_vs_yesterday=r["trend_vs_yesterday"],
                priority_level=r["priority_level"],
                amplification_level=r["amplification_level"],
                amplification_summary=r["amplification_summary"]
            )
            db.add(r_rec)
            
            # 5-Day Forecast
            f_days = generate_5day_forecast(
                w["temperature_c"],
                w["humidity_pct"],
                w["wind_speed_kmh"],
                w["solar_radiation_level"]
            )
            for fd in f_days:
                f_rec = ForecastRecord(
                    zone_id=z["id"],
                    day_name=fd["day_name"],
                    date_str=fd["date_str"],
                    full_date=fd["full_date"],
                    temp_c=fd["temp_c"],
                    feels_like_c=fd["feels_like_c"],
                    humidity_pct=fd["humidity_pct"],
                    wind_kmh=fd["wind_kmh"],
                    solar_radiation=fd["solar_radiation"],
                    heat_risk_score=fd["heat_risk_score"],
                    heat_index_c=fd["heat_index_c"],
                    wbgt_c=fd["wbgt_c"],
                    utci_c=fd["utci_c"],
                    risk_level=fd["risk_level"],
                    thermal_stress=fd["thermal_stress"],
                    is_peak=fd["is_peak"]
                )
                db.add(f_rec)
                
        # Seed Alerts
        initial_alerts = alert_manager.get_initial_alerts()
        for alt in initial_alerts:
            alt_rec = AlertRecord(
                id=alt["id"],
                zone_id=alt["zone_id"],
                zone_name=alt["zone_name"],
                title=alt["title"],
                severity=alt["severity"],
                category=alt["category"],
                time_str=alt["time_str"],
                date_str=alt["date_str"],
                status=alt["status"],
                description=alt["description"],
                affected_population=alt["affected_population"],
                protocol=alt["protocol"]
            )
            db.add(alt_rec)
            
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
