import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { apiService } from '../services/api';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  Smartphone, 
  Radio, 
  Clock, 
  ShieldCheck, 
  MapPin,
  Sparkles
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { activeAlerts, acknowledgeAlert, setSelectedZoneId, openZoneDrawer } = useApp();

  const [filter, setFilter] = useState<'Active' | 'Resolved' | 'Historical' | 'All'>('Active');
  const [broadcastStatus, setBroadcastStatus] = useState<string | null>(null);
  const [broadcasting, setBroadcasting] = useState<boolean>(false);

  // Filtered alert list
  const allAlerts = [
    ...activeAlerts,
    {
      id: "ALT-2025-0423-04",
      zone_id: "wakad",
      zone_name: "Wakad",
      title: "Evening Thermal Trapping Advisory — Wakad",
      severity: "Moderate" as const,
      category: "Urban Heat Island",
      time_str: "06:15 PM",
      date_str: "23 Apr 2025",
      status: "Resolved" as const,
      description: "Asphalt radiation sustained surface temperatures above 36°C past sunset. Convective cooling restored after 9 PM.",
      affected_population: "28,000 high-rise residential occupants",
      protocol: "Resolved: Ambient temperature dropped to 29°C with evening breeze."
    },
    {
      id: "ALT-2025-0422-05",
      zone_id: "kothrud",
      zone_name: "Kothrud",
      title: "Moderate Heat Stress — Kothrud",
      severity: "Moderate" as const,
      category: "Public Advisory",
      time_str: "11:30 AM",
      date_str: "22 Apr 2025",
      status: "Historical" as const,
      description: "Heat Index peaked at 39°C. Community hydration points served 4,200 citizens.",
      affected_population: "19,000 elderly residents",
      protocol: "Historical event logged for climate resilience benchmarking."
    }
  ];

  const displayedAlerts = allAlerts.filter(a => filter === 'All' || a.status === filter);

  const handleBroadcastSimulation = async (channel: string) => {
    setBroadcasting(true);
    try {
      const res = await apiService.testBroadcast(channel, 'central-pune');
      setBroadcastStatus(`Dispatched live test alert via ${channel}! Response 200 OK.`);
      setTimeout(() => setBroadcastStatus(null), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#dfebe1] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[26px] sm:text-[30px] font-semibold text-[#143d2b] flex items-center gap-2.5 tracking-[-0.02em] leading-[1.15]">
            <Bell className="w-6 h-6 text-[#ef4444]" /> Early Warning & Alert Management Center
          </h2>
          <p className="text-[14px] text-[#597669] mt-1 font-normal leading-[1.5]">
            Automated threshold triggers, incident lifecycle response, and multi-channel broadcast gateway
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#f0f6f2] p-1.5 rounded-full border border-[#dce8df]">
          {(['Active', 'Resolved', 'Historical', 'All'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`tab-pill text-[13px] font-medium ${filter === tab ? 'tab-pill-active font-semibold' : 'tab-pill-inactive'}`}
            >
              {tab} ({tab === 'Active' ? activeAlerts.length : (tab === 'All' ? allAlerts.length : (tab === 'Resolved' ? 1 : 1))})
            </button>
          ))}
        </div>
      </div>

      {/* Broadcast Notification Channels Architecture Box */}
      <div className="bg-white p-5 rounded-2xl border border-[#dfebe1] shadow-card">
        <div className="flex items-center justify-between mb-3.5 border-b border-[#edf4ee] pb-2.5">
          <h3 className="font-display text-[15px] font-semibold text-[#143d2b] flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#236c43]" /> Multi-Channel Broadcast Gateway (Architecture Ready)
          </h3>
          <span className="text-[12px] text-[#6b8c7d] font-normal">NDMA CAP v1.2 Compliant</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
          {/* Channel 1: Dashboard */}
          <div className="p-3.5 bg-[#f6faf7] border border-[#d8e6dc] rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#143d2b]">Live Dashboard</span>
                <span className="text-[11px] bg-[#e8f5ec] text-[#2e7d32] font-semibold px-2.5 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-[12px] text-[#557364] mt-1 leading-[1.4]">WebSocket real-time push to all municipal terminals.</p>
            </div>
          </div>

          {/* Channel 2: SMS */}
          <div className="p-3.5 bg-[#f8faf8] border border-[#e2ede5] rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#143d2b] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#236c43]" /> SMS Gateway
                </span>
                <span className="text-[11px] bg-[#fef9c3] text-[#a16207] font-semibold px-2 py-0.5 rounded-full">Integration Ready</span>
              </div>
              <p className="text-[12px] text-[#557364] mt-1 leading-[1.4]">Telecom cell broadcast to 240,000 outdoor subscribers.</p>
            </div>
            <button
              onClick={() => handleBroadcastSimulation('SMS Broadcast')}
              disabled={broadcasting}
              className="mt-2.5 text-[12px] py-1.5 bg-white border border-[#cbe0d1] text-[#236c43] font-semibold rounded-lg hover:bg-[#eef6f0] transition-colors cursor-pointer"
            >
              Test SMS Broadcast
            </button>
          </div>

          {/* Channel 3: WhatsApp */}
          <div className="p-3.5 bg-[#f8faf8] border border-[#e2ede5] rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#143d2b] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#25d366]" /> WhatsApp API
                </span>
                <span className="text-[11px] bg-[#fef9c3] text-[#a16207] font-semibold px-2 py-0.5 rounded-full">Integration Ready</span>
              </div>
              <p className="text-[12px] text-[#557364] mt-1 leading-[1.4]">Direct advisory delivery to ASHA community groups.</p>
            </div>
            <button
              onClick={() => handleBroadcastSimulation('WhatsApp Business API')}
              disabled={broadcasting}
              className="mt-2.5 text-[12px] py-1.5 bg-white border border-[#cbe0d1] text-[#236c43] font-semibold rounded-lg hover:bg-[#eef6f0] transition-colors cursor-pointer"
            >
              Test WhatsApp Push
            </button>
          </div>

          {/* Channel 4: Municipal CAP Feed */}
          <div className="p-3.5 bg-[#f8faf8] border border-[#e2ede5] rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#143d2b]">CAP Webhook</span>
                <span className="text-[11px] bg-[#fef9c3] text-[#a16207] font-semibold px-2 py-0.5 rounded-full">Integration Ready</span>
              </div>
              <p className="text-[12px] text-[#557364] mt-1 leading-[1.4]">Automated dispatch to PMC & Smart City Command Center.</p>
            </div>
            <button
              onClick={() => handleBroadcastSimulation('Municipal CAP Webhook')}
              disabled={broadcasting}
              className="mt-2.5 text-[12px] py-1.5 bg-white border border-[#cbe0d1] text-[#236c43] font-semibold rounded-lg hover:bg-[#eef6f0] transition-colors cursor-pointer"
            >
              Trigger Webhook Ping
            </button>
          </div>
        </div>

        {broadcastStatus && (
          <div className="mt-3.5 p-3 rounded-xl bg-[#eaf5ed] border border-[#bce0c8] text-[13px] font-semibold text-[#1b4d3e] flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />
            <span>{broadcastStatus}</span>
          </div>
        )}
      </div>

      {/* Alert Cards Feed */}
      <div className="space-y-4">
        {displayedAlerts.map(alert => (
          <div
            key={alert.id}
            className={`bg-white rounded-2xl border p-5 shadow-card transition-all ${
              alert.status === 'Active' 
                ? 'border-[#fca5a5] hover:border-[#f87171]' 
                : 'border-[#dfebe1] opacity-80'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
              <div className="flex items-start gap-3.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  alert.severity === 'High' ? 'bg-[#fee2e2] text-[#dc2626]' : 'bg-[#fef9c3] text-[#ca8a04]'
                }`}>
                  <AlertTriangle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[15px] font-semibold text-[#143d2b]">{alert.title}</h3>
                    <RiskBadge level={alert.severity} size="sm" />
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase ${
                      alert.status === 'Active' ? 'bg-[#ef4444] text-white' : 'bg-[#e5e7eb] text-gray-700'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#597669] mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#236c43]" /> {alert.zone_name}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {alert.time_str}, {alert.date_str}</span>
                    <span>•</span>
                    <span className="text-[#143d2b] font-medium">{alert.category}</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => openZoneDrawer(alert.zone_id)}
                  className="px-3.5 py-2 bg-[#f4f8f4] hover:bg-[#eaf4ec] text-[#1b4d3e] text-[13px] font-medium rounded-xl border border-[#cde0d3] transition-colors cursor-pointer"
                >
                  Inspect Zone
                </button>
                {alert.status === 'Active' && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-4 py-2 bg-[#1b4d3e] hover:bg-[#143d2b] text-white text-[13px] font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Acknowledge & Resolve
                  </button>
                )}
              </div>
            </div>

            <p className="text-[13px] sm:text-[14px] text-[#2c4739] leading-[1.55] mb-3 bg-[#fbfdfb] p-3.5 rounded-xl border border-[#edf4ee]">
              {alert.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px] border-t border-[#edf4ee] pt-3">
              <div>
                <span className="text-[#658375] font-medium">Affected Population:</span>
                <span className="ml-1.5 font-semibold text-[#143d2b]">{alert.affected_population}</span>
              </div>
              <div>
                <span className="text-[#658375] font-medium">Standard Protocol:</span>
                <span className="ml-1.5 font-semibold text-[#143d2b]">{alert.protocol}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
