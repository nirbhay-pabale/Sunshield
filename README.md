# SUNSHIELD — AI-Powered Extreme Heat Risk Intelligence Platform

> **"Safer Today. Healthier Tomorrow."**
> **Autonomous Extreme Heatwave Early Warning, Urban Microclimate Resilience & Human Thermal Stress Prediction**

---

## 🌍 Overview

**SUNSHIELD** is an environmental intelligence platform engineered to predict, detect, and mitigate extreme urban heat risks across municipal administrative wards. Moving beyond traditional raw temperature measurements, SUNSHIELD leverages **biometeorological physics engines** (NOAA Rothfusz Heat Index, ISO 7243 WBGT, UTCI) and multi-source data fusion (Satellite thermal imagery, AWS ground stations, IoT telemetry, demographic vulnerability indexes) to deliver actionable decision support for municipal authorities, disaster response teams, and public health officials.

---

## 🌟 Core Innovations & Capabilities

1. **Multi-Source Environmental Fusion**: Combines Satellite thermal layers, municipal AWS sensor telemetry, and demographic census records.
2. **Physiological Heat Stress Modeling**:
   - **NOAA Rothfusz Heat Index**: Apparent temperature accounting for vapor pressure and relative humidity.
   - **ISO 7243 Wet-Bulb Globe Temperature (WBGT)**: Occupational heat strain index assessing solar radiation and wind speed.
   - **Universal Thermal Climate Index (UTCI)**: Comprehensive human biometeorological heat balance.
3. **Compound Risk Amplification Engine**: Evaluates synergistic environmental hazards (e.g., Extreme Solar Radiation + Low Wind Circulation + High Urban Canopy Deficit).
4. **Interactive GIS Microclimate Mapping**: Multi-layer geospatial mapping supporting OpenStreetMap and Esri High-Resolution Satellite imagery with ward-by-ward risk overlays.
5. **Predictive 5-Day Health Trajectory**: Diurnal hourly forecasts highlighting peak exposure windows (11:30 AM – 4:30 PM).
6. **Automated Heat Action Plan (HAP) Directives**: Instant operational triggers for emergency cooling shelters, hospital triage readiness, and occupational labor shift modifications.
7. **Official Forensic PDF Dossier Generator**: One-click generation and export of multi-page municipal compliance reports with interactive charts and cryptographic integrity hashing.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 19 + TypeScript + Vite
  - TailwindCSS (Clean Modern Design System)
  - Typography: **Space Grotesk** (Display / Brand) + **Inter** (Primary UI)
  - Leaflet + React-Leaflet (Real-Time Interactive GIS)
  - Recharts (Biometeorological progression, demographics, and risk weightage charts)
  - Lucide React Icons
  - jsPDF + html2canvas (Client-side PDF dossier rendering)
- **Backend**:
  - FastAPI (Python 3.10+)
  - NumPy & SciPy (Biometeorological algorithms)
  - SQLite + SQLAlchemy / InMemory Caching
  - Pytest Suite
  - Pydantic v2 schemas

---


## 📜 License
This project is developed for Municipal Disaster Management, Climate Resilience, and Smart City Innovation.
