import pytest
from backend.app.calculations.thermal_indices import (
    calculate_heat_index,
    calculate_wbgt,
    calculate_utci,
    analyze_risk_amplification
)
from backend.app.services.risk_engine import compute_multilayer_risk_fusion

def test_heat_index():
    # 39°C and 62% humidity should yield high heat index around 44°C
    hi, category = calculate_heat_index(39.0, 62.0)
    assert hi >= 40.0
    assert category in ["Very High", "Extreme Caution", "Extreme"]

def test_wbgt():
    # 39°C, 62% humidity, 8 km/h wind, Very High solar radiation
    wbgt, category = calculate_wbgt(39.0, 62.0, 8.0, "Very High")
    assert 28.0 <= wbgt <= 36.0
    assert category in ["High", "Very High"]

def test_utci():
    utci, category = calculate_utci(39.0, 62.0, 8.0, "Very High")
    assert 38.0 <= utci <= 46.0
    assert category in ["High", "Very High"]

def test_risk_amplification():
    amp = analyze_risk_amplification(39.0, 62.0, 8.0, "Very High")
    assert amp["level"] == "High"
    assert len(amp["factors"]) >= 3

def test_multilayer_fusion():
    fusion = compute_multilayer_risk_fusion(
        temp_c=39.0,
        humidity_pct=62.0,
        wind_kmh=8.0,
        solar_radiation_level="Very High",
        vulnerable_pop_count=84000,
        total_pop=420000,
        dense_housing_pct=68.0,
        green_cover_pct=8.5
    )
    assert fusion["overall_risk_score"] >= 70
    assert fusion["risk_level"] in ["High", "Very High"]
