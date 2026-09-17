import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  Users, 
  MapPin, 
  ShieldAlert, 
  ArrowUpDown, 
  CheckCircle, 
  Scale, 
  TreePine, 
  Home, 
  Briefcase 
} from 'lucide-react';

export const VulnerableZonesPage: React.FC = () => {
  const { zones, openZoneDrawer, setSelectedZoneId } = useApp();

  const [sortBy, setSortBy] = useState<'risk' | 'vulnerable' | 'density' | 'green'>('risk');
  const [compareZoneA, setCompareZoneA] = useState<string>(zones[0]?.id || 'central-pune');
  const [compareZoneB, setCompareZoneB] = useState<string>(zones[1]?.id || 'hadapsar');

  const sortedZones = [...zones].sort((a, b) => {
    if (sortBy === 'risk') return b.risk.overall_risk_score - a.risk.overall_risk_score;
    if (sortBy === 'vulnerable') return b.vulnerable_pop_count - a.vulnerable_pop_count;
    if (sortBy === 'density') return b.dense_housing_pct - a.dense_housing_pct;
    if (sortBy === 'green') return a.green_cover_pct - b.green_cover_pct;
    return 0;
  });

  const zoneA = zones.find(z => z.id === compareZoneA) || zones[0];
  const zoneB = zones.find(z => z.id === compareZoneB) || zones[1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#dfebe1] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[26px] sm:text-[30px] font-semibold text-[#143d2b] flex items-center gap-2.5 tracking-[-0.02em] leading-[1.15]">
            <Users className="w-6 h-6 text-[#236c43]" /> Vulnerable Populations & Priority Zones
          </h2>
          <p className="text-[14px] text-[#597669] mt-1 font-normal leading-[1.5]">
            Identifying demographic exposure, dense informal settlements, and low green cover overlap
          </p>
        </div>

        <div className="text-[13px] bg-[#f4f8f4] border border-[#dce8df] px-4 py-1.5 rounded-full text-[#143d2b] font-medium">
          Environmental Risk + Population Vulnerability + Exposure = <b className="font-semibold">Priority Zone</b>
        </div>
      </div>

      {/* Priority Ranking Table */}
      <div className="bg-white p-5 rounded-2xl border border-[#dfebe1] shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-display text-[17px] font-semibold text-[#143d2b]">Pune Metropolitan Ward Vulnerability Matrix</h3>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-[#658576] font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-[#f6faf7] border border-[#d8e6dc] rounded-lg px-3 py-1.5 text-[13px] font-medium text-[#143d2b] focus:outline-none cursor-pointer"
            >
              <option value="risk">Overall Risk Score</option>
              <option value="vulnerable">Vulnerable Population Count</option>
              <option value="density">Dense Housing %</option>
              <option value="green">Tree Canopy (Low to High)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e5efe8] text-[12px] text-[#698879] uppercase font-semibold tracking-wider bg-[#f8faf8]">
                <th className="p-3">Zone / Ward</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Vulnerable Population</th>
                <th className="p-3">Informal Density</th>
                <th className="p-3">Green Cover</th>
                <th className="p-3">Heat Index</th>
                <th className="p-3 text-right">Priority Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf4ee]">
              {sortedZones.map((z, idx) => (
                <tr
                  key={z.id}
                  onClick={() => {
                    setSelectedZoneId(z.id);
                    openZoneDrawer(z);
                  }}
                  className="hover:bg-[#f7faf8] cursor-pointer transition-colors"
                >
                  <td className="p-3.5 font-semibold text-[#143d2b]">
                    <span className="inline-block w-5 text-[#819f91]">{idx + 1}.</span> {z.name}
                    <span className="text-[11px] text-[#6c8c7d] block font-normal">{z.zone_type}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-[15px] text-[#143d2b]">{z.risk.overall_risk_score}</span>
                    <span className="text-[11px] text-[#719082]">/100</span>
                    <span className="ml-2.5"><RiskBadge level={z.risk.risk_level} size="sm" /></span>
                  </td>
                  <td className="p-3.5 font-medium text-[#143d2b]">
                    {(z.vulnerable_pop_count / 1000).toFixed(0)}k ({((z.vulnerable_pop_count / z.population) * 100).toFixed(0)}%)
                  </td>
                  <td className="p-3.5 text-[#507060]">
                    <div className="flex items-center gap-1.5">
                      <Home className="w-4 h-4 text-[#ea580c]" />
                      <span className="font-medium">{z.dense_housing_pct}%</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-[#507060]">
                    <div className="flex items-center gap-1.5">
                      <TreePine className="w-4 h-4 text-[#2e7d32]" />
                      <span className="font-medium">{z.green_cover_pct}%</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-[#ea580c]">
                    {z.thermal_stress.heat_index_c}°C
                  </td>
                  <td className="p-3.5 text-right">
                    <RiskBadge level={z.risk.priority_level} size="sm" showDot />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-Side Zone Comparison Tool */}
      <div className="bg-white p-5 rounded-2xl border border-[#dfebe1] shadow-card">
        <div className="flex items-center justify-between mb-4 border-b border-[#edf4ee] pb-3">
          <h3 className="font-display text-[17px] font-semibold text-[#143d2b] flex items-center gap-2">
            <Scale className="w-4.5 h-4.5 text-[#236c43]" /> Side-by-Side Zone Thermal Comparison Tool
          </h3>
          <span className="text-[12px] text-[#638374] font-normal">Select 2 wards to benchmark exposure</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[13px]">
          {/* Zone A */}
          <div className="p-4.5 rounded-xl bg-[#f8faf8] border border-[#e2ede5] space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[#236c43] uppercase tracking-wider">Ward A</span>
              <select
                value={compareZoneA}
                onChange={e => setCompareZoneA(e.target.value)}
                className="bg-white border border-[#cde0d3] rounded-lg px-3 py-1.5 text-[13px] font-semibold text-[#143d2b] focus:outline-none cursor-pointer"
              >
                {zones.map(z => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>

            <div className="text-center py-3 bg-white rounded-lg border border-[#e5efe8]">
              <span className="text-[12px] text-[#658375] font-medium">Overall Risk Score</span>
              <div className="text-[28px] font-bold text-[#ea580c] leading-tight my-1">{zoneA.risk.overall_risk_score}/100</div>
              <RiskBadge level={zoneA.risk.risk_level} size="sm" />
            </div>

            <div className="space-y-2 text-[13px] text-[#3b594a]">
              <div className="flex justify-between border-b border-[#edf4ee] pb-1.5">
                <span>Temperature:</span>
                <b className="text-[#143d2b] font-semibold">{zoneA.weather.temperature_c}°C</b>
              </div>
              <div className="flex justify-between border-b border-[#edf4ee] pb-1.5">
                <span>Heat Index:</span>
                <b className="text-[#ea580c] font-semibold">{zoneA.thermal_stress.heat_index_c}°C</b>
              </div>
              <div className="flex justify-between border-b border-[#edf4ee] pb-1.5">
                <span>WBGT Index:</span>
                <b className="text-[#ea580c] font-semibold">{zoneA.thermal_stress.wbgt_c}°C</b>
              </div>
              <div className="flex justify-between border-b border-[#edf4ee] pb-1.5">
                <span>Vulnerable Population:</span>
                <b className="text-[#143d2b] font-semibold">{(zoneA.vulnerable_pop_count / 1000).toFixed(0)}k</b>
              </div>
              <div className="flex justify-between">
                <span>Green Canopy:</span>
                <b className="text-[#2e7d32] font-semibold">{zoneA.green_cover_pct}%</b>
              </div>
            </div>
          </div>

          {/* Zone B */}
          <div className="p-4.5 rounded-xl bg-[#f8faf8] border border-[#e2ede5] space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[#236c43] uppercase tracking-wider">Ward B</span>
              <select
                value={compareZoneB}
                onChange={e => setCompareZoneB(e.target.value)}
                className="bg-white border border-[#cde0d3] rounded-lg px-3 py-1.5 text-[13px] font-semibold text-[#143d2b] focus:outline-none cursor-pointer"
              >
                {zones.map(z => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>

            <div className="text-center py-3 bg-white rounded-lg border border-[#e5efe8]">
              <span className="text-[12px] text-[#658375] font-medium">Overall Risk Score</span>
              <div className="text-[28px] font-bold text-[#ea580c] leading-tight my-1">{zoneB.risk.overall_risk_score}/100</div>
              <RiskBadge level={zoneB.risk.risk_level} size="sm" />
            </div>

            <div className="space-y-2 text-[13px] text-[#3b594a]">
              <div className="flex justify-between border-b border-[#edf4ee] pb-1.5">
                <span>Temperature:</span>
                <b className="text-[#143d2b] font-semibold">{zoneB.weather.temperature_c}°C</b>
              </div>
              <div className="flex justify-between border-b border-[#edf4ee] pb-1.5">
                <span>Heat Index:</span>
                <b className="text-[#ea580c] font-semibold">{zoneB.thermal_stress.heat_index_c}°C</b>
              </div>
              <div className="flex justify-between border-b border-[#edf4ee] pb-1.5">
                <span>WBGT Index:</span>
                <b className="text-[#ea580c] font-semibold">{zoneB.thermal_stress.wbgt_c}°C</b>
              </div>
              <div className="flex justify-between border-b border-[#edf4ee] pb-1.5">
                <span>Vulnerable Population:</span>
                <b className="text-[#143d2b] font-semibold">{(zoneB.vulnerable_pop_count / 1000).toFixed(0)}k</b>
              </div>
              <div className="flex justify-between">
                <span>Green Canopy:</span>
                <b className="text-[#2e7d32] font-semibold">{zoneB.green_cover_pct}%</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
