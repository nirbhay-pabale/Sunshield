import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Database, 
  Satellite, 
  CloudSun, 
  Cpu, 
  MapPin, 
  Users, 
  Activity, 
  Radio, 
  CheckCircle2, 
  Layers, 
  ArrowDown, 
  Code,
  ShieldCheck
} from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  const { overviewData } = useApp();
  const [inspectSource, setInspectSource] = useState<any | null>(null);

  const dataSources = overviewData.data_sources;

  const samplePayload = {
    sensor_id: "PSCDCL-IOT-PUNE-042",
    zone: "Central Pune",
    timestamp: "2025-04-24T10:32:00Z",
    environmental_telemetry: {
      ambient_temperature_c: 39.0,
      relative_humidity_pct: 62.0,
      wind_speed_kmh: 8.0,
      wind_direction_deg: 315,
      solar_irradiance_wm2: 880.0,
      surface_temperature_c: 46.5
    },
    air_quality_telemetry: {
      aqi: 128,
      pm25_ugm3: 58.0,
      pm10_ugm3: 92.0,
      co_mgm3: 1.2
    },
    quality_flag: "NOMINAL",
    calibration_offset_applied: true
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#dfebe1] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[26px] sm:text-[30px] font-semibold text-[#143d2b] flex items-center gap-2.5 tracking-[-0.02em] leading-[1.15]">
            <Database className="w-6 h-6 text-[#236c43]" /> Integrated Environmental Data Pipeline
          </h2>
          <p className="text-[14px] text-[#597669] mt-1 font-normal leading-[1.5]">
            Multi-source sensor fusion, satellite radiometer feeds, IMD AWS stations, and census vulnerability registers
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#eaf4ec] px-4 py-1.5 rounded-full border border-[#cde2d3] text-[13px] font-semibold text-[#143d2b]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2e7d32] animate-pulse" />
          <span>Pipeline Status: 5/5 Ingestion Nodes Active</span>
        </div>
      </div>

      {/* Conceptual Data Architecture Pipeline Flow Diagram */}
      <div className="bg-white p-6 rounded-2xl border border-[#dfebe1] shadow-card space-y-4">
        <h3 className="font-display text-[17px] font-semibold text-[#143d2b] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#236c43]" /> End-to-End Intelligence Pipeline Flow
        </h3>

        <div className="flex flex-col items-center space-y-3.5 pt-2">
          {/* Layer 1: Ingestion Sources */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 w-full">
            <div className="p-3 bg-[#f6faf7] rounded-xl border border-[#d8e6dc] text-center">
              <Satellite className="w-5 h-5 mx-auto text-[#236c43] mb-1" />
              <span className="text-[13px] font-semibold text-[#143d2b] block">Satellite Feed</span>
              <span className="text-[11px] text-[#6b8c7d] font-normal">INSAT-3DR / Landsat</span>
            </div>
            <div className="p-3 bg-[#f6faf7] rounded-xl border border-[#d8e6dc] text-center">
              <CloudSun className="w-5 h-5 mx-auto text-[#0284c7] mb-1" />
              <span className="text-[13px] font-semibold text-[#143d2b] block">Weather Stations</span>
              <span className="text-[11px] text-[#6b8c7d] font-normal">IMD AWS Mesh</span>
            </div>
            <div className="p-3 bg-[#f6faf7] rounded-xl border border-[#d8e6dc] text-center">
              <Cpu className="w-5 h-5 mx-auto text-[#ea580c] mb-1" />
              <span className="text-[13px] font-semibold text-[#143d2b] block">IoT Ground Nodes</span>
              <span className="text-[11px] text-[#6b8c7d] font-normal">48 Smart City Pods</span>
            </div>
            <div className="p-3 bg-[#f6faf7] rounded-xl border border-[#d8e6dc] text-center">
              <Activity className="w-5 h-5 mx-auto text-[#eab308] mb-1" />
              <span className="text-[13px] font-semibold text-[#143d2b] block">Ground Albedo</span>
              <span className="text-[11px] text-[#6b8c7d] font-normal">Roads & Traffic</span>
            </div>
            <div className="p-3 bg-[#f6faf7] rounded-xl border border-[#d8e6dc] text-center">
              <Users className="w-5 h-5 mx-auto text-[#7c3aed] mb-1" />
              <span className="text-[13px] font-semibold text-[#143d2b] block">Demographics</span>
              <span className="text-[11px] text-[#6b8c7d] font-normal">Census GIS Layers</span>
            </div>
            <div className="p-3 bg-[#f6faf7] rounded-xl border border-[#d8e6dc] text-center">
              <ShieldCheck className="w-5 h-5 mx-auto text-[#dc2626] mb-1" />
              <span className="text-[13px] font-semibold text-[#143d2b] block">Vulnerability</span>
              <span className="text-[11px] text-[#6b8c7d] font-normal">Housing & Canopy</span>
            </div>
          </div>

          <ArrowDown className="w-4 h-4 text-[#236c43]" />

          {/* Layer 2: Fusion & Thermal Engine */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-2xl">
            <div className="p-3.5 bg-[#eaf4ec] rounded-xl border border-[#cde2d3] text-center">
              <span className="text-[14px] font-semibold text-[#143d2b]">Data Fusion & Calibration Engine</span>
              <p className="text-[12px] text-[#4d6b5e] mt-0.5 font-normal">Interpolates microclimates & removes sensor outliers</p>
            </div>
            <div className="p-3.5 bg-[#eaf4ec] rounded-xl border border-[#cde2d3] text-center">
              <span className="text-[14px] font-semibold text-[#143d2b]">Thermal Stress Calculation Engine</span>
              <p className="text-[12px] text-[#4d6b5e] mt-0.5 font-normal">Computes Heat Index, WBGT, and UTCI equations</p>
            </div>
          </div>

          <ArrowDown className="w-4 h-4 text-[#236c43]" />

          {/* Layer 3: Risk Model & GIS Mapping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-2xl">
            <div className="p-3.5 bg-[#fdf2e9] rounded-xl border border-[#fcd3b3] text-center">
              <span className="text-[14px] font-semibold text-[#ea580c]">Multi-Layer Risk Fusion Model</span>
              <p className="text-[12px] text-[#7c3e16] mt-0.5 font-normal">Environmental (58%) + Thermal (22%) + Vulnerability (14%) + Exposure (6%)</p>
            </div>
            <div className="p-3.5 bg-[#fdf2e9] rounded-xl border border-[#fcd3b3] text-center">
              <span className="text-[14px] font-semibold text-[#ea580c]">GIS Priority Ward Mapping</span>
              <p className="text-[12px] text-[#7c3e16] mt-0.5 font-normal">Overlays thermal risk on informal demographic density</p>
            </div>
          </div>

          <ArrowDown className="w-4 h-4 text-[#236c43]" />

          {/* Layer 4: Predictive Forecast, Alerts & Pre-emptive Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full">
            <div className="p-3.5 bg-[#1b4d3e] text-white rounded-xl text-center shadow-sm">
              <span className="text-[14px] font-semibold block text-[#86efac]">3–5 Day Forecast</span>
              <p className="text-[12px] text-white/80 mt-0.5 font-normal">Diurnal health risk trajectories</p>
            </div>
            <div className="p-3.5 bg-[#1b4d3e] text-white rounded-xl text-center shadow-sm">
              <span className="text-[14px] font-semibold block text-[#86efac]">Localized Alerts</span>
              <p className="text-[12px] text-white/80 mt-0.5 font-normal">SMS, WhatsApp, and CAP webhooks</p>
            </div>
            <div className="p-3.5 bg-[#1b4d3e] text-white rounded-xl text-center shadow-sm">
              <span className="text-[14px] font-semibold block text-[#86efac]">Recommended Action</span>
              <p className="text-[12px] text-white/80 mt-0.5 font-normal">Cooling centers, hospital readiness</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ingestion Data Sources Table */}
      <div className="bg-white p-5 rounded-2xl border border-[#dfebe1] shadow-card">
        <h3 className="font-display text-[17px] font-semibold text-[#143d2b] mb-4">Configured Ingestion Data Providers</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e5efe8] text-[12px] text-[#698879] uppercase font-semibold tracking-wider bg-[#f8faf8]">
                <th className="p-3">Data Stream Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Source Provider</th>
                <th className="p-3">Refresh Frequency</th>
                <th className="p-3">Latency</th>
                <th className="p-3">Reliability</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf4ee]">
              {dataSources.map(ds => (
                <tr key={ds.id} className="hover:bg-[#f7faf8] transition-colors">
                  <td className="p-3 font-semibold text-[#143d2b]">{ds.name}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f0f6f2] text-[#1b4d3e] font-medium text-[11px] border border-[#d2e2d6]">
                      {ds.category}
                    </span>
                  </td>
                  <td className="p-3 text-[#507060] font-medium">{ds.provider}</td>
                  <td className="p-3 text-[#507060]">{ds.refresh_frequency}</td>
                  <td className="p-3 font-semibold text-[#143d2b]">{ds.latency_ms} ms</td>
                  <td className="p-3 font-bold text-[#2e7d32]">{ds.reliability_pct}%</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e8f5ec] text-[#2e7d32] font-semibold text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
                      {ds.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setInspectSource(ds)}
                      className="px-3 py-1 bg-[#f4f8f4] hover:bg-[#eaf4ec] text-[#1b4d3e] rounded-lg border border-[#cde0d3] font-semibold text-[11px] flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <Code className="w-3.5 h-3.5" /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Payload Inspector Modal */}
      {inspectSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dbe8df]">
            <div className="flex items-center justify-between mb-3 border-b border-[#edf4ee] pb-2">
              <h3 className="font-display text-[16px] font-semibold text-[#143d2b] flex items-center gap-2">
                <Code className="w-4 h-4 text-[#236c43]" /> Live Ingestion Stream Sample: {inspectSource.name}
              </h3>
              <button onClick={() => setInspectSource(null)} className="text-gray-400 hover:text-gray-600 font-bold p-1 cursor-pointer">✕</button>
            </div>
            <pre className="bg-[#143d2b] text-[#86efac] p-4 rounded-xl text-[12px] font-mono overflow-x-auto max-h-80">
              {JSON.stringify(samplePayload, null, 2)}
            </pre>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setInspectSource(null)}
                className="px-5 py-2 bg-[#1b4d3e] text-white text-[13px] font-semibold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
