from typing import List, Dict, Any
from datetime import datetime

class AlertManager:
    """
    Manages active, resolved, and historical heat-health alert lifecycles and broadcast channels.
    """
    def __init__(self):
        self.channel_status = {
            "Dashboard": {"status": "Active", "type": "Live WebSockets / Push", "active_count": 3},
            "SMS Broadcast": {"status": "Integration Ready", "type": "Telecom Gateway (CDAC / TRAI)", "recipient_reach": "240,000"},
            "WhatsApp Business API": {"status": "Integration Ready", "type": "Meta Cloud API Webhook", "template_approved": True},
            "Municipal CAP Feed": {"status": "Integration Ready", "type": "NDMA Common Alerting Protocol v1.2", "endpoint": "/api/cap/feed"}
        }

    def get_initial_alerts(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "ALT-2025-0424-01",
                "zone_id": "central-pune",
                "zone_name": "Central Pune",
                "title": "Extreme Heat Risk — Central Pune",
                "severity": "High",
                "category": "Thermal Stress & WBGT Alert",
                "time_str": "10:12 AM",
                "date_str": "24 Apr 2025",
                "status": "Active",
                "description": "UTCI exceeded 41.2°C with 62% humidity. Extreme physiological heat stress detected in high-density commercial corridors (Mandai, Swargate, FC Road).",
                "affected_population": "84,000 vulnerable residents & daily commuters",
                "protocol": "Deploy emergency misting fans, open 6 cooling centers, suspend road construction work until 4:30 PM."
            },
            {
                "id": "ALT-2025-0424-02",
                "zone_id": "hadapsar",
                "zone_name": "Hadapsar",
                "title": "Outdoor Exposure — Hadapsar",
                "severity": "High",
                "category": "Occupational Hazard Warning",
                "time_str": "09:48 AM",
                "date_str": "24 Apr 2025",
                "status": "Active",
                "description": "Solar radiation levels reached 910 W/m² with WBGT at 31.8°C across Hadapsar industrial belt and Magarpatta outdoor zones.",
                "affected_population": "52,000 industrial and logistics outdoor workforce",
                "protocol": "Notify factory safety supervisors; ensure mandatory 15-minute rest intervals every 45 minutes of manual labor."
            },
            {
                "id": "ALT-2025-0424-03",
                "zone_id": "kharadi",
                "zone_name": "Kharadi",
                "title": "Rising Risk — Kharadi",
                "severity": "Moderate",
                "category": "Microclimate Surge Warning",
                "time_str": "08:30 AM",
                "date_str": "24 Apr 2025",
                "status": "Active",
                "description": "Rapid temperature elevation rate (+2.4°C/hr) observed at Kharadi IoT sensor cluster. Heat Index projected to touch 43°C by noon.",
                "affected_population": "38,000 tech park commuters and construction workers",
                "protocol": "Pre-position water supply units at EON Free Zone transit hubs and municipal bus stands."
            },
            {
                "id": "ALT-2025-0423-04",
                "zone_id": "wakad",
                "zone_name": "Wakad",
                "title": "Evening Thermal Trapping Advisory — Wakad",
                "severity": "Moderate",
                "category": "Urban Heat Island",
                "time_str": "06:15 PM",
                "date_str": "23 Apr 2025",
                "status": "Resolved",
                "description": "Asphalt radiation sustained surface temperatures above 36°C past sunset. Convective cooling restored after 9 PM.",
                "affected_population": "28,000 high-rise residential occupants",
                "protocol": "Resolved: Ambient temperature dropped to 29°C with evening breeze."
            },
            {
                "id": "ALT-2025-0422-05",
                "zone_id": "kothrud",
                "zone_name": "Kothrud",
                "title": "Moderate Heat Stress — Kothrud",
                "severity": "Moderate",
                "category": "Public Advisory",
                "time_str": "11:30 AM",
                "date_str": "22 Apr 2025",
                "status": "Historical",
                "description": "Heat Index peaked at 39°C. Community hydration points served 4,200 citizens.",
                "affected_population": "19,000 elderly residents",
                "protocol": "Historical event logged for climate resilience benchmarking."
            }
        ]

alert_manager = AlertManager()
