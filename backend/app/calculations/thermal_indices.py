import math
from typing import Dict, Any, Tuple

def calculate_heat_index(temp_c: float, humidity: float) -> Tuple[float, str]:
    """
    Calculate NOAA Heat Index using Rothfusz regression equation.
    temp_c: Temperature in Celsius
    humidity: Relative Humidity in % (0-100)
    Returns: (heat_index_c, category)
    """
    temp_f = (temp_c * 9.0 / 5.0) + 32.0
    
    # If temp is below 80F (26.7C), Steadman formula simple approximation
    if temp_f < 80.0:
        hi_f = 0.5 * (temp_f + 61.0 + ((temp_f - 68.0) * 1.2) + (humidity * 0.094))
    else:
        # Full Rothfusz regression
        hi_f = (-42.379 + 
                2.04901523 * temp_f + 
                10.14333127 * humidity - 
                0.22475541 * temp_f * humidity - 
                0.00683783 * (temp_f ** 2) - 
                0.05481717 * (humidity ** 2) + 
                0.00122874 * (temp_f ** 2) * humidity + 
                0.00085282 * temp_f * (humidity ** 2) - 
                0.00000199 * (temp_f ** 2) * (humidity ** 2))
        
        # Adjustments
        if humidity < 13 and 80 <= temp_f <= 112:
            adj = ((13 - humidity) / 4) * math.sqrt((17 - abs(temp_f - 95.0)) / 17)
            hi_f -= adj
        elif humidity > 85 and 80 <= temp_f <= 87:
            adj = ((humidity - 85) / 10) * ((87 - temp_f) / 5)
            hi_f += adj

    hi_c = round((hi_f - 32.0) * 5.0 / 9.0, 1)
    
    # Classify Heat Index category
    if hi_c < 27:
        category = "Normal"
    elif hi_c < 32:
        category = "Caution"
    elif hi_c < 41:
        category = "Extreme Caution"
    elif hi_c < 54:
        category = "Very High"
    else:
        category = "Extreme"
        
    return hi_c, category


def calculate_wet_bulb_temp(temp_c: float, humidity: float) -> float:
    """
    Calculate Wet Bulb Temperature using Stull (2011) empirical formula.
    """
    T = temp_c
    RH = humidity
    
    tw = (T * math.atan(0.151977 * math.sqrt(RH + 8.313659)) +
          math.atan(T + RH) -
          math.atan(RH - 1.676331) +
          0.00391838 * (RH ** 1.5) * math.atan(0.023101 * RH) -
          4.686035)
    return round(tw, 2)


def calculate_wbgt(temp_c: float, humidity: float, wind_kmh: float, solar_radiation_level: str) -> Tuple[float, str]:
    """
    Calculate Wet Bulb Globe Temperature (WBGT) estimation for outdoor heat stress.
    Standard biometeorological formula calibrated for Indian subtropical summer conditions:
    WBGT = 0.7 * Tw + 0.2 * Tg + 0.1 * Ta
    """
    Tw = calculate_wet_bulb_temp(temp_c, humidity)
    wind_ms = max(0.5, wind_kmh / 3.6)
    
    # Solar radiation factor
    solar_map = {
        "Low": 0.5,
        "Moderate": 1.2,
        "High": 2.2,
        "Very High": 3.0,
        "Extreme": 4.0
    }
    solar_delta = solar_map.get(solar_radiation_level, 2.5)
    
    # Simplified outdoor WBGT approximation (Lemke & Kjellstrom / Australian Bureau of Meteorology method)
    # where e is water vapor pressure in hPa
    e = (humidity / 100.0) * 6.105 * math.exp((17.27 * temp_c) / (237.7 + temp_c))
    wbgt = round(0.567 * temp_c + 0.393 * e + 3.94 + solar_delta - (0.35 * math.sqrt(wind_ms)) - 14.2, 1)
    
    # Categorization based on occupational health standards (ACGIH / OSHA / ISO 7243)
    if wbgt < 26.0:
        category = "Low"
    elif wbgt < 29.0:
        category = "Moderate"
    elif wbgt < 32.5:
        category = "High"
    elif wbgt < 35.0:
        category = "Very High"
    else:
        category = "Extreme"
        
    return wbgt, category


def calculate_utci(temp_c: float, humidity: float, wind_kmh: float, solar_radiation_level: str) -> Tuple[float, str]:
    """
    Calculate Universal Thermal Climate Index (UTCI) approximation.
    UTCI assesses human biometeorological stress based on multi-node human thermoregulation.
    """
    v10 = max(0.5, wind_kmh / 3.6) # wind speed at 10m
    
    # Mean radiant temperature delta approximation from solar flux and wind
    solar_factor = {"Low": 4.0, "Moderate": 8.0, "High": 12.0, "Very High": 15.0, "Extreme": 18.0}.get(solar_radiation_level, 12.0)
    tmrt = temp_c + (solar_factor / math.sqrt(v10))
    
    # UTCI thermal offset model
    delta_tmrt = tmrt - temp_c
    rh_factor = (humidity - 50.0) * 0.08
    wind_cooling = (math.sqrt(v10) - 1.0) * 1.2
    
    utci_val = round(temp_c + (0.45 * delta_tmrt) + rh_factor - wind_cooling + 0.03 * (temp_c - 25.0), 1)
    
    # Standard UTCI Stress Categories
    if utci_val < 9:
        category = "Cold Stress"
    elif utci_val <= 26:
        category = "No Thermal Stress"
    elif utci_val <= 32:
        category = "Moderate"
    elif utci_val <= 38:
        category = "High"
    elif utci_val <= 46:
        category = "Very High"
    else:
        category = "Extreme Heat Stress"
        
    return utci_val, category


def analyze_risk_amplification(temp_c: float, humidity: float, wind_kmh: float, solar_rad: str) -> Dict[str, Any]:
    """
    Detect compound environmental factors that multiply human thermal stress danger.
    """
    factors = []
    is_high_humidity = humidity >= 55.0
    is_high_solar = solar_rad in ["High", "Very High", "Extreme"]
    is_low_wind = wind_kmh <= 10.0
    is_extreme_temp = temp_c >= 38.0
    
    if is_high_humidity:
        factors.append({"factor": "High Humidity", "trend": "up", "desc": f"{humidity}% impairs sweat evaporation cooling"})
    if is_high_solar:
        factors.append({"factor": "Very High Solar Radiation", "trend": "up", "desc": f"{solar_rad} intensifies radiant heat absorption"})
    if is_low_wind:
        factors.append({"factor": "Low Wind Speed", "trend": "down", "desc": f"{wind_kmh} km/h reduces convective heat dissipation"})
    if is_extreme_temp:
        factors.append({"factor": "Extreme Ambient Heat", "trend": "up", "desc": f"{temp_c}°C exceeds normal body core skin gradient"})
        
    amplification_score = len(factors)
    if amplification_score >= 3:
        level = "High"
        summary = "High humidity + very high solar radiation + low wind = increased thermal stress."
    elif amplification_score == 2:
        level = "Moderate"
        summary = "Multiple compounding climate drivers elevating human physiological strain."
    else:
        level = "Low"
        summary = "Environmental factors within standard convective dispersion tolerances."
        
    return {
        "level": level,
        "factors": factors,
        "summary": summary,
        "active_triggers_count": amplification_score
    }
