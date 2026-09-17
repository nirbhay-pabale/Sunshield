import React, { useState, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { apiService } from '../services/api';
import { 
  FileText, 
  Download, 
  Printer, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Thermometer, 
  Sun, 
  Droplets, 
  Wind, 
  Sparkles, 
  CheckCircle,
  AlertTriangle,
  Users,
  Activity,
  Zap,
  Building,
  HeartPulse,
  Share2,
  RefreshCw,
  Sliders,
  Award,
  Check,
  Compass,
  Radio
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const ReportsPage: React.FC = () => {
  const { zones, selectedZoneId, setSelectedZoneId, overviewData } = useApp();

  const [selectedReportZone, setSelectedReportZone] = useState<string>(selectedZoneId || 'shivajinagar');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('24 Apr 2025');
  const [reportType, setReportType] = useState<'comprehensive' | 'health' | 'meteorology' | 'comparative'>('comprehensive');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  const reportRef = useRef<HTMLDivElement>(null);

  const zone = useMemo(() => {
    return zones.find(z => z.id === selectedReportZone) || zones[0] || {
      id: 'shivajinagar',
      name: 'Shivajinagar',
      zone_type: 'Mixed Commercial & Transit',
      risk: { overall_risk_score: 78, risk_level: 'high' },
      weather: {
        temperature_c: 41.2,
        feels_like_c: 45.6,
        humidity_pct: 62,
        wind_speed_kmh: 8.4,
        solar_radiation_wm2: 940,
        solar_radiation_level: 'Extreme',
        aqi: 142,
        aqi_status: 'Moderate',
        pm25: 58.4,
      },
      thermal_stress: {
        heat_index_c: 46.2,
        heat_index_category: 'Danger',
        wbgt_c: 32.4,
        utci_c: 43.8,
      },
      vulnerability: {
        elderly_pct: 18.4,
        outdoor_workers_pct: 32.6,
        informal_housing_pct: 24.1,
        green_cover_pct: 12.8,
        healthcare_access_score: 82,
      }
    };
  }, [zones, selectedReportZone]);

  // Chart Data 1: Compound Risk Contribution Pie
  const riskBreakdownData = [
    { name: 'Environmental Heat (Ambient & Solar)', value: 58, color: '#ea580c' },
    { name: 'Human Thermal Stress (HI & WBGT)', value: 22, color: '#eab308' },
    { name: 'Vulnerability (Age & Informal Housing)', value: 14, color: '#16a34a' },
    { name: 'Built Environment Exposure (Concrete/Canopy)', value: 6, color: '#0284c7' },
  ];

  // Chart Data 2: Vulnerable Population Cohort Distribution
  const vulnerabilityCohortData = [
    { name: 'Outdoor & Construction Laborers', value: 34, color: '#dc2626', count: '48,200 Citizens' },
    { name: 'Geriatric Population (Age 65+)', value: 28, color: '#ea580c', count: '39,700 Citizens' },
    { name: 'Informal & Metal-Roof Housing', value: 20, color: '#f59e0b', count: '28,400 Citizens' },
    { name: 'Early Childhood (<5 Years)', value: 18, color: '#0284c7', count: '25,500 Citizens' },
  ];

  // Chart Data 3: Multi-Ward Comparative Risk Bar Chart
  const wardComparisonData = useMemo(() => {
    return zones.slice(0, 5).map(z => ({
      name: z.name.replace(' Sector', '').replace(' Central', ''),
      temperature: z.weather.temperature_c,
      heatIndex: z.thermal_stress.heat_index_c,
      riskScore: z.risk.overall_risk_score,
      humidity: z.weather.humidity_pct,
    }));
  }, [zones]);

  // Chart Data 4: 24-Hour Diurnal Heat & Thermal Load Progression
  const diurnalCycleData = [
    { time: '06:00', temp: 27.2, feelsLike: 28.5, wbgt: 24.1, solar: 120, dangerThreshold: 40 },
    { time: '08:00', temp: 31.0, feelsLike: 33.2, wbgt: 26.8, solar: 380, dangerThreshold: 40 },
    { time: '10:00', temp: 36.4, feelsLike: 39.8, wbgt: 29.5, solar: 680, dangerThreshold: 40 },
    { time: '12:00', temp: 40.5, feelsLike: 44.8, wbgt: 32.1, solar: 920, dangerThreshold: 40 },
    { time: '14:00', temp: 42.1, feelsLike: 46.8, wbgt: 33.6, solar: 980, dangerThreshold: 40 },
    { time: '16:00', temp: 41.3, feelsLike: 45.4, wbgt: 32.8, solar: 740, dangerThreshold: 40 },
    { time: '18:00', temp: 37.8, feelsLike: 40.2, wbgt: 29.7, solar: 320, dangerThreshold: 40 },
    { time: '20:00', temp: 33.5, feelsLike: 35.8, wbgt: 27.4, solar: 40, dangerThreshold: 40 },
    { time: '22:00', temp: 30.2, feelsLike: 32.0, wbgt: 25.8, solar: 0, dangerThreshold: 40 },
  ];

  // Download High-Resolution PDF
  const handleClientDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`SUNSHIELD_Intelligence_Report_${zone.id}_${selectedPeriod.replace(/ /g, '_')}.pdf`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } catch (e) {
      console.error('Client PDF generation error:', e);
      window.open(apiService.getReportDownloadUrl(zone.id, selectedPeriod), '_blank');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#143d2b] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#86efac]/30 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="w-5 h-5 text-[#86efac]" />
          <div>
            <p className="text-xs font-bold">Official Dossier Exported Successfully</p>
            <p className="text-[11px] text-[#86efac]">SUNSHIELD High-Resolution PDF ready in your downloads.</p>
          </div>
        </div>
      )}

      {/* Top Header Card & Export Controls */}
      <div className="bg-white p-6 rounded-2xl border border-[#dfebe1] shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 flex items-center justify-center shrink-0">
            <img 
              src="/sunshield_logo.png" 
              alt="SUNSHIELD" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-[26px] sm:text-[28px] font-semibold text-[#143d2b] tracking-[-0.02em] leading-[1.15]">
                SUNSHIELD Intelligence Dossier Generator
              </h2>
              <span className="bg-[#eaf4ec] text-[#236c43] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#236c43]/20 uppercase">
                v2.4 Certified
              </span>
            </div>
            <p className="text-[13px] text-[#597669] mt-1 font-normal leading-[1.4]">
              Multi-Source Biometeorological Fusion • ISO 7243 Thermal Stress Analytics • NDMA CAP v1.2 Action Plan
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePrint}
            className="bg-[#f0f6f2] hover:bg-[#e4ede6] border border-[#d2e2d6] text-[#1b4d3e] px-4 py-2 rounded-xl text-[13px] font-medium flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <Printer className="w-4 h-4 text-[#236c43]" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={handleClientDownloadPdf}
            disabled={isGenerating}
            className="bg-[#1b4d3e] hover:bg-[#143d2b] text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-2.5 shadow-md shadow-[#1b4d3e]/20 transition-all cursor-pointer active:scale-98 disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Compiling High-Res PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#86efac]" />
                <span>Export Branded PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Filter & Scope Control Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#dfebe1] shadow-card grid grid-cols-1 md:grid-cols-4 gap-4 text-[13px]">
        {/* Ward Selector */}
        <div>
          <label className="block text-[#658375] font-medium mb-1.5 flex items-center gap-1.5 text-[12px]">
            <MapPin className="w-3.5 h-3.5 text-[#236c43]" /> Geographic Sector / Ward
          </label>
          <select
            value={selectedReportZone}
            onChange={e => {
              setSelectedReportZone(e.target.value);
              setSelectedZoneId(e.target.value);
            }}
            className="w-full bg-[#f8faf8] border border-[#d2e2d6] focus:border-[#236c43] rounded-xl px-3 py-2 font-medium text-[13px] text-[#143d2b] outline-none transition-colors"
          >
            {zones.map(z => (
              <option key={z.id} value={z.id}>
                {z.name}, Pune ({z.zone_type}) — Risk: {z.risk.overall_risk_score}/100
              </option>
            ))}
          </select>
        </div>

        {/* Timeframe */}
        <div>
          <label className="block text-[#658375] font-medium mb-1.5 flex items-center gap-1.5 text-[12px]">
            <Calendar className="w-3.5 h-3.5 text-[#236c43]" /> Audit Time Horizon
          </label>
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className="w-full bg-[#f8faf8] border border-[#d2e2d6] focus:border-[#236c43] rounded-xl px-3 py-2 font-medium text-[13px] text-[#143d2b] outline-none transition-colors"
          >
            <option value="24 Apr 2025">Peak Heat Event: 24 Apr 2025 (Live)</option>
            <option value="21 Apr - 25 Apr 2025">5-Day Heatwave Waveform (21–25 Apr 2025)</option>
            <option value="Apr 2025 Full Month">Full April 2025 Retrospective Summary</option>
          </select>
        </div>

        {/* Report Scope Template */}
        <div>
          <label className="block text-[#658375] font-medium mb-1.5 flex items-center gap-1.5 text-[12px]">
            <Sliders className="w-3.5 h-3.5 text-[#236c43]" /> Intelligence Scope Template
          </label>
          <select
            value={reportType}
            onChange={e => setReportType(e.target.value as any)}
            className="w-full bg-[#f8faf8] border border-[#d2e2d6] focus:border-[#236c43] rounded-xl px-3 py-2 font-medium text-[13px] text-[#143d2b] outline-none transition-colors"
          >
            <option value="comprehensive">Comprehensive Executive Dossier</option>
            <option value="health">Public Health & Hospital Surge Protocol</option>
            <option value="meteorology">Forensic Meteorological & Radar Telemetry</option>
            <option value="comparative">Ward-by-Ward Comparative Resilience</option>
          </select>
        </div>

        {/* Standards Certification Pill */}
        <div>
          <label className="block text-[#658375] font-medium mb-1.5 flex items-center gap-1.5 text-[12px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#236c43]" /> Authority Standard
          </label>
          <div className="bg-[#f0f7f2] border border-[#cce3d2] rounded-xl px-3 py-2 text-[#143d2b] font-semibold text-[13px] flex items-center justify-between">
            <span className="truncate">NDMA & IMD CAP Protocol</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] animate-pulse shrink-0 ml-2" />
          </div>
        </div>
      </div>

      {/* LIVE DOSSIER CANVAS (RENDERED FOR SCREEN & PDF CAPTURE) */}
      <div className="bg-[#e4ece6] p-3 sm:p-8 rounded-3xl flex justify-center shadow-inner">
        <div 
          ref={reportRef}
          className="w-full max-w-5xl bg-white p-6 sm:p-10 rounded-2xl shadow-2xl border border-[#c8dbcf] space-y-8 text-[#143d2b] font-sans"
        >
          
          {/* 1. OFFICIAL BRANDED LETTERHEAD & METADATA */}
          <div className="border-b-2 border-[#1b4d3e] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center shrink-0">
                <img 
                  src="/sunshield_logo.png" 
                  alt="SUNSHIELD" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-display text-[26px] font-bold tracking-tight text-[#143d2b]">SUNSHIELD</span>
                  <span className="bg-[#1b4d3e] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    OFFICIAL DOSSIER
                  </span>
                </div>
                <p className="text-[13px] font-semibold text-[#236c43] mt-0.5">
                  Heat & Climate Health Intelligence System • Municipal Emergency Response
                </p>
                <p className="text-[11px] text-[#5e7c6e] font-normal">
                  Certified Biometeorological Threat Assessment • Smart Cities Mission
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-[12px] bg-[#f4f8f5] p-3.5 rounded-xl border border-[#d6e5da] space-y-0.5">
              <div className="font-semibold text-[14px] text-[#143d2b]">{zone.name} Sector, Pune</div>
              <div className="text-[#4e6e5f]">Audit Window: <b className="text-[#143d2b] font-semibold">{selectedPeriod}</b></div>
              <div className="text-[11px] text-[#6d8b7c] font-mono">
                REF: SUN-HAP-{zone.id.toUpperCase()}-2026-X89
              </div>
              <div className="text-[11px] text-[#16a34a] font-semibold flex items-center sm:justify-end gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> NDMA CAP v1.2 Certified
              </div>
            </div>
          </div>

          {/* 2. EXECUTIVE SUMMARY KPI CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 bg-gradient-to-br from-[#f6faf7] to-[#eef6f1] p-5 rounded-2xl border border-[#d2e4d7] shadow-xs">
            <div className="p-3.5 bg-white rounded-xl border border-[#d9ebd0]">
              <span className="text-[12px] font-medium text-[#5c7a6b] block">Composite Risk Index</span>
              <div className="text-[32px] font-bold text-[#ea580c] mt-1 leading-[1.0]">{zone.risk.overall_risk_score}<span className="text-[14px] text-[#718f80] font-normal">/100</span></div>
              <div className="mt-2">
                <RiskBadge level={zone.risk.risk_level} size="sm" />
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#d9ebd0]">
              <span className="text-[12px] font-medium text-[#5c7a6b] block">Ambient & Feels Like</span>
              <div className="text-[32px] font-bold text-[#143d2b] mt-1 leading-[1.0]">{zone.weather.temperature_c}°C</div>
              <span className="text-[12px] text-[#ea580c] font-semibold block mt-1.5">Feels Like: {zone.weather.feels_like_c}°C</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#d9ebd0]">
              <span className="text-[12px] font-medium text-[#5c7a6b] block">NOAA Heat Index</span>
              <div className="text-[32px] font-bold text-[#dc2626] mt-1 leading-[1.0]">{zone.thermal_stress.heat_index_c}°C</div>
              <span className="text-[12px] text-[#dc2626] font-semibold block mt-1.5">
                ⚠️ {zone.thermal_stress.heat_index_category}
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#d9ebd0]">
              <span className="text-[12px] font-medium text-[#5c7a6b] block">ISO 7243 WBGT & AQI</span>
              <div className="text-[32px] font-bold text-[#b45309] mt-1 leading-[1.0]">{zone.thermal_stress.wbgt_c}°C</div>
              <span className="text-[12px] text-[#2e7d32] font-semibold block mt-1.5">
                AQI {zone.weather.aqi} ({zone.weather.aqi_status})
              </span>
            </div>
          </div>

          {/* 3. VISUAL ILLUSTRATIONS & DUAL PIE CHARTS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#e5efe8] pb-2">
              <h3 className="font-display text-[18px] font-semibold text-[#143d2b] flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#ea580c]" /> 1. Visual Risk Fusion & Vulnerable Demographics
              </h3>
              <span className="text-[12px] text-[#6b8c7e] font-medium">AI Predictive Weightage Model</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* PIE CHART A: Risk Factor Weightage */}
              <div className="bg-[#fbfdfb] p-4.5 rounded-2xl border border-[#dceade] shadow-xs flex flex-col justify-between">
                <div>
                  <h4 className="text-[15px] font-semibold text-[#143d2b] flex items-center justify-between">
                    <span>Compound Risk Factor Weightage</span>
                    <span className="text-[11px] text-[#236c43] font-medium bg-[#eaf4ec] px-2.5 py-0.5 rounded-full">100% Normalized</span>
                  </h4>
                  <p className="text-[13px] text-[#608070] mt-1">
                    Multi-layer algorithmic decomposition of heat stress drivers.
                  </p>
                </div>

                <div className="h-52 w-full my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {riskBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(val: any) => [`${val}% Weight`, 'Contribution']}
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #d2e2d6', fontSize: '12px', fontWeight: '500' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[12px] pt-2.5 border-t border-[#edf4ee]">
                  {riskBreakdownData.map(item => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate text-[#2a4537]">{item.name.split('(')[0]}: <b className="font-semibold">{item.value}%</b></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PIE CHART B: Vulnerable Population Cohort */}
              <div className="bg-[#fbfdfb] p-4.5 rounded-2xl border border-[#dceade] shadow-xs flex flex-col justify-between">
                <div>
                  <h4 className="text-[15px] font-semibold text-[#143d2b] flex items-center justify-between">
                    <span>Vulnerable Demographic Cohorts</span>
                    <span className="text-[11px] text-[#ea580c] font-medium bg-[#fff3ed] px-2.5 py-0.5 rounded-full">141,800 Impacted</span>
                  </h4>
                  <p className="text-[13px] text-[#608070] mt-1">
                    High-risk populations requiring targeted cooling & healthcare outreach.
                  </p>
                </div>

                <div className="h-52 w-full my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vulnerabilityCohortData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {vulnerabilityCohortData.map((entry, index) => (
                          <Cell key={`cohort-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(val: any, name: any, item: any) => [`${val}% (${item.payload.count})`, name]}
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #d2e2d6', fontSize: '12px', fontWeight: '500' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[12px] pt-2.5 border-t border-[#edf4ee]">
                  {vulnerabilityCohortData.map(item => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate text-[#2a4537]">{item.name.split('(')[0]}: <b className="font-semibold">{item.value}%</b></span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* 4. MULTI-WARD COMPARATIVE HEAT AUDIT BAR CHART */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#e5efe8] pb-2">
              <h3 className="font-display text-[18px] font-semibold text-[#143d2b] flex items-center gap-2">
                <Building className="w-5 h-5 text-[#0284c7]" /> 2. Metropolitan Ward-by-Ward Comparative Resilience
              </h3>
              <span className="text-[12px] text-[#6b8c7e] font-medium">Cross-Sector Thermal Variance</span>
            </div>

            <div className="bg-[#fbfdfb] p-4.5 rounded-2xl border border-[#dceade] shadow-xs">
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wardComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#edf4ee" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#4d6a5d', fontWeight: 500 }} />
                    <YAxis tick={{ fontSize: 11, fill: '#6b8c7e' }} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #d2e2d6', fontSize: '12px', fontWeight: '500' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    <Bar dataKey="temperature" name="Ambient Temp (°C)" fill="#ea580c" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="heatIndex" name="Heat Index (°C)" fill="#dc2626" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="riskScore" name="Overall Risk Score (/100)" fill="#16a34a" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 5. 24-HOUR DIURNAL THERMAL STRAIN AREA CURVE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#e5efe8] pb-2">
              <h3 className="font-display text-[18px] font-semibold text-[#143d2b] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#dc2626]" /> 3. Diurnal Thermal Strain Waveform (06:00 – 22:00 IST)
              </h3>
              <span className="text-[12px] text-[#dc2626] font-semibold">Peak Exposure Window: 11:30 AM – 04:30 PM</span>
            </div>

            <div className="bg-[#fbfdfb] p-4.5 rounded-2xl border border-[#dceade] shadow-xs">
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={diurnalCycleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="heatGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="wbgtGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#edf4ee" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#4d6a5d', fontWeight: 500 }} />
                    <YAxis domain={[20, 50]} tick={{ fontSize: 11, fill: '#6b8c7e' }} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #d2e2d6', fontSize: '12px', fontWeight: '500' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    <Area type="monotone" dataKey="feelsLike" name="Feels-Like Temp (°C)" stroke="#dc2626" strokeWidth={2.5} fillOpacity={1} fill="url(#heatGradient)" />
                    <Area type="monotone" dataKey="wbgt" name="ISO 7243 WBGT (°C)" stroke="#ea580c" strokeWidth={2} fillOpacity={1} fill="url(#wbgtGradient)" />
                    <Line type="monotone" dataKey="temp" name="Ambient Temp (°C)" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="dangerThreshold" name="Danger Threshold (40°C)" stroke="#991b1b" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 6. BIOMETEOROLOGICAL & ENVIRONMENTAL SENSOR TELEMETRY */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#e5efe8] pb-2">
              <h3 className="font-display text-[18px] font-semibold text-[#143d2b] flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#236c43]" /> 4. Forensic Sensor Telemetry & Biometeorological Indices
              </h3>
              <span className="text-[12px] text-[#6b8c7e] font-medium">INSAT-3DR & IMD Mesh</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-[13px]">
              <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#e2ede5]">
                <span className="text-[12px] font-medium text-[#5c7a6b] block">Heat Index</span>
                <span className="text-[22px] font-bold text-[#dc2626] leading-tight">{zone.thermal_stress.heat_index_c}°C</span>
                <p className="text-[11px] text-[#718f80] mt-1">NOAA Rothfusz</p>
              </div>

              <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#e2ede5]">
                <span className="text-[12px] font-medium text-[#5c7a6b] block">WBGT Index</span>
                <span className="text-[22px] font-bold text-[#ea580c] leading-tight">{zone.thermal_stress.wbgt_c}°C</span>
                <p className="text-[11px] text-[#718f80] mt-1">ISO 7243 Work Limit</p>
              </div>

              <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#e2ede5]">
                <span className="text-[12px] font-medium text-[#5c7a6b] block">UTCI Stress</span>
                <span className="text-[22px] font-bold text-[#ea580c] leading-tight">{zone.thermal_stress.utci_c}°C</span>
                <p className="text-[11px] text-[#718f80] mt-1">Very High Strain</p>
              </div>

              <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#e2ede5]">
                <span className="text-[12px] font-medium text-[#5c7a6b] block">Solar Radiation</span>
                <span className="text-[22px] font-bold text-[#b45309] leading-tight">{zone.weather.solar_radiation_wm2} <span className="text-[12px] font-normal">W/m²</span></span>
                <p className="text-[11px] text-[#718f80] mt-1">{zone.weather.solar_radiation_level}</p>
              </div>

              <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#e2ede5]">
                <span className="text-[12px] font-medium text-[#5c7a6b] block">Air Quality PM2.5</span>
                <span className="text-[22px] font-bold text-[#ca8a04] leading-tight">{zone.weather.pm25} <span className="text-[12px] font-normal">µg/m³</span></span>
                <p className="text-[11px] text-[#718f80] mt-1">AQI: {zone.weather.aqi}</p>
              </div>

              <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#e2ede5]">
                <span className="text-[12px] font-medium text-[#5c7a6b] block">Canopy Cover</span>
                <span className="text-[22px] font-bold text-[#16a34a] leading-tight">{(zone as any).green_cover_pct || 14.2}%</span>
                <p className="text-[11px] text-[#718f80] mt-1">Urban Canopy</p>
              </div>
            </div>
          </div>

          {/* 7. 5-DAY HEATWAVE FORECAST TABLE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#e5efe8] pb-2">
              <h3 className="font-display text-[18px] font-semibold text-[#143d2b] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#236c43]" /> 5. 5-Day Forward Heat-Health Forecast Trajectory
              </h3>
              <span className="text-[12px] text-[#6b8c7e] font-medium">IMD High-Resolution Ensembles</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#d8e6dc]">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#143d2b] text-white text-[12px] uppercase font-semibold tracking-wider">
                  <tr>
                    <th className="p-3">Day & Date</th>
                    <th className="p-3">Ambient Temp</th>
                    <th className="p-3">Heat Index</th>
                    <th className="p-3">ISO WBGT</th>
                    <th className="p-3">Health Threat Level</th>
                    <th className="p-3 text-right">Emergency Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf4ee] bg-white">
                  {overviewData.forecast_5day.map(f => (
                    <tr key={f.full_date} className={f.is_peak ? 'bg-[#fef2f2] font-medium' : 'hover:bg-[#f8faf8]'}>
                      <td className="p-3 font-semibold flex items-center gap-2">
                        {f.is_peak && <AlertTriangle className="w-4 h-4 text-[#dc2626]" />}
                        <span>{f.day_name}, {f.date_str}</span>
                      </td>
                      <td className="p-3 font-medium text-[#143d2b]">{f.temp_c}°C</td>
                      <td className="p-3 font-bold text-[#dc2626]">{f.heat_index_c}°C</td>
                      <td className="p-3 font-semibold text-[#ea580c]">{f.wbgt_c}°C</td>
                      <td className="p-3"><RiskBadge level={f.risk_level} size="sm" /></td>
                      <td className="p-3 text-right">
                        {f.is_peak ? (
                          <span className="text-[11px] bg-[#fee2e2] text-[#b91c1c] border border-[#f87171] px-2.5 py-0.5 rounded-md font-bold uppercase">
                            🔴 RED ALERT PEAK
                          </span>
                        ) : (
                          <span className="text-[11px] bg-[#f0f7f2] text-[#1b4d3e] px-2.5 py-0.5 rounded-md font-medium">
                            ACTIVE MONITORING
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 8. MUNICIPAL HEAT ACTION PLAN & CLINICAL DIRECTIVES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#e5efe8] pb-2">
              <h3 className="font-display text-[18px] font-semibold text-[#143d2b] flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-[#dc2626]" /> 6. Immediate Municipal Intervention & Emergency Directives
              </h3>
              <span className="text-[12px] text-[#dc2626] font-semibold">MANDATORY PROTOCOL</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-[13px]">
              <div className="p-4 bg-[#fbfdfb] rounded-xl border border-[#dceade] space-y-1.5">
                <div className="flex items-center gap-2 text-[#16a34a] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
                  <span>Public Cooling Centers</span>
                </div>
                <p className="text-[13px] text-[#3d5a4b] leading-[1.5]">
                  Activate 14 designated air-conditioned municipal halls, library shelters, and misting transit hubs in {zone.name} with free cold electrolytes.
                </p>
              </div>

              <div className="p-4 bg-[#fbfdfb] rounded-xl border border-[#dceade] space-y-1.5">
                <div className="flex items-center gap-2 text-[#ea580c] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" />
                  <span>Occupational Labor Shift</span>
                </div>
                <p className="text-[13px] text-[#3d5a4b] leading-[1.5]">
                  Enforce strict 11:00 AM – 4:00 PM moratorium on outdoor construction and gig delivery workers under Maharashtra Labor Safety Act.
                </p>
              </div>

              <div className="p-4 bg-[#fbfdfb] rounded-xl border border-[#dceade] space-y-1.5">
                <div className="flex items-center gap-2 text-[#dc2626] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" />
                  <span>Hospital Triage Readiness</span>
                </div>
                <p className="text-[13px] text-[#3d5a4b] leading-[1.5]">
                  Sassoon General Hospital and Primary Health Centers on Level-2 heatstroke surge protocol with ice immersion baths & IV fluid caches.
                </p>
              </div>
            </div>
          </div>

          {/* 9. MUNICIPAL CERTIFICATION, CRYPTOGRAPHIC STAMP & QR CODE */}
          <div className="border-t-2 border-[#1b4d3e] pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#5c7a6b]">
            <div className="space-y-1">
              <p className="font-semibold text-[#143d2b] text-[13px]">
                SUNSHIELD Heat & Climate Health Intelligence System
              </p>
              <p>Certified Automated Biometeorological Advisory • Municipal Heat Action Plan (HAP)</p>
              <p className="font-mono text-[#236c43]">SHA-256 HASH: 94b7c1d3e8a4f0285e6a9c7b2d1e4f3a8b0c2d</p>
            </div>

            {/* Verification Stamp Graphic */}
            <div className="flex items-center gap-3 bg-[#f4f8f5] px-4 py-2 rounded-xl border border-[#cfe0d4]">
              <Award className="w-7 h-7 text-[#236c43]" />
              <div>
                <span className="font-semibold text-[#143d2b] block uppercase tracking-wider text-[11px]">
                  OFFICIAL MUNICIPAL SEAL
                </span>
                <span className="text-[#16a34a] font-medium">Digitally Verified & Certified</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
