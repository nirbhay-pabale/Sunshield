from typing import List, Dict, Any

PUNE_LOCATION = {
    "id": "pune-city",
    "name": "Pune City",
    "state": "Maharashtra",
    "country": "India",
    "lat": 18.5204,
    "lon": 73.8567,
    "elevation_m": 560.0,
    "total_population": 3850000
}

DATA_SOURCES_SEED = [
    {
        "id": "ds-insat-3d",
        "name": "Satellite Thermal Radiometer (INSAT-3DR / Landsat-9)",
        "category": "Satellite",
        "provider": "ISRO / MOSDAC & NASA USGS",
        "status": "Active",
        "last_updated": "10:32 AM | 24 Apr 2025",
        "refresh_frequency": "15 minutes",
        "coverage": "Pune Metropolitan Area (1km LST Grid)",
        "latency_ms": 118,
        "reliability_pct": 99.8
    },
    {
        "id": "ds-imd-aws",
        "name": "IMD Automated Weather Stations (AWS)",
        "category": "Weather",
        "provider": "India Meteorological Department (Shivajinagar / Pashan)",
        "status": "Active",
        "last_updated": "10:30 AM | 24 Apr 2025",
        "refresh_frequency": "10 minutes",
        "coverage": "12 Microclimate Monitoring Nodes",
        "latency_ms": 64,
        "reliability_pct": 99.4
    },
    {
        "id": "ds-iot-hyperlocal",
        "name": "Ground Hyperlocal IoT Heat & AQI Sensor Mesh",
        "category": "Sensors",
        "provider": "Pune Smart City Development Corp (PSCDCL)",
        "status": "Active",
        "last_updated": "10:31 AM | 24 Apr 2025",
        "refresh_frequency": "5 minutes",
        "coverage": "48 Street-Level IoT Environmental Pods",
        "latency_ms": 42,
        "reliability_pct": 98.9
    },
    {
        "id": "ds-ground-traffic",
        "name": "Ground Traffic & Urban Heat Albedo Survey",
        "category": "Ground",
        "provider": "PMC Urban Planning GIS Cell",
        "status": "Active",
        "last_updated": "09:00 AM | 24 Apr 2025",
        "refresh_frequency": "Hourly",
        "coverage": "Key Transport Corridors & Road Heat Reflection",
        "latency_ms": 210,
        "reliability_pct": 97.5
    },
    {
        "id": "ds-census-demographic",
        "name": "Demographic & Vulnerability Census Register",
        "category": "Demographic",
        "provider": "PMC Health Dept & Census of India GIS",
        "status": "Active",
        "last_updated": "08:00 AM | 24 Apr 2025",
        "refresh_frequency": "Weekly Sync",
        "coverage": "10 Administrative Wards (Age >60, Slum Clusters, Gig Labor)",
        "latency_ms": 15,
        "reliability_pct": 100.0
    }
]

