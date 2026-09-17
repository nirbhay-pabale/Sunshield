import React, { useState } from 'react';
import { useApp, MapLayer } from '../context/AppContext';
import { CircularGauge } from '../components/common/MetricGauge';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Bell, 
  TrendingUp, 
  ArrowRight, 
  AlertTriangle,
  Clock,
  Activity,
  Layers,
  Sparkles,
  Info,
  Radio
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup, Polygon, Tooltip as LeafletTooltip } from 'react-leaflet';

export const OverviewPage: React.FC = () => {
  const { 
    overviewData, 
    zones, 
    selectedZoneId, 
    setSelectedZoneId, 
    setActiveTab, 
    openZoneDrawer,
    mapLayer,
    setMapLayer
  } = useApp();

  const [aqiModalOpen, setAqiModalOpen] = useState(false);
  const [selectedForecastDay, setSelectedForecastDay] = useState<number | null>(null);

  const curWeather = overviewData.current_weather;
  const curThermal = overviewData.current_thermal;
  const curRisk = overviewData.current_risk;
  const stats = overviewData.key_stats;

  // Donut chart data for Multi-Layer Risk Fusion
  const fusionData = overviewData.risk_composition.layers.map(l => ({
    name: l.name,
    value: l.pct,
    color: l.color
  }));

  // Zone map coordinates helper
  const getZoneColor = (zoneRisk: string) => {
    switch (zoneRisk) {
      case 'Extreme': return '#991b1b';
      case 'Very High': return '#ef4444';
      case 'High': return '#ea580c';
      case 'Moderate': return '#eab308';
      case 'Low': return '#2e7d32';
      default: return '#2e7d32';
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* TOP ROW: 4 MAJOR SUMMARY CARDS                                           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        {/* CARD 1: OVERALL HEAT RISK */}
        <div className="bg-white rounded-2xl border border-[#dfebe1] p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-[#dcf0e2] text-[#236c43] flex items-center justify-center">
              <Thermometer className="w-4 h-4" />
            </div>
            <h2 className="text-[15px] font-semibold leading-[1.3] text-[#143d2b]">Overall Heat Risk</h2>
          </div>

          <div className="flex items-center justify-between gap-2 my-1">
            <div className="shrink-0">
              <CircularGauge
                value={curRisk.overall_risk_score}
                max={100}
                label={curRisk.risk_level}
                sublabel={`${curRisk.overall_risk_score}/100`}
                color={curRisk.risk_level === 'High' || curRisk.risk_level === 'Very High' ? '#ea580c' : '#2e7d32'}
                size={110}
              />
            </div>

            <div className="space-y-2 text-right">
              <div>
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#dc2626] bg-[#fee2e2] px-2.5 py-0.5 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" /> {curRisk.trend_vs_yesterday}
                </span>
                <span className="block text-[11px] text-[#718f80] mt-0.5 font-normal">vs. yesterday</span>
              </div>
              <div className="border-t border-[#e8f0ea] pt-1.5">
                <span className="text-[11px] text-[#718f80] block font-normal">Selected Area</span>
                <span className="text-[13px] font-semibold text-[#143d2b]">{overviewData.selected_zone_name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: CURRENT ENVIRONMENTAL CONDITIONS */}
        <div className="bg-white rounded-2xl border border-[#dfebe1] p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-[#dcf0e2] text-[#236c43] flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
            <h2 className="text-[15px] font-semibold leading-[1.3] text-[#143d2b]">Current Conditions</h2>
          </div>

          <div className="grid grid-cols-2 gap-2 my-auto">
            {/* Temp */}
            <div className="bg-[#f7faf8] p-2.5 rounded-xl border border-[#e5efe8]">
              <div className="flex items-center gap-1 text-[12px] font-medium leading-[1.3] text-[#658475]">
                <Thermometer className="w-3.5 h-3.5 text-[#ea580c]" /> Temperature
              </div>
              <div className="text-[24px] font-semibold leading-[1.1] text-[#143d2b] mt-0.5">{curWeather.temperature_c}°C</div>
              <div className="text-[11px] text-[#e05e19] font-medium">Feels like {curWeather.feels_like_c}°C</div>
            </div>

            {/* Humidity */}
            <div className="bg-[#f7faf8] p-2.5 rounded-xl border border-[#e5efe8]">
              <div className="flex items-center gap-1 text-[12px] font-medium leading-[1.3] text-[#658475]">
                <Droplets className="w-3.5 h-3.5 text-[#0284c7]" /> Humidity
              </div>
              <div className="text-[24px] font-semibold leading-[1.1] text-[#143d2b] mt-0.5">{curWeather.humidity_pct}%</div>
              <div className="text-[11px] text-[#769384] font-normal">High moisture</div>
            </div>

            {/* Wind */}
            <div className="bg-[#f7faf8] p-2.5 rounded-xl border border-[#e5efe8]">
              <div className="flex items-center gap-1 text-[12px] font-medium leading-[1.3] text-[#658475]">
                <Wind className="w-3.5 h-3.5 text-[#059669]" /> Wind Speed
              </div>
              <div className="text-[24px] font-semibold leading-[1.1] text-[#143d2b] mt-0.5">{curWeather.wind_speed_kmh} km/h</div>
              <div className="text-[11px] text-[#769384] font-normal">Dir: {curWeather.wind_direction}</div>
            </div>

            {/* Solar Radiation */}
            <div className="bg-[#f7faf8] p-2.5 rounded-xl border border-[#e5efe8]">
              <div className="flex items-center gap-1 text-[12px] font-medium leading-[1.3] text-[#658475]">
                <Sun className="w-3.5 h-3.5 text-[#eab308]" /> Solar Radiation
              </div>
              <div className="text-[14px] font-semibold text-[#143d2b] mt-1 truncate">{curWeather.solar_radiation_level}</div>
              <div className="text-[11px] text-[#769384] font-normal">{curWeather.solar_radiation_wm2} W/m²</div>
            </div>
          </div>
        </div>

        {/* CARD 3: AIR QUALITY (AQI) */}
        <div className="bg-white rounded-2xl border border-[#dfebe1] p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-[#dcf0e2] text-[#236c43] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <h2 className="text-[15px] font-semibold leading-[1.3] text-[#143d2b]">Air Quality (AQI)</h2>
          </div>

          <div className="flex items-center justify-between gap-2 my-auto">
            <div className="shrink-0">
              <CircularGauge
                value={curWeather.aqi}
                max={300}
                label={`${curWeather.aqi}`}
                sublabel={curWeather.aqi_status}
                color="#eab308"
                size={95}
                strokeWidth={8}
              />
            </div>

            <div className="space-y-1.5 text-[13px]">
              <div className="flex items-center justify-between gap-3 text-[#496758]">
                <span className="font-normal">PM2.5</span>
                <span className="font-semibold text-[#143d2b]">{curWeather.pm25} µg/m³</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[#496758]">
                <span className="font-normal">PM10</span>
                <span className="font-semibold text-[#143d2b]">{curWeather.pm10} µg/m³</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[#496758]">
                <span className="font-normal">CO</span>
                <span className="font-semibold text-[#143d2b]">{curWeather.co} mg/m³</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setAqiModalOpen(true)}
            className="text-[12px] font-semibold text-[#236c43] hover:text-[#143d2b] flex items-center gap-1 mt-2 pt-2 border-t border-[#edf4ee] transition-colors cursor-pointer"
          >
            View Air Quality Details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CARD 4: KEY STATS */}
        <div className="bg-white rounded-2xl border border-[#dfebe1] p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-[#dcf0e2] text-[#236c43] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-[15px] font-semibold leading-[1.3] text-[#143d2b]">Key Stats</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 my-auto">
            {/* Stat 1: Vulnerable Pop */}
            <div 
              onClick={() => setActiveTab('vulnerable-zones')}
              className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#f3f9f5] cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#e8f5ec] text-[#236c43] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-[#6b8c7d] block font-normal leading-tight">Vulnerable Population</span>
                <span className="text-[15px] font-semibold text-[#143d2b]">{stats.vulnerable_population}</span>
              </div>
            </div>

            {/* Stat 2: Priority Zones */}
            <div 
              onClick={() => setActiveTab('vulnerable-zones')}
              className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#f3f9f5] cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#e8f5ec] text-[#236c43] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-[#6b8c7d] block font-normal leading-tight">Priority Zones</span>
                <span className="text-[15px] font-semibold text-[#143d2b]">{stats.priority_zones}</span>
              </div>
            </div>

            {/* Stat 3: Risk Confidence */}
            <div 
              onClick={() => setActiveTab('data-sources')}
              className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#f3f9f5] cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#e8f5ec] text-[#236c43] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-[#6b8c7d] block font-normal leading-tight">Risk Confidence</span>
                <span className="text-[15px] font-semibold text-[#143d2b]">{stats.risk_confidence}</span>
              </div>
            </div>

            {/* Stat 4: Active Alerts */}
            <div 
              onClick={() => setActiveTab('alerts')}
              className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#f3f9f5] cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#fee2e2] text-[#dc2626] flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-[#6b8c7d] block font-normal leading-tight">Active Alerts</span>
                <span className="text-[15px] font-semibold text-[#dc2626]">{stats.active_alerts}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MIDDLE SECTION: MAP & FORECAST (LEFT 2/3) + THERMAL & ANALYTICS (RIGHT 1/3) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2/3 COLUMN: MAP & 5-DAY FORECAST */}
        <div className="lg:col-span-2 space-y-6">
          {/* CARD: HEAT RISK MAP — PUNE CITY */}
          <div className="bg-white rounded-2xl border border-[#dfebe1] p-5 shadow-card flex flex-col font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#dcf0e2] text-[#236c43] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold leading-[1.3] text-[#143d2b]">Heat Risk Map — Pune City</h3>
                  <p className="text-[12px] font-normal text-[#628172]">Click any ward to inspect microclimate and thermal metrics</p>
                </div>
              </div>

              {/* Layer Switcher Pills */}
              <div className="flex items-center gap-1 bg-[#f0f6f2] p-1 rounded-full border border-[#dce8df] self-start sm:self-auto">
                <button
                  onClick={() => setMapLayer('heat-risk')}
                  className={`tab-pill text-[12px] font-semibold ${mapLayer === 'heat-risk' ? 'tab-pill-active' : 'tab-pill-inactive'}`}
                >
                  Heat Risk
                </button>
                <button
                  onClick={() => setMapLayer('temperature')}
                  className={`tab-pill text-[12px] font-semibold ${mapLayer === 'temperature' ? 'tab-pill-active' : 'tab-pill-inactive'}`}
                >
                  Temperature
                </button>
                <button
                  onClick={() => setMapLayer('population')}
                  className={`tab-pill text-[12px] font-semibold ${mapLayer === 'population' ? 'tab-pill-active' : 'tab-pill-inactive'}`}
                >
                  Population
                </button>
                <button
                  onClick={() => setMapLayer('vulnerability')}
                  className={`tab-pill text-[12px] font-semibold ${mapLayer === 'vulnerability' ? 'tab-pill-active' : 'tab-pill-inactive'}`}
                >
                  Vulnerability
                </button>
              </div>
            </div>

            {/* Interactive Leaflet Map Box */}
            <div className="relative w-full h-80 rounded-xl overflow-hidden border border-[#dbe8df]">
              <MapContainer
                center={[18.5204, 73.8567]}
                zoom={11.5}
                scrollWheelZoom={false}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Ward Polygons & Markers */}
                {zones.map((zone) => {
                  const isSelected = zone.id === selectedZoneId;
                  const color = getZoneColor(zone.risk.risk_level);

                  return (
                    <React.Fragment key={zone.id}>
                      {/* Polygon overlay if coordinates exist */}
                      {zone.polygon_geojson && (
                        <Polygon
                          positions={zone.polygon_geojson.coordinates[0].map(coord => [coord[1], coord[0]])}
                          pathOptions={{
                            fillColor: color,
                            fillOpacity: isSelected ? 0.65 : 0.35,
                            color: isSelected ? '#143d2b' : color,
                            weight: isSelected ? 3 : 1.5,
                          }}
                          eventHandlers={{
                            click: () => {
                              setSelectedZoneId(zone.id);
                              openZoneDrawer(zone);
                            }
                          }}
                        >
                          <LeafletTooltip direction="top" opacity={0.95}>
                            <div className="text-[12px] font-sans">
                              <b className="text-[#143d2b] font-semibold">{zone.name}</b>
                              <div className="text-[11px] text-[#557364]">
                                Risk: <span style={{ color: color }} className="font-semibold">{zone.risk.risk_level} ({zone.risk.overall_risk_score})</span>
                              </div>
                              <div className="text-[11px] text-[#718f80]">
                                Temp: {zone.weather.temperature_c}°C | HI: {zone.thermal_stress.heat_index_c}°C
                              </div>
                            </div>
                          </LeafletTooltip>
                        </Polygon>
                      )}

                      {/* Center circle marker with label */}
                      <CircleMarker
                        center={[zone.center_lat, zone.center_lon]}
                        radius={isSelected ? 10 : 7}
                        pathOptions={{
                          fillColor: color,
                          fillOpacity: 0.9,
                          color: '#ffffff',
                          weight: 2,
                        }}
                        eventHandlers={{
                          click: () => {
                            setSelectedZoneId(zone.id);
                            openZoneDrawer(zone);
                          }
                        }}
                      />
                    </React.Fragment>
                  );
                })}
              </MapContainer>

              {/* Floating Map Legend (Bottom Right) */}
              <div className="absolute bottom-3 right-3 z-[1000] bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-[#d6e4da] text-[11px]">
                <div className="font-semibold text-[#143d2b] mb-1">Heat Risk Level</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2e7d32]" /> Low</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#eab308]" /> Moderate</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ea580c]" /> High</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Very High</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#991b1b]" /> Extreme</div>
                </div>
              </div>

              {/* View Full Map button on top right */}
              <button
                onClick={() => setActiveTab('risk-map')}
                className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm border border-[#cde0d3] hover:bg-[#eaf5ed] text-[#1b4d3e] text-[13px] font-semibold px-3.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>View Full Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD: 5-DAY HEALTH RISK FORECAST */}
          <div className="bg-white rounded-2xl border border-[#dfebe1] p-5 shadow-card flex flex-col font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-[15px] font-semibold leading-[1.3] text-[#143d2b]">5-Day Health Risk Forecast</h3>
                <p className="text-[12px] font-normal text-[#628172]">Predictive human thermal stress & heatwave trajectory</p>
              </div>

              {/* Legend and Peak Risk Badge */}
              <div className="flex flex-wrap items-center gap-4 text-[12px]">
                <div className="flex items-center gap-1.5 text-[#e05e19] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" /> Heat Risk
                </div>
                <div className="flex items-center gap-1.5 text-[#6366f1] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" /> Heat Index
                </div>
                <div className="flex items-center gap-1.5 text-[#059669] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" /> WBGT
                </div>
                <div className="text-[11px] bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Peak: Thu, Apr 24
                </div>
              </div>
            </div>

            {/* Recharts Multi-line chart */}
            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overviewData.forecast_5day} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#edf4ee" vertical={false} />
                  <XAxis 
                    dataKey="day_name" 
                    tickFormatter={(val, idx) => `${val} ${overviewData.forecast_5day[idx]?.date_str}`}
                    tick={{ fill: '#5e7d6f', fontSize: 11 }}
                    axisLine={{ stroke: '#d8e7dc' }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[20, 50]} 
                    tick={{ fill: '#5e7d6f', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #dce8df', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                    formatter={(val: any, name: any) => [
                      `${val}°C`,
                      name === 'heat_risk_score' ? 'Heat Risk' : (name === 'heat_index_c' ? 'Heat Index' : 'WBGT')
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="heat_index_c" 
                    stroke="#ea580c" 
                    strokeWidth={2.5} 
                    dot={{ r: 4, fill: '#ea580c' }} 
                    activeDot={{ r: 6 }} 
                    name="heat_index_c"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wbgt_c" 
                    stroke="#6366f1" 
                    strokeWidth={2} 
                    dot={{ r: 3, fill: '#6366f1' }} 
                    name="wbgt_c"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temp_c" 
                    stroke="#059669" 
                    strokeWidth={1.5} 
                    strokeDasharray="4 4"
                    dot={{ r: 3, fill: '#059669' }} 
                    name="temp_c"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Forecast Click-to-Explore Day Cards */}
            <div className="grid grid-cols-5 gap-2 mt-3 pt-3 border-t border-[#edf4ee]">
              {overviewData.forecast_5day.map((d, idx) => (
                <div
                  key={d.full_date}
                  onClick={() => {
                    setSelectedForecastDay(idx);
                    setActiveTab('forecast');
                  }}
                  className={`p-2 rounded-xl text-center cursor-pointer transition-all border ${
                    d.is_peak 
                      ? 'bg-[#fef2f2] border-[#fca5a5] text-[#b91c1c]' 
                      : 'bg-[#f8faf8] border-[#e2ede5] hover:bg-[#eef5f0]'
                  }`}
                >
                  <span className="text-[11px] font-semibold block">{d.day_name}</span>
                  <span className="text-[10px] text-[#718d7f] font-normal">{d.date_str}</span>
                  <span className="text-[14px] font-semibold text-[#143d2b] block mt-0.5">{d.temp_c}°C</span>
                  <span className="text-[11px] text-[#ea580c] font-medium">HI: {d.heat_index_c}°C</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT 1/3 COLUMN: THERMAL STRESS & ANALYTICS */}
        <div className="space-y-6 font-sans">
          {/* CARD: THERMAL STRESS */}
          <div className="bg-white rounded-2xl border border-[#dfebe1] p-5 shadow-card flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#dcf0e2] text-[#236c43] flex items-center justify-center">
                  <Thermometer className="w-4 h-4" />
                </div>
                <h3 className="text-[15px] font-semibold leading-[1.3] text-[#143d2b]">Thermal Stress</h3>
              </div>
              <button 
                onClick={() => setActiveTab('thermal-stress')}
                className="text-[12px] font-semibold text-[#236c43] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3 Metric Columns */}
            <div className="grid grid-cols-3 gap-2 py-2 text-center bg-[#f8faf8] rounded-xl border border-[#e4efe6] mb-3">
              <div className="p-1.5 border-r border-[#e5efe8]">
                <span className="text-[11px] text-[#6b8a7b] block font-normal">Heat Index</span>
                <span className="text-[20px] font-semibold leading-tight text-[#143d2b]">{curThermal.heat_index_c}°C</span>
                <span className="inline-block mt-0.5 text-[10px] font-semibold bg-[#fee2e2] text-[#dc2626] px-1.5 py-0.5 rounded-full">
                  {curThermal.heat_index_category}
                </span>
              </div>

              <div className="p-1.5 border-r border-[#e5efe8]">
                <span className="text-[11px] text-[#6b8a7b] block font-normal">WBGT</span>
                <span className="text-[20px] font-semibold leading-tight text-[#143d2b]">{curThermal.wbgt_c}°C</span>
                <span className="inline-block mt-0.5 text-[10px] font-semibold bg-[#ffedd5] text-[#c2410c] px-1.5 py-0.5 rounded-full">
                  {curThermal.wbgt_category}
                </span>
              </div>

              <div className="p-1.5">
                <span className="text-[11px] text-[#6b8a7b] block font-normal">UTCI</span>
                <span className="text-[20px] font-semibold leading-tight text-[#143d2b]">{curThermal.utci_c}°C</span>
                <span className="inline-block mt-0.5 text-[10px] font-semibold bg-[#fee2e2] text-[#dc2626] px-1.5 py-0.5 rounded-full">
                  {curThermal.utci_category}
                </span>
              </div>
            </div>

            {/* Key Drivers Mini Grid */}
            <div className="text-[12px] text-[#557364]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#799587] block mb-1.5">Key Drivers</span>
              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <div className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span>Temperature: <b className="text-[#143d2b] font-semibold">{curWeather.temperature_c}°C</b></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>Humidity: <b className="text-[#143d2b] font-semibold">{curWeather.humidity_pct}%</b></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Wind: <b className="text-[#143d2b] font-semibold">{curWeather.wind_speed_kmh} km/h</b></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-[#eab308]" />
                  <span>Solar: <b className="text-[#143d2b] font-semibold">{curWeather.solar_radiation_level}</b></span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD: RISK AMPLIFICATION */}
          <div className="bg-white rounded-2xl border border-[#dfebe1] p-5 shadow-card flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#fee2e2] text-[#dc2626] flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-[15px] font-semibold leading-[1.3] text-[#143d2b]">Risk Amplification</h3>
              </div>
              <RiskBadge level={overviewData.risk_amplification.level} size="sm" />
            </div>

            <div className="text-[13px] text-[#3d594b] space-y-1.5 mb-3">
              <span className="text-[11px] font-semibold text-[#6a8779] block uppercase">Combined Factors Increasing Risk</span>
              <div className="text-[13px] font-semibold text-[#143d2b] flex items-center justify-between">
                <span>&gt; High Humidity</span>
                <span className="text-[#dc2626]">↑</span>
              </div>
              <div className="text-[13px] font-semibold text-[#143d2b] flex items-center justify-between">
                <span>&gt; Very High Solar Radiation</span>
                <span className="text-[#dc2626]">↑</span>
              </div>
              <div className="text-[13px] font-semibold text-[#143d2b] flex items-center justify-between">
                <span>&gt; Low Wind Speed</span>
                <span className="text-[#dc2626]">↓</span>
              </div>
            </div>

            {/* Pinkish/Red highlight callout */}
            <div className="p-3 bg-[#fff1f2] border border-[#fecdd3] rounded-xl text-[13px] text-[#9f1239] font-medium leading-relaxed">
              {overviewData.risk_amplification.highlight_box}
            </div>
          </div>

          {/* CARD: RISK COMPOSITION (MULTI-LAYER RISK FUSION) */}
          <div className="bg-white rounded-2xl border border-[#dfebe1] p-5 shadow-card flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-[#dcf0e2] text-[#236c43] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold leading-[1.3] text-[#143d2b]">Risk Composition</h3>
                <span className="text-[11px] text-[#698879] font-normal">Multi-Layer Risk Fusion</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 my-2">
              <div className="w-24 h-24 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fusionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={42}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {fusionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 space-y-1.5 text-[13px]">
                <div className="text-right pb-1 border-b border-[#edf4ee]">
                  <span className="text-[11px] text-[#718f80] font-normal">Overall Risk Score: </span>
                  <span className="text-[15px] font-bold text-[#143d2b]">{curRisk.overall_risk_score}/100</span>
                </div>
                {overviewData.risk_composition.layers.map(layer => (
                  <div key={layer.name} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />
                      <span className="text-[#496556] truncate font-normal">{layer.name}</span>
                    </div>
                    <span className="font-semibold text-[#143d2b]">{layer.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CARD: PRIORITY ZONES */}
          <div className="bg-white rounded-2xl border border-[#dfebe1] p-5 shadow-card flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#dcf0e2] text-[#236c43] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-[15px] font-semibold leading-[1.3] text-[#143d2b]">Priority Zones</h3>
              </div>
              <button 
                onClick={() => setActiveTab('vulnerable-zones')}
                className="text-[12px] font-semibold text-[#236c43] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#e5efe8] text-[11px] text-[#698879] uppercase tracking-wider font-semibold">
                    <th className="pb-1.5">Zone</th>
                    <th className="pb-1.5">Risk</th>
                    <th className="pb-1.5">Vulnerability</th>
                    <th className="pb-1.5 text-right">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf4ee]">
                  {overviewData.priority_zones.map(pz => (
                    <tr 
                      key={pz.zone_id}
                      onClick={() => {
                        setSelectedZoneId(pz.zone_id);
                        openZoneDrawer(pz.zone_id);
                      }}
                      className="hover:bg-[#f7faf8] cursor-pointer transition-colors"
                    >
                      <td className="py-2 font-semibold text-[#143d2b]">{pz.zone_name}</td>
                      <td className="py-2"><RiskBadge level={pz.risk} size="sm" /></td>
                      <td className="py-2 text-[#516f60] font-normal">{pz.vulnerability}</td>
                      <td className="py-2 text-right"><RiskBadge level={pz.priority} size="sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CARD: AI INSIGHTS */}
          <div className="bg-white rounded-2xl border border-[#dfebe1] p-5 shadow-card flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#dcf0e2] text-[#236c43] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-[15px] font-semibold leading-[1.3] text-[#143d2b]">AI Insights</h3>
              </div>
              <button 
                onClick={() => setActiveTab('thermal-stress')}
                className="text-[12px] font-semibold text-[#236c43] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3.5 bg-[#f6faf7] border border-[#dce8df] rounded-xl text-[13px] space-y-1.5">
              <p className="font-semibold text-[#143d2b] text-[14px]">{overviewData.ai_insights.title}</p>
              <p className="text-[#3b594a] leading-relaxed font-normal">{overviewData.ai_insights.summary}</p>
            </div>
          </div>

          {/* CARD: RECOMMENDED ACTIONS */}
          <div className="bg-white rounded-2xl border border-[#dfebe1] p-5 shadow-card flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#dcf0e2] text-[#236c43] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-[15px] font-semibold leading-[1.3] text-[#143d2b]">Recommended Actions</h3>
              </div>
              <button 
                onClick={() => setActiveTab('settings')}
                className="text-[12px] font-semibold text-[#236c43] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-[13px]">
              {overviewData.recommended_actions.slice(0, 4).map(action => (
                <div 
                  key={action.id}
                  onClick={() => openZoneDrawer(selectedZoneId)}
                  className="p-2.5 rounded-xl bg-[#f8faf8] hover:bg-[#eef6f0] border border-[#e5efe8] cursor-pointer transition-colors flex items-start gap-2 text-[#244234]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#236c43] shrink-0 mt-1.5" />
                  <span className="font-medium text-[13px] leading-snug">{action.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CARD: ACTIVE ALERTS */}
          <div className="bg-white rounded-2xl border border-[#dfebe1] p-5 shadow-card flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#fee2e2] text-[#dc2626] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="text-[15px] font-semibold leading-[1.3] text-[#143d2b]">Active Alerts</h3>
              </div>
              <button 
                onClick={() => setActiveTab('alerts')}
                className="text-[12px] font-semibold text-[#236c43] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {overviewData.active_alerts.slice(0, 3).map(alert => (
                <div
                  key={alert.id}
                  onClick={() => {
                    setSelectedZoneId(alert.zone_id);
                    setActiveTab('alerts');
                  }}
                  className="p-3 rounded-xl border border-[#fee2e2] bg-[#fffbfb] hover:bg-[#fee2e2]/40 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shrink-0" />
                    <div>
                      <p className="font-semibold text-[#143d2b] text-[13px] leading-tight">{alert.title}</p>
                      <p className="text-[11px] text-[#789688] font-medium mt-0.5">{alert.severity} • {alert.time_str}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#91ada0] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM STATUS BAR: DATA SOURCES & SYSTEM STATUS                           */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-[#dfebe1] p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#143d2b]">
            <Radio className="w-4 h-4 text-[#236c43]" />
            <span>Data Sources:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {overviewData.data_sources.map(ds => (
              <span
                key={ds.id}
                onClick={() => setActiveTab('data-sources')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium bg-[#e8f5ec] text-[#1b4d3e] border border-[#cde2d3] cursor-pointer hover:bg-[#d8eedf] transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
                <span className="font-medium">{ds.category}</span>
                <span className="text-[10px] text-[#4d6b5e] uppercase font-semibold">({ds.status})</span>
              </span>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-[#6b8c7d] font-normal shrink-0">
          Last Sync: <b className="font-medium text-[#143d2b]">{overviewData.last_updated}</b>
        </div>
      </div>

      {/* AQI Details Modal */}
      {aqiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#dbe8df]">
            <div className="flex items-center justify-between mb-4 border-b border-[#edf4ee] pb-3">
              <h3 className="font-display text-[18px] font-semibold text-[#143d2b] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#236c43]" /> Air Quality Diagnostics
              </h3>
              <button onClick={() => setAqiModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold p-1 cursor-pointer">✕</button>
            </div>
            <div className="space-y-4 text-[13px]">
              <div className="flex items-center justify-between bg-[#f8faf8] p-3.5 rounded-xl border border-[#e5efe8]">
                <span className="text-[#3b594a] font-medium">Composite AQI:</span>
                <span className="text-[20px] font-bold text-[#ca8a04]">{curWeather.aqi} ({curWeather.aqi_status})</span>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between border-b border-[#edf4ee] pb-2 text-[13px]">
                  <span className="text-[#557364]">PM2.5 (Fine particulate):</span>
                  <span className="font-semibold text-[#143d2b]">{curWeather.pm25} µg/m³</span>
                </div>
                <div className="flex justify-between border-b border-[#edf4ee] pb-2 text-[13px]">
                  <span className="text-[#557364]">PM10 (Coarse particulate):</span>
                  <span className="font-semibold text-[#143d2b]">{curWeather.pm10} µg/m³</span>
                </div>
                <div className="flex justify-between border-b border-[#edf4ee] pb-2 text-[13px]">
                  <span className="text-[#557364]">CO (Carbon Monoxide):</span>
                  <span className="font-semibold text-[#143d2b]">{curWeather.co} mg/m³</span>
                </div>
              </div>
              <p className="text-[12px] text-[#698879] leading-[1.5]">
                Note: Secondary pollutant interaction with high atmospheric temperature exacerbates respiratory thermal strain in industrial belts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
