import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { apiService } from '../services/api';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  ShieldAlert, 
  Sliders, 
  Sparkles, 
  Activity, 
  Heart, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const ThermalStressPage: React.FC = () => {
  const { overviewData, selectedZoneId, zones } = useApp();

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  // Interactive Simulator State
  const [simTemp, setSimTemp] = useState<number>(selectedZone.weather.temperature_c);
  const [simHumidity, setSimHumidity] = useState<number>(selectedZone.weather.humidity_pct);
  const [simWind, setSimWind] = useState<number>(selectedZone.weather.wind_speed_kmh);
  const [simSolar, setSimSolar] = useState<string>(selectedZone.weather.solar_radiation_level);

  // Computed simulation output
  const [simResult, setSimResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const runSimulation = async (t: number, h: number, w: number, s: string) => {
    setIsSimulating(true);
    try {
      const res = await apiService.simulateThermalStress({
        temperature_c: t,
        humidity_pct: h,
        wind_speed_kmh: w,
        solar_radiation_level: s,
      });
      setSimResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSliderChange = (type: string, val: any) => {
    let newT = simTemp;
    let newH = simHumidity;
    let newW = simWind;
    let newS = simSolar;

    if (type === 'temp') { newT = Number(val); setSimTemp(newT); }
    if (type === 'hum') { newH = Number(val); setSimHumidity(newH); }
    if (type === 'wind') { newW = Number(val); setSimWind(newW); }
    if (type === 'solar') { newS = String(val); setSimSolar(newS); }

    runSimulation(newT, newH, newW, newS);
  };

  const currentHI = simResult ? simResult.heat_index.value : selectedZone.thermal_stress.heat_index_c;
  const currentHICat = simResult ? simResult.heat_index.category : selectedZone.thermal_stress.heat_index_category;
  const currentWBGT = simResult ? simResult.wbgt.value : selectedZone.thermal_stress.wbgt_c;
  const currentWBGTCat = simResult ? simResult.wbgt.category : selectedZone.thermal_stress.wbgt_category;
  const currentUTCI = simResult ? simResult.utci.value : selectedZone.thermal_stress.utci_c;
  const currentUTCICat = simResult ? simResult.utci.category : selectedZone.thermal_stress.utci_category;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#dfebe1] shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-[26px] sm:text-[30px] font-semibold text-[#143d2b] flex items-center gap-2.5 tracking-[-0.02em] leading-[1.15]">
              <Thermometer className="w-6 h-6 text-[#236c43]" /> Human Thermal Stress Intelligence
            </h2>
            <p className="text-[14px] text-[#597669] mt-1 font-normal leading-[1.5]">
              "From predicting what the weather will be to predicting what the heat will do to people."
            </p>
          </div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-[#143d2b] bg-[#eaf4ec] px-4 py-1.5 rounded-full border border-[#cbe3d2]">
            <span>Active Context: <b className="font-semibold">{selectedZone.name}</b></span>
          </div>
        </div>
      </div>

      {/* 3 Core Human Thermal Stress Indices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Index 1: Heat Index */}
        <div className="bg-white p-5 rounded-2xl border border-[#dfebe1] shadow-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#143d2b]">Heat Index (HI)</span>
              <RiskBadge level={currentHICat} size="sm" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-[32px] font-bold text-[#ea580c] leading-[1.0]">{currentHI}°C</span>
              <span className="text-[12px] font-medium text-[#7a998a]">Apparent / Feels Like</span>
            </div>
          </div>
          <div className="text-[13px] text-[#4b6a5a] space-y-1.5 border-t border-[#edf4ee] pt-3.5">
            <p className="font-semibold text-[#143d2b] text-[13px]">NOAA Steadman / Rothfusz Equation</p>
            <p className="text-[12px] leading-[1.5] text-[#688577] font-normal">
              Measures physiological perception of heat when high relative humidity limits body cooling via sweat evaporation.
            </p>
          </div>
        </div>

        {/* Index 2: WBGT */}
        <div className="bg-white p-5 rounded-2xl border border-[#dfebe1] shadow-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#143d2b]">WBGT (Wet Bulb Globe)</span>
              <RiskBadge level={currentWBGTCat} size="sm" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-[32px] font-bold text-[#ea580c] leading-[1.0]">{currentWBGT}°C</span>
              <span className="text-[12px] font-medium text-[#7a998a]">Occupational Threshold</span>
            </div>
          </div>
          <div className="text-[13px] text-[#4b6a5a] space-y-1.5 border-t border-[#edf4ee] pt-3.5">
            <p className="font-semibold text-[#143d2b] text-[13px]">ISO 7243 / OSHA Outdoor Labor Standard</p>
            <p className="text-[12px] leading-[1.5] text-[#688577] font-normal">
              Combines ambient dry bulb, natural wet bulb evaporative capacity, solar thermal irradiance, and convective wind.
            </p>
          </div>
        </div>

        {/* Index 3: UTCI */}
        <div className="bg-white p-5 rounded-2xl border border-[#dfebe1] shadow-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#143d2b]">UTCI (Universal Climate)</span>
              <RiskBadge level={currentUTCICat} size="sm" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-[32px] font-bold text-[#ea580c] leading-[1.0]">{currentUTCI}°C</span>
              <span className="text-[12px] font-medium text-[#7a998a]">Biometeorological Strain</span>
            </div>
          </div>
          <div className="text-[13px] text-[#4b6a5a] space-y-1.5 border-t border-[#edf4ee] pt-3.5">
            <p className="font-semibold text-[#143d2b] text-[13px]">Multi-Node Human Thermoregulation</p>
            <p className="text-[12px] leading-[1.5] text-[#688577] font-normal">
              Simulates heat exchange across clothing layers, skin blood flow, and core temperature regulation under solar exposure.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Thermal Stress Simulator */}
      <div className="bg-white p-6 rounded-2xl border border-[#dfebe1] shadow-card">
        <div className="flex items-center justify-between mb-4 border-b border-[#edf4ee] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#eaf4ec] text-[#236c43] flex items-center justify-center">
              <Sliders className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-display text-[17px] font-semibold text-[#143d2b]">Interactive Thermal Stress Simulator</h3>
              <p className="text-[13px] text-[#597669] font-normal">Adjust climate parameters to observe non-linear human heat stress shifts</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSimTemp(39);
              setSimHumidity(62);
              setSimWind(8);
              setSimSolar('Very High');
              runSimulation(39, 62, 8, 'Very High');
            }}
            className="text-[13px] font-semibold text-[#236c43] hover:underline cursor-pointer"
          >
            Reset to Pune Baseline
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-[13px]">
          {/* Slider 1: Temperature */}
          <div className="space-y-2">
            <div className="flex justify-between text-[13px] font-medium">
              <span className="flex items-center gap-1.5 text-[#466555]">
                <Thermometer className="w-4 h-4 text-[#ea580c]" /> Temperature
              </span>
              <span className="text-[#143d2b] font-semibold">{simTemp}°C</span>
            </div>
            <input
              type="range"
              min="26"
              max="48"
              step="0.5"
              value={simTemp}
              onChange={e => handleSliderChange('temp', e.target.value)}
              className="w-full accent-[#236c43] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#718d7f]">
              <span>26°C</span>
              <span>38°C</span>
              <span>48°C</span>
            </div>
          </div>

          {/* Slider 2: Humidity */}
          <div className="space-y-2">
            <div className="flex justify-between text-[13px] font-medium">
              <span className="flex items-center gap-1.5 text-[#466555]">
                <Droplets className="w-4 h-4 text-[#0284c7]" /> Humidity
              </span>
              <span className="text-[#143d2b] font-semibold">{simHumidity}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="95"
              step="1"
              value={simHumidity}
              onChange={e => handleSliderChange('hum', e.target.value)}
              className="w-full accent-[#236c43] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#718d7f]">
              <span>15% (Dry)</span>
              <span>55%</span>
              <span>95% (Humid)</span>
            </div>
          </div>

          {/* Slider 3: Wind Speed */}
          <div className="space-y-2">
            <div className="flex justify-between text-[13px] font-medium">
              <span className="flex items-center gap-1.5 text-[#466555]">
                <Wind className="w-4 h-4 text-[#059669]" /> Wind Speed
              </span>
              <span className="text-[#143d2b] font-semibold">{simWind} km/h</span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="0.5"
              value={simWind}
              onChange={e => handleSliderChange('wind', e.target.value)}
              className="w-full accent-[#236c43] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#718d7f]">
              <span>1 km/h (Still)</span>
              <span>15 km/h</span>
              <span>35 km/h</span>
            </div>
          </div>

          {/* Selector 4: Solar Radiation */}
          <div className="space-y-2">
            <div className="flex justify-between text-[13px] font-medium">
              <span className="flex items-center gap-1.5 text-[#466555]">
                <Sun className="w-4 h-4 text-[#eab308]" /> Solar Flux
              </span>
              <span className="text-[#143d2b] font-semibold">{simSolar}</span>
            </div>
            <select
              value={simSolar}
              onChange={e => handleSliderChange('solar', e.target.value)}
              className="w-full bg-[#f8faf8] border border-[#d6e3d9] rounded-xl p-2 text-[13px] font-medium text-[#143d2b] focus:outline-none focus:border-[#236c43]"
            >
              <option value="Low">Low (200 W/m² - Overcast)</option>
              <option value="Moderate">Moderate (500 W/m² - Partial Sun)</option>
              <option value="High">High (750 W/m² - Clear Sky)</option>
              <option value="Very High">Very High (900 W/m² - Direct Noon)</option>
              <option value="Extreme">Extreme (1100 W/m² - Peak Radiation)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Physiological Symptom Matrix & Occupational Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#dfebe1] shadow-card space-y-3.5">
          <h3 className="font-display text-[16px] font-semibold text-[#143d2b] flex items-center gap-2">
            <Heart className="w-4.5 h-4.5 text-[#dc2626]" /> Physiological Strain & Health Risk Tiers
          </h3>
          <div className="space-y-2.5 text-[13px]">
            <div className="p-3 rounded-xl bg-[#e8f5e9] border border-[#c8e6c9] flex justify-between items-center">
              <div>
                <b className="text-[#2e7d32] font-semibold text-[13px]">Low Thermal Strain (&lt;27°C)</b>
                <p className="text-[12px] text-[#4d705c] mt-0.5">Normal cardiovascular thermoregulation and evaporative stability.</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#fef9c3] border border-[#fde047] flex justify-between items-center">
              <div>
                <b className="text-[#a16207] font-semibold text-[13px]">Caution / Moderate (27°C – 32°C)</b>
                <p className="text-[12px] text-[#716023] mt-0.5">Early fatigue, dehydration risk under prolonged physical exertion.</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#ffedd5] border border-[#fdba74] flex justify-between items-center">
              <div>
                <b className="text-[#c2410c] font-semibold text-[13px]">High Risk (32°C – 41°C)</b>
                <p className="text-[12px] text-[#854519] mt-0.5">Heat cramps, potential heat exhaustion. Sweating efficiency drops ~40%.</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#fee2e2] border border-[#fca5a5] flex justify-between items-center">
              <div>
                <b className="text-[#dc2626] font-semibold text-[13px]">Very High / Extreme (&gt;41°C)</b>
                <p className="text-[12px] text-[#8e2525] mt-0.5">Severe risk of Heatstroke, core body temperature &gt;40°C, hospitalization risk.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Occupational Work/Rest Guidance */}
        <div className="bg-white p-5 rounded-2xl border border-[#dfebe1] shadow-card space-y-3.5">
          <h3 className="font-display text-[16px] font-semibold text-[#143d2b] flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-[#236c43]" /> Occupational Work/Rest Schedule (ISO 7243)
          </h3>
          <div className="space-y-2.5 text-[13px]">
            <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#e5efe8]">
              <div className="flex justify-between font-semibold text-[#143d2b]">
                <span>WBGT 28.0°C – 29.9°C (Moderate)</span>
                <span className="text-[#236c43]">75% Work / 25% Rest</span>
              </div>
              <p className="text-[12px] text-[#607d6f] mt-0.5">Ensure 0.5L water intake per hour in shaded rest areas.</p>
            </div>
            <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#e5efe8]">
              <div className="flex justify-between font-semibold text-[#143d2b]">
                <span>WBGT 30.0°C – 31.4°C (High)</span>
                <span className="text-[#ea580c]">50% Work / 50% Rest</span>
              </div>
              <p className="text-[12px] text-[#607d6f] mt-0.5">Mandatory continuous supervisor monitoring for construction & delivery workers.</p>
            </div>
            <div className="p-3 bg-[#fff5f5] rounded-xl border border-[#fed7d7]">
              <div className="flex justify-between font-semibold text-[#b91c1c]">
                <span>WBGT &gt;31.5°C (Very High / Extreme)</span>
                <span className="text-[#dc2626]">25% Work / 75% Rest or Suspend</span>
              </div>
              <p className="text-[12px] text-[#991b1b] mt-0.5">Halt all unshaded direct manual labor during 11:00 AM – 4:00 PM.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
