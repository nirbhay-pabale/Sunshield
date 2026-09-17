import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Sun, 
  Droplets, 
  Wind, 
  Thermometer, 
  ShieldCheck, 
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  AreaChart,
  Area 
} from 'recharts';

export const ForecastPage: React.FC = () => {
  const { overviewData, selectedZoneId, zones } = useApp();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(3); // default Thu Apr 24 (peak)

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];
  const forecastDays = overviewData.forecast_5day;
  const activeDay = forecastDays[selectedDayIndex] || forecastDays[0];

  // Hourly diurnal projection simulation for the active day
  const hourlyData = [
    { hour: '06:00 AM', temp: activeDay.temp_c - 6, hi: activeDay.heat_index_c - 7, wbgt: activeDay.wbgt_c - 5 },
    { hour: '09:00 AM', temp: activeDay.temp_c - 2, hi: activeDay.heat_index_c - 3, wbgt: activeDay.wbgt_c - 2 },
    { hour: '12:00 PM', temp: activeDay.temp_c + 0.5, hi: activeDay.heat_index_c + 1, wbgt: activeDay.wbgt_c + 0.5 },
    { hour: '02:00 PM', temp: activeDay.temp_c + 1.2, hi: activeDay.heat_index_c + 2, wbgt: activeDay.wbgt_c + 1.2 },
    { hour: '04:00 PM', temp: activeDay.temp_c, hi: activeDay.heat_index_c, wbgt: activeDay.wbgt_c },
    { hour: '07:00 PM', temp: activeDay.temp_c - 3, hi: activeDay.heat_index_c - 3.5, wbgt: activeDay.wbgt_c - 2.5 },
    { hour: '10:00 PM', temp: activeDay.temp_c - 5.5, hi: activeDay.heat_index_c - 5, wbgt: activeDay.wbgt_c - 4 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#dfebe1] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[26px] sm:text-[30px] font-semibold text-[#143d2b] flex items-center gap-2.5 tracking-[-0.02em] leading-[1.15]">
            <Calendar className="w-6 h-6 text-[#236c43]" /> 5-Day Health-Risk & Thermal-Stress Prediction
          </h2>
          <p className="text-[14px] text-[#597669] mt-1 font-normal leading-[1.5]">
            Forward-looking biometeorological modeling for pre-emptive municipal heat health interventions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-[13px] font-semibold text-[#ea580c] bg-[#ffedd5] border border-[#fdba74] px-4 py-1.5 rounded-full flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> Trend: Increasing Peak on Thu, Apr 24
          </div>
          <div className="text-[13px] font-semibold text-[#143d2b] bg-[#eaf4ec] px-4 py-1.5 rounded-full border border-[#cce2d2]">
            Confidence: 91%
          </div>
        </div>
      </div>

      {/* 5-Day Horizontal Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
        {forecastDays.map((day, idx) => {
          const isSelected = idx === selectedDayIndex;
          return (
            <div
              key={day.full_date}
              onClick={() => setSelectedDayIndex(idx)}
              className={`p-4.5 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-[#1b4d3e] to-[#143d2b] text-white shadow-md ring-2 ring-[#236c43]/40'
                  : 'bg-white border-[#dfebe1] hover:bg-[#f6faf7] text-[#143d2b]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold uppercase">{day.day_name}</span>
                  <span className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-[#6b8c7e]'}`}>{day.date_str}</span>
                </div>
                {day.is_peak && (
                  <span className="inline-block text-[10px] font-bold uppercase bg-[#ef4444] text-white px-2.5 py-0.5 rounded-full mt-1.5 shadow-2xs">
                    Peak Risk
                  </span>
                )}
              </div>

              <div className="my-3.5">
                <div className="text-[28px] font-bold leading-[1.0]">{day.temp_c}°C</div>
                <div className={`text-[12px] font-medium mt-1 ${isSelected ? 'text-[#fca5a5]' : 'text-[#ea580c]'}`}>
                  Feels: {day.feels_like_c}°C
                </div>
              </div>

              <div className="border-t border-white/10 pt-2.5 flex items-center justify-between text-[12px]">
                <span className={isSelected ? 'text-white/70 font-normal' : 'text-[#628172] font-normal'}>WBGT: {day.wbgt_c}°C</span>
                <RiskBadge level={day.risk_level} size="sm" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Diurnal Breakdown for Selected Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3: Diurnal Hourly Curve */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#dfebe1] shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[16px] font-semibold text-[#143d2b]">
                Diurnal Heat Curve: {activeDay.day_name}, {activeDay.date_str} ({selectedZone.name})
              </h3>
              <p className="text-[12px] text-[#638374] font-normal mt-0.5">Hourly diurnal progression of ambient heat vs. human heat index</p>
            </div>
            <RiskBadge level={activeDay.risk_level} size="md" showDot />
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#edf4ee" vertical={false} />
                <XAxis dataKey="hour" tick={{ fill: '#5e7d6f', fontSize: 12 }} axisLine={{ stroke: '#d8e7dc' }} tickLine={false} />
                <YAxis domain={[24, 48]} tick={{ fill: '#5e7d6f', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #dce8df', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', fontSize: '13px' }}
                  formatter={(val: any, name: any) => [
                    `${val}°C`,
                    name === 'hi' ? 'Heat Index' : (name === 'temp' ? 'Temperature' : 'WBGT')
                  ]}
                />
                <Area type="monotone" dataKey="hi" stroke="#ea580c" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHI)" name="hi" />
                <Line type="monotone" dataKey="temp" stroke="#059669" strokeWidth={2} dot={{ r: 4, fill: '#059669' }} name="temp" />
                <Line type="monotone" dataKey="wbgt" stroke="#6366f1" strokeWidth={1.8} strokeDasharray="3 3" name="wbgt" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[12px] font-medium text-[#507060] mt-3.5 pt-3.5 border-t border-[#edf4ee]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ea580c]" /> Heat Index (Apparent Heat)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#059669]" /> Ambient Temperature
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#6366f1]" /> WBGT Threshold
            </div>
          </div>
        </div>

        {/* Right 1/3: Day Operational Guidance */}
        <div className="bg-white p-5 rounded-2xl border border-[#dfebe1] shadow-card space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-[#143d2b] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#236c43]" /> Peak Exposure Window & Directives
            </h3>
            <div className="p-3.5 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-[13px] text-[#991b1b] mt-3 space-y-1">
              <p className="font-semibold flex items-center gap-1.5 text-[13px]">
                <AlertTriangle className="w-4 h-4 text-[#dc2626]" /> 11:30 AM – 04:30 PM (Critical Heat Load)
              </p>
              <p className="text-[12px] leading-[1.5] mt-1 font-normal">
                Heat Index projected to sustain above 42°C with high solar flux ({activeDay.solar_radiation}).
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-[13px]">
            <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#e5efe8]">
              <span className="font-semibold text-[#143d2b] block">Vulnerable Cohort Action:</span>
              <p className="text-[12px] text-[#557364] mt-0.5 leading-[1.4]">Deploy mobile hydration stations to bus depots and market yards.</p>
            </div>
            <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#e5efe8]">
              <span className="font-semibold text-[#143d2b] block">Hospital Staffing Directive:</span>
              <p className="text-[12px] text-[#557364] mt-0.5 leading-[1.4]">Sassoon Hospital ER heatstroke triage units on Level 2 readiness.</p>
            </div>
          </div>

          <div className="p-3 bg-[#eaf4ec] rounded-xl border border-[#cbe3d2] text-[12px] flex items-center gap-2 text-[#1b4d3e]">
            <Sparkles className="w-4 h-4 text-[#236c43] shrink-0" />
            <span className="text-[11px] font-normal">Model: SUNSHIELD-Predict-v2.4 (IMD AWS + INSAT-3DR Ensemble)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
