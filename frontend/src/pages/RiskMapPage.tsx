import React, { useState } from 'react';
import { useApp, MapLayer } from '../context/AppContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { RealtimeRiskMap } from '../components/common/RealtimeRiskMap';
import { 
  MapPin, 
  Layers, 
  Search, 
  Thermometer, 
  Users, 
  ShieldAlert, 
  Info, 
  Eye, 
  Sliders, 
  Maximize2,
  FileText,
  Activity,
  Flame,
  Wind,
  Navigation
} from 'lucide-react';

export const RiskMapPage: React.FC = () => {
  const { 
    zones, 
    selectedZoneId, 
    setSelectedZoneId, 
    mapLayer, 
    setMapLayer, 
    openZoneDrawer,
    setActiveTab 
  } = useApp();

  const [mapSearch, setMapSearch] = useState('');

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  const getLayerColor = (z: typeof zones[0], layer: MapLayer) => {
    switch (layer) {
      case 'heat-risk':
        return z.risk.risk_level === 'Very High' ? '#ef4444' : (z.risk.risk_level === 'High' ? '#ea580c' : (z.risk.risk_level === 'Moderate' ? '#eab308' : '#10b981'));
      case 'temperature':
        return z.weather.temperature_c >= 40 ? '#991b1b' : (z.weather.temperature_c >= 38.5 ? '#ef4444' : (z.weather.temperature_c >= 37 ? '#ea580c' : '#eab308'));
      case 'population':
        return z.population > 400000 ? '#7c3aed' : (z.population > 300000 ? '#3b82f6' : '#06b6d4');
      case 'vulnerability':
        return z.vulnerable_pop_count > 70000 ? '#dc2626' : (z.vulnerable_pop_count > 40000 ? '#f97316' : '#10b981');
      case 'exposure':
        return z.dense_housing_pct > 60 ? '#b91c1c' : (z.dense_housing_pct > 45 ? '#f97316' : '#059669');
      case 'priority':
        return z.risk.priority_level === 'Critical' ? '#dc2626' : (z.risk.priority_level === 'High' ? '#ea580c' : '#eab308');
      default:
        return '#10b981';
    }
  };

  const filteredZones = zones.filter(z => 
    z.name.toLowerCase().includes(mapSearch.toLowerCase()) ||
    z.zone_type.toLowerCase().includes(mapSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#dfebe1] shadow-card">
        <div>
          <h2 className="font-display text-[26px] sm:text-[28px] font-semibold text-[#143d2b] flex items-center gap-2.5 tracking-[-0.02em] leading-[1.15]">
            <Layers className="w-6 h-6 text-[#236c43]" /> Real-Time Tactical GIS & Heat Risk Map
          </h2>
          <p className="text-[13px] text-[#597669] mt-1 font-normal leading-[1.4]">
            Multi-mode satellite & normal street layers, live IoT sensor telemetry mesh & spatial thermal risk fusion
          </p>
        </div>

        {/* Layer Selection Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#f0f6f2] p-1.5 rounded-full border border-[#dce8df]">
          {(['heat-risk', 'temperature', 'population', 'vulnerability', 'exposure', 'priority'] as MapLayer[]).map(layer => (
            <button
              key={layer}
              onClick={() => setMapLayer(layer)}
              className={`tab-pill capitalize text-[13px] font-medium ${mapLayer === layer ? 'tab-pill-active font-semibold' : 'tab-pill-inactive'}`}
            >
              {layer.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Container & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left 1/4: Ward Selector & Microclimate Fast-List */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#dfebe1] p-5 shadow-card">
            <div className="flex items-center justify-between mb-3.5">
              <span className="font-display text-[15px] font-semibold text-[#143d2b]">
                Monitored Wards ({filteredZones.length})
              </span>
              <span className="text-[11px] bg-[#eaf4ec] text-[#236c43] px-2.5 py-0.5 rounded-full font-semibold">
                Live Sync
              </span>
            </div>

            <div className="relative mb-3.5">
              <Search className="w-4 h-4 text-[#6b8c7d] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter Pune wards..."
                value={mapSearch}
                onChange={e => setMapSearch(e.target.value)}
                className="w-full bg-[#f6faf7] border border-[#d8e6dc] rounded-full pl-9 pr-3 py-2 text-[13px] text-[#143d2b] focus:outline-none focus:border-[#236c43] font-normal"
              />
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredZones.map(z => {
                const isSel = z.id === selectedZoneId;
                const col = getLayerColor(z, mapLayer);
                return (
                  <div
                    key={z.id}
                    onClick={() => {
                      setSelectedZoneId(z.id);
                      openZoneDrawer(z);
                    }}
                    className={`p-3 rounded-xl cursor-pointer border transition-all ${
                      isSel 
                        ? 'bg-[#eaf4ec] border-[#a2cfb0] shadow-xs' 
                        : 'bg-[#fcfdfc] border-[#e8f0ea] hover:bg-[#f3f9f5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[14px] text-[#143d2b]">{z.name}</span>
                      <span 
                        className="text-[12px] font-bold px-2 py-0.5 rounded-full text-white" 
                        style={{ backgroundColor: col }}
                      >
                        {z.risk.overall_risk_score}
                      </span>
                    </div>
                    <div className="text-[12px] text-[#557364] mt-1 flex items-center justify-between">
                      <span>{z.zone_type}</span>
                      <span className="font-semibold text-[#143d2b]">{z.weather.temperature_c}°C</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Active Ward Snapshot */}
          {selectedZone && (
            <div className="bg-gradient-to-br from-[#1b4d3e] to-[#143d2b] text-white p-5 rounded-2xl shadow-card space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#86efac]">Active Ward</span>
                  <h3 className="font-display text-[18px] font-semibold">{selectedZone.name}</h3>
                </div>
                <RiskBadge level={selectedZone.risk.risk_level} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-[13px] border-t border-white/10 pt-3">
                <div>
                  <span className="text-white/70 text-[11px] font-normal">Heat Index</span>
                  <p className="font-semibold text-[16px] text-[#fca5a5]">{selectedZone.thermal_stress.heat_index_c}°C</p>
                </div>
                <div>
                  <span className="text-white/70 text-[11px] font-normal">WBGT</span>
                  <p className="font-semibold text-[16px] text-[#fed7aa]">{selectedZone.thermal_stress.wbgt_c}°C</p>
                </div>
                <div>
                  <span className="text-white/70 text-[11px] font-normal">Vulnerable Pop</span>
                  <p className="font-semibold text-[16px]">{(selectedZone.vulnerable_pop_count / 1000).toFixed(0)}k</p>
                </div>
                <div>
                  <span className="text-white/70 text-[11px] font-normal">Priority</span>
                  <p className="font-semibold text-[16px] text-[#86efac]">{selectedZone.risk.priority_level}</p>
                </div>
              </div>

              <button
                onClick={() => openZoneDrawer(selectedZone)}
                className="w-full py-2.5 bg-white text-[#143d2b] hover:bg-[#eaf5ec] rounded-xl text-[13px] font-semibold transition-colors text-center cursor-pointer shadow-xs"
              >
                Inspect Full Zone Analytics →
              </button>
            </div>
          )}
        </div>

        {/* Right 3/4: Real-time Tactical Map View */}
        <div className="lg:col-span-3">
          <RealtimeRiskMap height="640px" />
        </div>

      </div>
    </div>
  );
};

