import React from 'react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from './RiskBadge';
import { X, MapPin, Thermometer, Wind, Droplets, Sun, AlertTriangle, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

export const ZoneDetailDrawer: React.FC = () => {
  const { isDrawerOpen, closeZoneDrawer, selectedZoneDetail, setActiveTab, setSelectedZoneId } = useApp();

  if (!isDrawerOpen || !selectedZoneDetail) return null;

  const z = selectedZoneDetail;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto flex flex-col border-l border-[#dbe6de] animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#e5efe8] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#eaf4ec] text-[#236c43] flex items-center justify-center">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="font-display text-[18px] font-semibold text-[#143d2b] leading-tight">{z.name}</h2>
              <p className="text-[12px] text-[#627e70] font-normal">{z.zone_type} • Pune</p>
            </div>
          </div>
          <button
            onClick={closeZoneDrawer}
            className="w-8 h-8 rounded-full hover:bg-[#edf4ee] text-[#557364] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1 text-[13px]">
          {/* Top Risk Banner */}
          <div className="bg-[#f7faf8] rounded-2xl p-4.5 border border-[#dce9df]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#5a7668] uppercase tracking-wider">Overall Heat Risk</span>
              <RiskBadge level={z.risk.risk_level} size="md" showDot />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[32px] font-bold text-[#143d2b] leading-[1.0]">{z.risk.overall_risk_score}</span>
              <span className="text-[13px] font-normal text-[#7a9486]">/ 100</span>
              <span className="ml-auto text-[12px] font-semibold text-[#ea580c]">{z.risk.trend_vs_yesterday} vs yesterday</span>
            </div>
            <p className="text-[12px] text-[#527061] mt-2.5 border-t border-[#e2ece5] pt-2">
              Priority Ranking: <b className="text-[#143d2b] font-semibold">{z.risk.priority_level}</b> • Vulnerable Population: <b className="text-[#143d2b] font-semibold">{(z.vulnerable_pop_count / 1000).toFixed(0)}k</b>
            </p>
          </div>

          {/* Current Microclimate Observations */}
          <div>
            <h3 className="font-display text-[15px] font-semibold text-[#143d2b] mb-3 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-[#236c43]" /> Microclimate Observations
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f9fbf9] p-3 rounded-xl border border-[#e5efe8]">
                <div className="text-[12px] text-[#6c8678] font-medium flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-[#ea580c]" /> Temperature
                </div>
                <div className="text-[20px] font-bold text-[#143d2b] mt-1 leading-tight">{z.weather.temperature_c}°C</div>
                <div className="text-[11px] text-[#819b8e] mt-0.5">Feels like {z.weather.feels_like_c}°C</div>
              </div>

              <div className="bg-[#f9fbf9] p-3 rounded-xl border border-[#e5efe8]">
                <div className="text-[12px] text-[#6c8678] font-medium flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-[#0284c7]" /> Humidity
                </div>
                <div className="text-[20px] font-bold text-[#143d2b] mt-1 leading-tight">{z.weather.humidity_pct}%</div>
                <div className="text-[11px] text-[#819b8e] mt-0.5">Dew Point 24.2°C</div>
              </div>

              <div className="bg-[#f9fbf9] p-3 rounded-xl border border-[#e5efe8]">
                <div className="text-[12px] text-[#6c8678] font-medium flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-[#059669]" /> Wind Speed
                </div>
                <div className="text-[20px] font-bold text-[#143d2b] mt-1 leading-tight">{z.weather.wind_speed_kmh} km/h</div>
                <div className="text-[11px] text-[#819b8e] mt-0.5">Dir: {z.weather.wind_direction}</div>
              </div>

              <div className="bg-[#f9fbf9] p-3 rounded-xl border border-[#e5efe8]">
                <div className="text-[12px] text-[#6c8678] font-medium flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-[#eab308]" /> Solar Flux
                </div>
                <div className="text-[18px] font-bold text-[#143d2b] mt-1 leading-tight">{z.weather.solar_radiation_level}</div>
                <div className="text-[11px] text-[#819b8e] mt-0.5">{z.weather.solar_radiation_wm2} W/m²</div>
              </div>
            </div>
          </div>

          {/* Human Thermal Stress Indices */}
          <div>
            <h3 className="font-display text-[15px] font-semibold text-[#143d2b] mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#236c43]" /> Thermal Stress Breakdown
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fbfdfb] border border-[#e6f0e9]">
                <div>
                  <span className="text-[13px] font-semibold text-[#143d2b]">Heat Index (HI)</span>
                  <p className="text-[11px] text-[#6e887a]">NOAA Steadman / Rothfusz Model</p>
                </div>
                <div className="text-right">
                  <span className="text-[16px] font-bold text-[#ea580c]">{z.thermal_stress.heat_index_c}°C</span>
                  <span className="block text-[11px] font-medium text-[#8ea497]">{z.thermal_stress.heat_index_category}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fbfdfb] border border-[#e6f0e9]">
                <div>
                  <span className="text-[13px] font-semibold text-[#143d2b]">WBGT (Wet Bulb Globe)</span>
                  <p className="text-[11px] text-[#6e887a]">ISO 7243 Work/Rest Guidance</p>
                </div>
                <div className="text-right">
                  <span className="text-[16px] font-bold text-[#ea580c]">{z.thermal_stress.wbgt_c}°C</span>
                  <span className="block text-[11px] font-medium text-[#8ea497]">{z.thermal_stress.wbgt_category}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fbfdfb] border border-[#e6f0e9]">
                <div>
                  <span className="text-[13px] font-semibold text-[#143d2b]">UTCI (Thermal Climate Index)</span>
                  <p className="text-[11px] text-[#6e887a]">Human Biometeorological Strain</p>
                </div>
                <div className="text-right">
                  <span className="text-[16px] font-bold text-[#ea580c]">{z.thermal_stress.utci_c}°C</span>
                  <span className="block text-[11px] font-medium text-[#8ea497]">{z.thermal_stress.utci_category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Demographic & Vulnerability Factors */}
          <div>
            <h3 className="font-display text-[15px] font-semibold text-[#143d2b] mb-2.5">Vulnerability & Built Environment</h3>
            <div className="bg-[#f7faf8] p-4 rounded-xl border border-[#dce9df] space-y-2.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#597467]">Total Population:</span>
                <span className="font-semibold text-[#143d2b]">{(z.population / 1000).toFixed(0)}k residents</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#597467]">Dense Informal Housing:</span>
                <span className="font-semibold text-[#143d2b]">{z.dense_housing_pct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#597467]">Tree Canopy / Green Cover:</span>
                <span className="font-semibold text-[#143d2b]">{z.green_cover_pct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#597467]">Air Quality (AQI):</span>
                <span className="font-semibold text-[#ca8a04]">{z.weather.aqi} ({z.weather.aqi_status})</span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="space-y-2.5 pt-2 border-t border-[#e2ece5]">
            <button
              onClick={() => {
                closeZoneDrawer();
                setSelectedZoneId(z.id);
                setActiveTab('thermal-stress');
              }}
              className="w-full py-2.5 px-3 bg-[#1b4d3e] text-white text-[13px] font-semibold rounded-xl hover:bg-[#143d2b] flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              Analyze Thermal Stress <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                closeZoneDrawer();
                setSelectedZoneId(z.id);
                setActiveTab('reports');
              }}
              className="w-full py-2.5 px-3 bg-white border border-[#cde0d3] text-[#1b4d3e] text-[13px] font-semibold rounded-xl hover:bg-[#f1f7f3] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Generate Zone Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
