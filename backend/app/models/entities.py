from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class Location(Base):
    __tablename__ = "locations"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    state = Column(String, nullable=False)
    country = Column(String, default="India")
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    elevation_m = Column(Float, default=560.0)
    total_population = Column(Integer, default=3500000)
    
    zones = relationship("Zone", back_populates="location")

class Zone(Base):
    __tablename__ = "zones"
    
    id = Column(String, primary_key=True)
    location_id = Column(String, ForeignKey("locations.id"), nullable=False)
    name = Column(String, nullable=False)
    zone_type = Column(String, default="Urban Core") # Urban Core, Industrial, Suburb, Tech Park
    center_lat = Column(Float, nullable=False)
    center_lon = Column(Float, nullable=False)
    polygon_geojson = Column(JSON, nullable=True) # GeoJSON polygon coordinates
    population = Column(Integer, default=350000)
    vulnerable_pop_count = Column(Integer, default=65000)
    area_sqkm = Column(Float, default=18.5)
    green_cover_pct = Column(Float, default=12.0)
    dense_housing_pct = Column(Float, default=45.0)
    
    location = relationship("Location", back_populates="zones")
    weather_observations = relationship("WeatherObservation", back_populates="zone")
    thermal_records = relationship("ThermalStressRecord", back_populates="zone")
    risk_records = relationship("RiskAssessmentRecord", back_populates="zone")
    forecast_days = relationship("ForecastRecord", back_populates="zone")
    alerts = relationship("AlertRecord", back_populates="zone")

class WeatherObservation(Base):
    __tablename__ = "weather_observations"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    zone_id = Column(String, ForeignKey("zones.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    temperature_c = Column(Float, nullable=False)
    humidity_pct = Column(Float, nullable=False)
    wind_speed_kmh = Column(Float, nullable=False)
    wind_direction = Column(String, default="NW")
    solar_radiation_level = Column(String, default="Very High")
    solar_radiation_wm2 = Column(Float, default=880.0)
    aqi = Column(Integer, default=128)
    aqi_status = Column(String, default="Moderate")
    pm25 = Column(Float, default=58.0)
    pm10 = Column(Float, default=92.0)
    co = Column(Float, default=1.2)
    condition_text = Column(String, default="Sunny / Extreme Heat")
    
    zone = relationship("Zone", back_populates="weather_observations")

class ThermalStressRecord(Base):
    __tablename__ = "thermal_stress_records"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    zone_id = Column(String, ForeignKey("zones.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    heat_index_c = Column(Float, nullable=False)
    heat_index_category = Column(String, nullable=False)
    wbgt_c = Column(Float, nullable=False)
    wbgt_category = Column(String, nullable=False)
    utci_c = Column(Float, nullable=False)
    utci_category = Column(String, nullable=False)
    overall_thermal_status = Column(String, default="Very High")
    
    zone = relationship("Zone", back_populates="thermal_records")

class RiskAssessmentRecord(Base):
    __tablename__ = "risk_assessment_records"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    zone_id = Column(String, ForeignKey("zones.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    overall_risk_score = Column(Integer, default=78) # 0-100
    risk_level = Column(String, default="High") # Low, Moderate, High, Very High, Extreme
    environmental_risk_pct = Column(Integer, default=58)
    thermal_stress_pct = Column(Integer, default=22)
    vulnerability_pct = Column(Integer, default=14)
    exposure_pct = Column(Integer, default=6)
    trend_vs_yesterday = Column(String, default="+12%")
    priority_level = Column(String, default="Critical") # Low, Medium, High, Critical
    amplification_level = Column(String, default="High")
    amplification_summary = Column(Text, default="High humidity + very high solar radiation + low wind = increased thermal stress.")
    
    zone = relationship("Zone", back_populates="risk_records")

class ForecastRecord(Base):
    __tablename__ = "forecast_records"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    zone_id = Column(String, ForeignKey("zones.id"), nullable=False)
    day_name = Column(String, nullable=False) # Mon, Tue, Wed, Thu, Fri
    date_str = Column(String, nullable=False) # Apr 21, Apr 22, ...
    full_date = Column(String, nullable=False) # 2025-04-21
    temp_c = Column(Float, nullable=False)
    feels_like_c = Column(Float, nullable=False)
    humidity_pct = Column(Float, nullable=False)
    wind_kmh = Column(Float, nullable=False)
    solar_radiation = Column(String, default="Very High")
    heat_risk_score = Column(Integer, nullable=False)
    heat_index_c = Column(Float, nullable=False)
    wbgt_c = Column(Float, nullable=False)
    utci_c = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)
    thermal_stress = Column(String, nullable=False)
    is_peak = Column(Boolean, default=False)
    
    zone = relationship("Zone", back_populates="forecast_days")

class AlertRecord(Base):
    __tablename__ = "alert_records"
    
    id = Column(String, primary_key=True)
    zone_id = Column(String, ForeignKey("zones.id"), nullable=False)
    zone_name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    severity = Column(String, nullable=False) # Moderate, High, Extreme
    category = Column(String, default="Heat Risk")
    time_str = Column(String, nullable=False) # 10:12 AM
    date_str = Column(String, default="24 Apr 2025")
    status = Column(String, default="Active") # Active, Resolved, Historical
    description = Column(Text, nullable=False)
    affected_population = Column(String, default="65,000")
    protocol = Column(Text, default="Activate local cooling stations and dispatch health advisory.")
    
    zone = relationship("Zone", back_populates="alerts")

class DataSourceRecord(Base):
    __tablename__ = "data_source_records"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # Satellite, Weather, Sensors, Ground, Demographic
    provider = Column(String, nullable=False)
    status = Column(String, default="Active") # Active, Standby, Integration Ready
    last_updated = Column(String, default="10:32 AM | 24 Apr 2025")
    refresh_frequency = Column(String, default="15 minutes")
    coverage = Column(String, default="Pune Metropolitan Region (10 Wards)")
    latency_ms = Column(Integer, default=124)
    reliability_pct = Column(Float, default=99.4)

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="Disaster Management Officer")
    ward = Column(String, default="Central Pune")
    phone = Column(String, nullable=True)
    organization = Column(String, default="Pune Municipal Corporation")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)
