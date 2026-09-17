export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical' | 'Emergency';

export interface WeatherObservation {
  temperature_c: number;
  feels_like_c: number;
  humidity_pct: number;
  wind_speed_kmh: number;
  wind_direction: string;
  solar_radiation_level: string;
  solar_radiation_wm2: number;
  aqi: number;
  aqi_status: string;
  pm25: number;
  pm10: number;
  co: number;
  condition_text: string;
}

export interface ThermalStress {
  heat_index_c: number;
  heat_index_category: string;
  wbgt_c: number;
  wbgt_category: string;
  utci_c: number;
  utci_category: string;
  overall_thermal_status: string;
}

export interface RiskAssessment {
  overall_risk_score: number;
  risk_level: RiskLevel;
  environmental_risk_pct: number;
  thermal_stress_pct: number;
  vulnerability_pct: number;
  exposure_pct: number;
  trend_vs_yesterday: string;
  priority_level: PriorityLevel;
  amplification_level: string;
  amplification_summary: string;
}

export interface ForecastDay {
  day_name: string;
  date_str: string;
  full_date: string;
  temp_c: number;
  feels_like_c: number;
  humidity_pct: number;
  wind_kmh: number;
  solar_radiation: string;
  heat_risk_score: number;
  heat_index_c: number;
  wbgt_c: number;
  utci_c: number;
  risk_level: RiskLevel;
  thermal_stress: string;
  is_peak: boolean;
}

export interface AlertItem {
  id: string;
  zone_id: string;
  zone_name: string;
  title: string;
  severity: 'Moderate' | 'High' | 'Extreme';
  category: string;
  time_str: string;
  date_str: string;
  status: 'Active' | 'Resolved' | 'Historical';
  description: string;
  affected_population: string;
  protocol: string;
}

export interface DataSourceItem {
  id: string;
  name: string;
  category: string;
  provider: string;
  status: string;
  last_updated: string;
  refresh_frequency: string;
  coverage: string;
  latency_ms: number;
  reliability_pct: number;
}

export interface ZoneSummary {
  id: string;
  name: string;
  zone_type: string;
  center_lat: number;
  center_lon: number;
  population: number;
  vulnerable_pop_count: number;
  area_sqkm: number;
  green_cover_pct: number;
  dense_housing_pct: number;
  polygon_geojson?: {
    type: string;
    coordinates: number[][][];
  };
  weather: WeatherObservation;
  thermal_stress: ThermalStress;
  risk: RiskAssessment;
}

export interface OverviewData {
  location_name: string;
  selected_zone_name: string;
  selected_zone_id: string;
  last_updated: string;
  current_risk: RiskAssessment;
  current_weather: WeatherObservation;
  current_thermal: ThermalStress;
  key_stats: {
    vulnerable_population: string;
    priority_zones: number;
    risk_confidence: string;
    active_alerts: number;
  };
  risk_amplification: {
    level: string;
    combined_factors: Array<{ factor: string; trend: 'up' | 'down' }>;
    highlight_box: string;
  };
  risk_composition: {
    overall_score: number;
    layers: Array<{ name: string; pct: number; color: string }>;
  };
  forecast_5day: ForecastDay[];
  priority_zones: Array<{
    zone_id: string;
    zone_name: string;
    risk: string;
    vulnerability: string;
    priority: string;
  }>;
  ai_insights: {
    title: string;
    summary: string;
    bullets: string[];
    confidence_pct: number;
    model_version: string;
  };
  recommended_actions: Array<{
    id: string;
    title: string;
    category: string;
    priority: string;
    target: string;
    action: string;
    icon: string;
  }>;
  active_alerts: AlertItem[];
  data_sources: DataSourceItem[];
  zones_summary: ZoneSummary[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  ward: string;
  phone?: string;
  organization?: string;
  created_at?: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  ward: string;
  phone?: string;
  organization?: string;
}
