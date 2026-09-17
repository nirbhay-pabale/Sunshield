from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class WeatherObservationSchema(BaseModel):
    temperature_c: float
    feels_like_c: float
    humidity_pct: float
    wind_speed_kmh: float
    wind_direction: str
    solar_radiation_level: str
    solar_radiation_wm2: float
    aqi: int
    aqi_status: str
    pm25: float
    pm10: float
    co: float
    condition_text: str

class ThermalStressSchema(BaseModel):
    heat_index_c: float
    heat_index_category: str
    wbgt_c: float
    wbgt_category: str
    utci_c: float
    utci_category: str
    overall_thermal_status: str

class RiskAssessmentSchema(BaseModel):
    overall_risk_score: int
    risk_level: str
    environmental_risk_pct: int
    thermal_stress_pct: int
    vulnerability_pct: int
    exposure_pct: int
    trend_vs_yesterday: str
    priority_level: str
    amplification_level: str
    amplification_summary: str

class ForecastDaySchema(BaseModel):
    day_name: str
    date_str: str
    full_date: str
    temp_c: float
    feels_like_c: float
    humidity_pct: float
    wind_kmh: float
    solar_radiation: str
    heat_risk_score: int
    heat_index_c: float
    wbgt_c: float
    utci_c: float
    risk_level: str
    thermal_stress: str
    is_peak: bool

class AlertSchema(BaseModel):
    id: str
    zone_id: str
    zone_name: str
    title: str
    severity: str
    category: str
    time_str: str
    date_str: str
    status: str
    description: str
    affected_population: str
    protocol: str

class DataSourceSchema(BaseModel):
    id: str
    name: str
    category: str
    provider: str
    status: str
    last_updated: str
    refresh_frequency: str
    coverage: str
    latency_ms: int
    reliability_pct: float

class ZoneSummarySchema(BaseModel):
    id: str
    name: str
    zone_type: str
    center_lat: float
    center_lon: float
    population: int
    vulnerable_pop_count: int
    area_sqkm: float
    green_cover_pct: float
    dense_housing_pct: float
    polygon_geojson: Optional[Dict[str, Any]] = None
    weather: WeatherObservationSchema
    thermal_stress: ThermalStressSchema
    risk: RiskAssessmentSchema

class OverviewResponseSchema(BaseModel):
    location_name: str
    selected_zone_name: str
    selected_zone_id: str
    last_updated: str
    current_risk: RiskAssessmentSchema
    current_weather: WeatherObservationSchema
    current_thermal: ThermalStressSchema
    key_stats: Dict[str, Any]
    risk_amplification: Dict[str, Any]
    risk_composition: Dict[str, Any]
    forecast_5day: List[ForecastDaySchema]
    priority_zones: List[Dict[str, Any]]
    ai_insights: Dict[str, Any]
    recommended_actions: List[Dict[str, Any]]
    active_alerts: List[AlertSchema]
    data_sources: List[DataSourceSchema]
    zones_summary: List[ZoneSummarySchema]

class SimulatorRequest(BaseModel):
    temperature_c: float
    humidity_pct: float
    wind_speed_kmh: float
    solar_radiation_level: str

class ReportGenerateRequest(BaseModel):
    zone_id: str
    period: str
    include_ai_insights: bool = True
    include_recommendations: bool = True
    include_forecast: bool = True
    format: str = "pdf"

class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = False

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "Disaster Management Officer"
    ward: Optional[str] = "Central Pune"
    phone: Optional[str] = None
    organization: Optional[str] = "Pune Municipal Corporation"

class ForgotPasswordRequest(BaseModel):
    email: str

class UserSchema(BaseModel):
    id: str
    name: str
    email: str
    role: str
    ward: str
    phone: Optional[str] = None
    organization: Optional[str] = None
    created_at: Optional[str] = None

class AuthResponse(BaseModel):
    status: str
    message: str
    token: str
    user: UserSchema
