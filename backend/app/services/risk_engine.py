from typing import Dict, Any
from ..calculations.thermal_indices import (
    calculate_heat_index,
    calculate_wbgt,
    calculate_utci,
    analyze_risk_amplification
)

def compute_multilayer_risk_fusion(
    temp_c: float,
    humidity_pct: float,
    wind_kmh: float,
    solar_radiation_level: str,
    vulnerable_pop_count: int,
    total_pop: int,
    dense_housing_pct: float,
    green_cover_pct: float
) -> Dict[str, Any]:
    """
    Multi-Layer Risk Fusion Engine
    Combines:
    1. Environmental Risk (58% weight) - Temperature, solar radiation, humidity, low wind
    2. Thermal Stress (22% weight) - WBGT & UTCI physiological heat strain
    3. Population Vulnerability (14% weight) - Demographic vulnerable proportion, housing density, low canopy
    4. Exposure (6% weight) - Outdoor workforce intensity & active daytime exposure
    """
    
    # Calculate thermal indices
    hi_c, hi_cat = calculate_heat_index(temp_c, humidity_pct)
    wbgt_c, wbgt_cat = calculate_wbgt(temp_c, humidity_pct, wind_kmh, solar_radiation_level)
    utci_c, utci_cat = calculate_utci(temp_c, humidity_pct, wind_kmh, solar_radiation_level)
    
    # 1. Environmental component (0-100)
    solar_factor = {"Low": 20, "Moderate": 50, "High": 80, "Very High": 95, "Extreme": 100}.get(solar_radiation_level, 80)
    temp_norm = min(100.0, max(0.0, (temp_c - 25.0) / 20.0 * 100.0))
    hum_norm = min(100.0, max(0.0, (humidity_pct - 20.0) / 70.0 * 100.0))
    wind_penalty = max(0.0, (15.0 - wind_kmh) / 15.0 * 30.0)
    env_raw = (temp_norm * 0.45) + (solar_factor * 0.30) + (hum_norm * 0.20) + (wind_penalty * 0.05)
    
    # 2. Thermal stress component (0-100)
    hi_norm = min(100.0, max(0.0, (hi_c - 27.0) / 25.0 * 100.0))
    wbgt_norm = min(100.0, max(0.0, (wbgt_c - 22.0) / 15.0 * 100.0))
    utci_norm = min(100.0, max(0.0, (utci_c - 26.0) / 20.0 * 100.0))
    thermal_raw = (hi_norm * 0.4) + (wbgt_norm * 0.35) + (utci_norm * 0.25)
    
    # 3. Vulnerability component (0-100)
    vuln_ratio = (vulnerable_pop_count / max(1, total_pop)) * 100.0
    vuln_raw = (vuln_ratio * 2.0) + (dense_housing_pct * 0.4) + (max(0.0, 30.0 - green_cover_pct) * 1.5)
    vuln_raw = min(100.0, max(10.0, vuln_raw))
    
    # 4. Exposure component (0-100)
    exposure_raw = min(100.0, max(20.0, (dense_housing_pct * 0.8) + (solar_factor * 0.3)))
    
    # Weighted Multi-Layer Fusion (58% / 22% / 14% / 6%)
    score = int(round((env_raw * 0.58) + (thermal_raw * 0.22) + (vuln_raw * 0.14) + (exposure_raw * 0.06)))
    score = max(5, min(99, score))
    
    # Risk Level classification
    if score < 35:
        risk_level = "Low"
        priority = "Low"
    elif score < 60:
        risk_level = "Moderate"
        priority = "Medium"
    elif score < 80:
        risk_level = "High"
        priority = "High"
    elif score < 90:
        risk_level = "Very High"
        priority = "Critical"
    else:
        risk_level = "Extreme"
        priority = "Emergency"
        
    amplification = analyze_risk_amplification(temp_c, humidity_pct, wind_kmh, solar_radiation_level)
    
    return {
        "overall_risk_score": score,
        "risk_level": risk_level,
        "priority_level": priority,
        "environmental_risk_pct": 58,
        "thermal_stress_pct": 22,
        "vulnerability_pct": 14,
        "exposure_pct": 6,
        "heat_index_c": hi_c,
        "heat_index_category": hi_cat,
        "wbgt_c": wbgt_c,
        "wbgt_category": wbgt_cat,
        "utci_c": utci_c,
        "utci_category": utci_cat,
        "amplification": amplification
    }
