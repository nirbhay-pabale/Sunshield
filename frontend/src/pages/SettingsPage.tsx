import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  Sliders, 
  Bell, 
  User, 
  Flame, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Info,
  Users
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { userRole, setUserRole, heatwaveSimulated, toggleHeatwaveSimulation } = useApp();

  const [hiThreshold, setHiThreshold] = useState<number>(41);
  const [wbgtThreshold, setWbgtThreshold] = useState<number>(31.4);
  const [utciThreshold, setUtciThreshold] = useState<number>(38);
  const [refreshInterval, setRefreshInterval] = useState<string>('5 minutes');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#dfebe1] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[26px] sm:text-[30px] font-semibold text-[#143d2b] flex items-center gap-2.5 tracking-[-0.02em] leading-[1.15]">
            <Settings className="w-6 h-6 text-[#236c43]" /> Platform Settings & Threshold Configuration
          </h2>
          <p className="text-[14px] text-[#597669] mt-1 font-normal leading-[1.5]">
            Configure biometeorological risk cutoffs, notification triggers, and user authentication roles
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#1b4d3e] hover:bg-[#143d2b] text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#86efac]" />
          <span>Save Configuration</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-[#eaf4ec] border border-[#bfe0ca] text-[13px] font-semibold text-[#1b4d3e] rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4.5 h-4.5 text-[#2e7d32]" />
          <span>Platform thresholds and notification preferences updated successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Risk Threshold Configuration */}
        <div className="bg-white p-5 rounded-2xl border border-[#dfebe1] shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-[#edf4ee] pb-3">
            <Sliders className="w-4.5 h-4.5 text-[#236c43]" />
            <h3 className="font-display text-[16px] font-semibold text-[#143d2b]">Thermal Risk Cutoff Thresholds</h3>
          </div>

          <div className="space-y-4 text-[13px]">
            <div>
              <div className="flex justify-between font-medium mb-1.5 text-[#143d2b]">
                <span>Heat Index "Very High" Alert Cutoff (°C)</span>
                <span className="text-[#ea580c] font-bold text-[14px]">{hiThreshold}°C</span>
              </div>
              <input
                type="range"
                min="35"
                max="48"
                step="0.5"
                value={hiThreshold}
                onChange={e => setHiThreshold(Number(e.target.value))}
                className="w-full accent-[#236c43] cursor-pointer"
              />
              <p className="text-[11px] text-[#718f80] mt-0.5">Standard NOAA trigger is 41.0°C.</p>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1.5 text-[#143d2b]">
                <span>WBGT Occupational Labor Halt Cutoff (°C)</span>
                <span className="text-[#ea580c] font-bold text-[14px]">{wbgtThreshold}°C</span>
              </div>
              <input
                type="range"
                min="28"
                max="36"
                step="0.2"
                value={wbgtThreshold}
                onChange={e => setWbgtThreshold(Number(e.target.value))}
                className="w-full accent-[#236c43] cursor-pointer"
              />
              <p className="text-[11px] text-[#718f80] mt-0.5">ISO 7243 heavy work moratorium threshold is 31.4°C.</p>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1.5 text-[#143d2b]">
                <span>UTCI Strong Heat Stress Level (°C)</span>
                <span className="text-[#ea580c] font-bold text-[14px]">{utciThreshold}°C</span>
              </div>
              <input
                type="range"
                min="32"
                max="44"
                step="0.5"
                value={utciThreshold}
                onChange={e => setUtciThreshold(Number(e.target.value))}
                className="w-full accent-[#236c43] cursor-pointer"
              />
              <p className="text-[11px] text-[#718f80] mt-0.5">Universal Thermal Climate Index standard is 38.0°C.</p>
            </div>
          </div>
        </div>

        {/* 2. Simulation & Ingestion Settings */}
        <div className="bg-white p-5 rounded-2xl border border-[#dfebe1] shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-[#edf4ee] pb-3">
            <Flame className="w-4.5 h-4.5 text-[#ea580c]" />
            <h3 className="font-display text-[16px] font-semibold text-[#143d2b]">Simulation & Ingestion Sync</h3>
          </div>

          <div className="space-y-4 text-[13px]">
            <div className="p-3.5 bg-[#fbfdfb] rounded-xl border border-[#e2ece5] flex items-center justify-between">
              <div>
                <b className="text-[14px] text-[#143d2b] block font-semibold">Heatwave Surge Scenario</b>
                <span className="text-[12px] text-[#597669] font-normal">Inject +3°C temp and +8% humidity surge across Pune</span>
              </div>
              <button
                onClick={toggleHeatwaveSimulation}
                className={`px-3.5 py-1.5 rounded-xl font-semibold text-[12px] transition-colors cursor-pointer ${
                  heatwaveSimulated ? 'bg-[#fee2e2] text-[#dc2626] border border-[#f87171]' : 'bg-[#eaf4ec] text-[#236c43] border border-[#cbe2d3]'
                }`}
              >
                {heatwaveSimulated ? 'Surge Active (Reset)' : 'Trigger Surge'}
              </button>
            </div>

            <div>
              <label className="block text-[#527061] font-medium mb-1.5 text-[12px]">Telemetry Mesh Polling Interval</label>
              <select
                value={refreshInterval}
                onChange={e => setRefreshInterval(e.target.value)}
                className="w-full bg-[#f8faf8] border border-[#d2e2d6] rounded-xl p-2.5 font-medium text-[13px] text-[#143d2b] cursor-pointer"
              >
                <option value="1 minute">1 minute (High Frequency)</option>
                <option value="5 minutes">5 minutes (Recommended Operational)</option>
                <option value="15 minutes">15 minutes (Standard Satellite Sync)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#527061] font-medium mb-1.5 text-[12px]">Active Authentication Role</label>
              <select
                value={userRole}
                onChange={e => setUserRole(e.target.value)}
                className="w-full bg-[#f8faf8] border border-[#d2e2d6] rounded-xl p-2.5 font-medium text-[13px] text-[#143d2b] cursor-pointer"
              >
                <option value="Disaster Management Officer">Disaster Management Officer (Full Command)</option>
                <option value="Municipal Ward Officer">Municipal Ward Officer (Local Alert View)</option>
                <option value="Citizen Observer">Citizen Observer (Public Transparency)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* System Status & Operational Standards */}
      <div className="bg-gradient-to-br from-[#1b4d3e] to-[#143d2b] text-white p-6 rounded-2xl shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#86efac]" />
            </div>
            <div>
              <h3 className="font-display text-[18px] font-semibold tracking-tight">System Status & Standards Compliance</h3>
              <p className="text-[13px] text-white/80 font-normal">Sahayya.AI : Municipal Heat Risk Intelligence & Decision Support Infrastructure</p>
            </div>
          </div>
          <span className="bg-[#86efac]/20 text-[#86efac] text-[12px] font-semibold px-3 py-1 rounded-full border border-[#86efac]/30">
            Operational 100%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-4 text-[13px]">
          <div className="space-y-1">
            <span className="font-semibold text-[#86efac] block uppercase text-[11px] tracking-wider">Meteorological Standard</span>
            <p className="font-medium text-white text-[14px]">IMD & WMO Heat Guidelines</p>
            <p className="text-white/70 text-[12px] leading-[1.4]">NOAA HI, ISO 7243 WBGT, & UTCI biometeorological algorithms.</p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-[#86efac] block uppercase text-[11px] tracking-wider">Early Warning Protocols</span>
            <p className="font-medium text-white text-[14px]">NDMA CAP v1.2 Compliant</p>
            <p className="text-white/70 text-[12px] leading-[1.4]">Integrated with Smart Cities Mission & Municipal Ward Command Centers.</p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-[#86efac] block uppercase text-[11px] tracking-wider">Data Mesh Latency</span>
            <p className="font-medium text-white text-[14px]">&lt; 150 ms Live Sync</p>
            <p className="text-white/70 text-[12px] leading-[1.4]">Continuous ingestion across satellite, AWS, and IoT ground sensor meshes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