PUNE_ZONES_SEED = [
    {
        "id": "central-pune",
        "name": "Central Pune",
        "zone_type": "High Density Urban Core",
        "center_lat": 18.5204,
        "center_lon": 73.8567,
        "population": 420000,
        "vulnerable_pop_count": 84000,
        "area_sqkm": 14.2,
        "green_cover_pct": 8.5,
        "dense_housing_pct": 68.0,
        "polygon_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [73.8400, 18.5300],
                [73.8700, 18.5300],
                [73.8750, 18.5100],
                [73.8450, 18.5050],
                [73.8400, 18.5300]
            ]]
        },
        "weather": {
            "temperature_c": 39.0,
            "feels_like_c": 44.0,
            "humidity_pct": 62.0,
            "wind_speed_kmh": 8.0,
            "wind_direction": "NW",
            "solar_radiation_level": "Very High",
            "solar_radiation_wm2": 880.0,
            "aqi": 128,
            "aqi_status": "Moderate",
            "pm25": 58.0,
            "pm10": 92.0,
            "co": 1.2,
            "condition_text": "Sunny & Extreme Thermal Load"
        },
        "thermal_stress": {
            "heat_index_c": 44.0,
            "heat_index_category": "Very High",
            "wbgt_c": 31.4,
            "wbgt_category": "High",
            "utci_c": 41.2,
            "utci_category": "Very High",
            "overall_thermal_status": "Very High"
        },
        "risk": {
            "overall_risk_score": 78,
            "risk_level": "High",
            "environmental_risk_pct": 58,
            "thermal_stress_pct": 22,
            "vulnerability_pct": 14,
            "exposure_pct": 6,
            "trend_vs_yesterday": "+12%",
            "priority_level": "Critical",
            "amplification_level": "High",
            "amplification_summary": "High humidity + very high solar radiation + low wind = increased thermal stress."
        }
    },
    {
        "id": "hadapsar",
        "name": "Hadapsar",
        "zone_type": "Industrial & Residential Hub",
        "center_lat": 18.5089,
        "center_lon": 73.9259,
        "population": 360000,
        "vulnerable_pop_count": 72000,
        "area_sqkm": 21.5,
        "green_cover_pct": 11.2,
        "dense_housing_pct": 55.0,
        "polygon_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [73.9000, 18.5250],
                [73.9550, 18.5200],
                [73.9600, 18.4900],
                [73.9050, 18.4950],
                [73.9000, 18.5250]
            ]]
        },
        "weather": {
            "temperature_c": 40.0,
            "feels_like_c": 45.2,
            "humidity_pct": 60.0,
            "wind_speed_kmh": 7.0,
            "wind_direction": "W",
            "solar_radiation_level": "Very High",
            "solar_radiation_wm2": 910.0,
            "aqi": 142,
            "aqi_status": "Moderate",
            "pm25": 64.0,
            "pm10": 105.0,
            "co": 1.5,
            "condition_text": "Intense Radiation & Industrial Heat Trapping"
        },
        "thermal_stress": {
            "heat_index_c": 45.2,
            "heat_index_category": "Very High",
            "wbgt_c": 31.8,
            "wbgt_category": "Very High",
            "utci_c": 42.0,
            "utci_category": "Very High",
            "overall_thermal_status": "Very High"
        },
        "risk": {
            "overall_risk_score": 81,
            "risk_level": "Very High",
            "environmental_risk_pct": 60,
            "thermal_stress_pct": 24,
            "vulnerability_pct": 11,
            "exposure_pct": 5,
            "trend_vs_yesterday": "+15%",
            "priority_level": "High",
            "amplification_level": "High",
            "amplification_summary": "Intense solar flux + high industrial density + low wind = compound thermal hazard."
        }
    },
    {
        "id": "kharadi",
        "name": "Kharadi",
        "zone_type": "IT Corridor & Dense Development",
        "center_lat": 18.5514,
        "center_lon": 73.9348,
        "population": 290000,
        "vulnerable_pop_count": 42000,
        "area_sqkm": 16.8,
        "green_cover_pct": 14.0,
        "dense_housing_pct": 48.0,
        "polygon_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [73.9150, 18.5650],
                [73.9600, 18.5600],
                [73.9550, 18.5350],
                [73.9100, 18.5380],
                [73.9150, 18.5650]
            ]]
        },
        "weather": {
            "temperature_c": 38.5,
            "feels_like_c": 43.1,
            "humidity_pct": 58.0,
            "wind_speed_kmh": 9.0,
            "wind_direction": "NW",
            "solar_radiation_level": "Very High",
            "solar_radiation_wm2": 870.0,
            "aqi": 115,
            "aqi_status": "Moderate",
            "pm25": 52.0,
            "pm10": 84.0,
            "co": 1.1,
            "condition_text": "Strong Solar Glare"
        },
        "thermal_stress": {
            "heat_index_c": 43.1,
            "heat_index_category": "Very High",
            "wbgt_c": 30.6,
            "wbgt_category": "High",
            "utci_c": 40.5,
            "utci_category": "Very High",
            "overall_thermal_status": "High"
        },
        "risk": {
            "overall_risk_score": 74,
            "risk_level": "High",
            "environmental_risk_pct": 56,
            "thermal_stress_pct": 22,
            "vulnerability_pct": 15,
            "exposure_pct": 7,
            "trend_vs_yesterday": "+9%",
            "priority_level": "High",
            "amplification_level": "Moderate",
            "amplification_summary": "High solar radiation combined with extensive concrete reflective surfaces."
        }
    },
    {
        "id": "wakad",
        "name": "Wakad",
        "zone_type": "Suburban Tech & Residential",
        "center_lat": 18.5987,
        "center_lon": 73.7667,
        "population": 250000,
        "vulnerable_pop_count": 31000,
        "area_sqkm": 15.0,
        "green_cover_pct": 18.5,
        "dense_housing_pct": 38.0,
        "polygon_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [73.7450, 18.6150],
                [73.7900, 18.6100],
                [73.7850, 18.5800],
                [73.7400, 18.5850],
                [73.7450, 18.6150]
            ]]
        },
        "weather": {
            "temperature_c": 37.5,
            "feels_like_c": 40.8,
            "humidity_pct": 54.0,
            "wind_speed_kmh": 11.0,
            "wind_direction": "W",
            "solar_radiation_level": "High",
            "solar_radiation_wm2": 790.0,
            "aqi": 102,
            "aqi_status": "Moderate",
            "pm25": 45.0,
            "pm10": 74.0,
            "co": 0.9,
            "condition_text": "Breezy & Warm"
        },
        "thermal_stress": {
            "heat_index_c": 40.8,
            "heat_index_category": "Extreme Caution",
            "wbgt_c": 29.1,
            "wbgt_category": "Moderate",
            "utci_c": 38.0,
            "utci_category": "High",
            "overall_thermal_status": "Moderate"
        },
        "risk": {
            "overall_risk_score": 62,
            "risk_level": "Moderate",
            "environmental_risk_pct": 52,
            "thermal_stress_pct": 20,
            "vulnerability_pct": 18,
            "exposure_pct": 10,
            "trend_vs_yesterday": "+4%",
            "priority_level": "Medium",
            "amplification_level": "Moderate",
            "amplification_summary": "Moderate wind dissipation mitigating peak afternoon heat stress."
        }
    },
    {
        "id": "pimpri-chinchwad",
        "name": "Pimpri-Chinchwad",
        "zone_type": "Manufacturing & Automobile Corridor",
        "center_lat": 18.6279,
        "center_lon": 73.7997,
        "population": 480000,
        "vulnerable_pop_count": 88000,
        "area_sqkm": 28.0,
        "green_cover_pct": 13.0,
        "dense_housing_pct": 52.0,
        "polygon_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [73.7700, 18.6500],
                [73.8300, 18.6450],
                [73.8250, 18.6100],
                [73.7650, 18.6150],
                [73.7700, 18.6500]
            ]]
        },
        "weather": {
            "temperature_c": 39.2,
            "feels_like_c": 43.8,
            "humidity_pct": 56.0,
            "wind_speed_kmh": 8.5,
            "wind_direction": "NW",
            "solar_radiation_level": "Very High",
            "solar_radiation_wm2": 885.0,
            "aqi": 135,
            "aqi_status": "Moderate",
            "pm25": 61.0,
            "pm10": 98.0,
            "co": 1.4,
            "condition_text": "High Thermal Inversion & Factory Emission Mix"
        },
        "thermal_stress": {
            "heat_index_c": 43.8,
            "heat_index_category": "Very High",
            "wbgt_c": 31.0,
            "wbgt_category": "High",
            "utci_c": 41.0,
            "utci_category": "Very High",
            "overall_thermal_status": "Very High"
        },
        "risk": {
            "overall_risk_score": 76,
            "risk_level": "High",
            "environmental_risk_pct": 57,
            "thermal_stress_pct": 23,
            "vulnerability_pct": 14,
            "exposure_pct": 6,
            "trend_vs_yesterday": "+10%",
            "priority_level": "High",
            "amplification_level": "High",
            "amplification_summary": "High particulate loading elevating radiative heat absorption in factory zones."
        }
    },
    {
        "id": "kothrud",
        "name": "Kothrud",
        "zone_type": "Established Residential & Hills Slope",
        "center_lat": 18.5074,
        "center_lon": 73.8077,
        "population": 310000,
        "vulnerable_pop_count": 48000,
        "area_sqkm": 16.2,
        "green_cover_pct": 24.5,
        "dense_housing_pct": 32.0,
        "polygon_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [73.7850, 18.5250],
                [73.8300, 18.5200],
                [73.8250, 18.4900],
                [73.7800, 18.4950],
                [73.7850, 18.5250]
            ]]
        },
        "weather": {
            "temperature_c": 36.8,
            "feels_like_c": 38.9,
            "humidity_pct": 52.0,
            "wind_speed_kmh": 12.0,
            "wind_direction": "SW",
            "solar_radiation_level": "Moderate",
            "solar_radiation_wm2": 710.0,
            "aqi": 88,
            "aqi_status": "Satisfactory",
            "pm25": 36.0,
            "pm10": 58.0,
            "co": 0.7,
            "condition_text": "Good Canopy Shading & Hill Airflow"
        },
        "thermal_stress": {
            "heat_index_c": 38.9,
            "heat_index_category": "Extreme Caution",
            "wbgt_c": 27.9,
            "wbgt_category": "Moderate",
            "utci_c": 36.2,
            "utci_category": "High",
            "overall_thermal_status": "Moderate"
        },
        "risk": {
            "overall_risk_score": 54,
            "risk_level": "Moderate",
            "environmental_risk_pct": 48,
            "thermal_stress_pct": 18,
            "vulnerability_pct": 22,
            "exposure_pct": 12,
            "trend_vs_yesterday": "-2%",
            "priority_level": "Medium",
            "amplification_level": "Low",
            "amplification_summary": "Active tree canopy cooling and westerly ridge winds reducing human thermal load."
        }
    },
    {
        "id": "sinhagad-rd",
        "name": "Sinhagad Road",
        "zone_type": "River Valley Residential",
        "center_lat": 18.4725,
        "center_lon": 73.8189,
        "population": 220000,
        "vulnerable_pop_count": 32000,
        "area_sqkm": 14.8,
        "green_cover_pct": 28.0,
        "dense_housing_pct": 28.0,
        "polygon_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [73.7950, 18.4900],
                [73.8400, 18.4850],
                [73.8350, 18.4550],
                [73.7900, 18.4600],
                [73.7950, 18.4900]
            ]]
        },
        "weather": {
            "temperature_c": 36.0,
            "feels_like_c": 37.4,
            "humidity_pct": 50.0,
            "wind_speed_kmh": 14.0,
            "wind_direction": "SW",
            "solar_radiation_level": "Moderate",
            "solar_radiation_wm2": 680.0,
            "aqi": 76,
            "aqi_status": "Satisfactory",
            "pm25": 30.0,
            "pm10": 51.0,
            "co": 0.6,
            "condition_text": "River Breeze & Low Thermal Strain"
        },
        "thermal_stress": {
            "heat_index_c": 37.4,
            "heat_index_category": "Caution",
            "wbgt_c": 26.8,
            "wbgt_category": "Moderate",
            "utci_c": 34.5,
            "utci_category": "Moderate",
            "overall_thermal_status": "Low"
        },
        "risk": {
            "overall_risk_score": 48,
            "risk_level": "Low",
            "environmental_risk_pct": 42,
            "thermal_stress_pct": 16,
            "vulnerability_pct": 26,
            "exposure_pct": 16,
            "trend_vs_yesterday": "-5%",
            "priority_level": "Low",
            "amplification_level": "Low",
            "amplification_summary": "Valley microclimate and Mutha river riparian zone maintaining lower ambient temperatures."
        }
    }
]
