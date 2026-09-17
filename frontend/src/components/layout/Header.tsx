import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  MapPin, 
  Sun, 
  Bell, 
  ChevronDown, 
  User, 
  Check, 
  Flame, 
  AlertCircle,
  Clock,
  Sparkles,
  LogOut
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    selectedZoneId, 
    setSelectedZoneId, 
    zones, 
    overviewData, 
    activeAlerts, 
    setActiveTab, 
    openZoneDrawer,
    userRole,
    setUserRole,
    heatwaveSimulated,
    toggleHeatwaveSimulation,
    currentUser,
    logout
  } = useApp();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationDropdown, setLocationDropdown] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setSearchOpen(false);
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) setLocationDropdown(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredZones = zones.filter(z => 
    z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    z.zone_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  return (
    <header className="h-16 bg-[#f4f7f4] border-b border-[#e1ebe2] px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Search Bar with Autocomplete */}
      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#668677] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search city, area or location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            className="w-full bg-white/90 border border-[#d6e3d9] hover:border-[#b8d1bf] focus:border-[#236c43] focus:bg-white focus:outline-none rounded-full pl-9 pr-4 py-2 text-[13px] text-[#143d2b] placeholder-[#799487] shadow-2xs transition-all font-sans font-normal"
          />
        </div>

        {/* Autocomplete Dropdown */}
        {searchOpen && (
          <div className="absolute top-full mt-1.5 left-0 w-full bg-white rounded-xl shadow-lg border border-[#dbe6de] py-2 z-50 max-h-64 overflow-y-auto font-sans">
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#718d7f]">
              Pune Metropolitan Wards
            </div>
            {filteredZones.map(zone => (
              <button
                key={zone.id}
                onClick={() => {
                  setSelectedZoneId(zone.id);
                  setSearchQuery('');
                  setSearchOpen(false);
                }}
                className={`w-full px-3.5 py-2 text-left text-[13px] flex items-center justify-between hover:bg-[#edf5ef] transition-colors cursor-pointer ${
                  zone.id === selectedZoneId ? 'bg-[#e4f0e6] font-semibold text-[#143d2b]' : 'text-[#314f40] font-normal'
                }`}
              >
                <div>
                  <span className="font-semibold text-[#143d2b]">{zone.name}</span>
                  <span className="text-[12px] text-[#6d8a7c] ml-1.5 font-normal">({zone.zone_type})</span>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                  zone.risk.risk_level === 'High' || zone.risk.risk_level === 'Very High' 
                    ? 'bg-[#fee2e2] text-[#dc2626]' 
                    : 'bg-[#e8f5e9] text-[#2e7d32]'
                }`}>
                  {zone.risk.overall_risk_score}/100
                </span>
              </button>
            ))}
            {filteredZones.length === 0 && (
              <div className="px-3.5 py-3 text-[13px] text-[#718d7f] text-center font-normal">
                No matching location found. Try "Hadapsar", "Kharadi" or "Wakad".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5 shrink-0 font-sans">
        {/* Heatwave Simulation Toggle */}
        <button
          onClick={toggleHeatwaveSimulation}
          title="Toggle extreme heatwave surge scenario across Pune"
          className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
            heatwaveSimulated
              ? 'bg-[#fee2e2] border-[#f87171] text-[#b91c1c] shadow-xs animate-pulse'
              : 'bg-white border-[#d2e2d6] text-[#4d6b5e] hover:bg-[#edf5ef]'
          }`}
        >
          <Flame className={`w-3.5 h-3.5 ${heatwaveSimulated ? 'text-[#dc2626]' : 'text-[#eab308]'}`} />
          <span>{heatwaveSimulated ? 'Heat Surge Active (+3°C)' : 'Simulate Heat Surge'}</span>
        </button>

        {/* Location Dropdown Selector */}
        <div className="relative" ref={locationRef}>
          <button
            onClick={() => setLocationDropdown(!locationDropdown)}
            className="bg-white/95 border border-[#d2e2d6] hover:border-[#aed0b7] rounded-full px-3.5 py-1.5 flex items-center gap-2 text-[13px] font-semibold text-[#143d2b] shadow-2xs transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#236c43]" />
            <span>{selectedZone ? `${selectedZone.name}, Pune` : 'Pune, Maharashtra'}</span>
            <ChevronDown className="w-3 h-3 text-[#668677]" />
          </button>

          {locationDropdown && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-lg border border-[#dbe6de] py-2 z-50">
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#718d7f]">
                Select Active Ward
              </div>
              {zones.map(z => (
                <button
                  key={z.id}
                  onClick={() => {
                    setSelectedZoneId(z.id);
                    setLocationDropdown(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-[13px] flex items-center justify-between hover:bg-[#edf5ef] transition-colors cursor-pointer ${
                    z.id === selectedZoneId ? 'bg-[#e4f0e6] font-semibold text-[#143d2b]' : 'text-[#314f40] font-normal'
                  }`}
                >
                  <span>{z.name}</span>
                  {z.id === selectedZoneId && <Check className="w-3.5 h-3.5 text-[#236c43]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Weather Widget */}
        <div className="hidden sm:flex items-center gap-2 bg-white/95 border border-[#d2e2d6] rounded-full px-3.5 py-1.5 text-[13px] text-[#143d2b] shadow-2xs">
          <Sun className="w-4 h-4 text-[#eab308]" />
          <span className="font-bold">{overviewData.current_weather.temperature_c}°C</span>
          <span className="text-[#658273] font-normal">Sunny</span>
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-8 h-8 rounded-full bg-white/95 border border-[#d2e2d6] hover:bg-[#eaf4ec] text-[#3e5e4f] flex items-center justify-center relative shadow-2xs transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ef4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#f4f7f4]">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-[#dbe6de] py-2 z-50">
              <div className="px-4 py-2 border-b border-[#e5efe8] flex items-center justify-between">
                <span className="text-xs font-bold text-[#143d2b]">Active Heat Alerts</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#dc2626] font-bold">
                  {activeAlerts.length} Active
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#edf4ee]">
                {activeAlerts.map(alert => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      setSelectedZoneId(alert.zone_id);
                      setNotificationsOpen(false);
                      setActiveTab('alerts');
                    }}
                    className="p-3 hover:bg-[#f7faf8] cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-[#ea580c] shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#143d2b] truncate">{alert.title}</p>
                        <p className="text-[11px] text-[#597669] line-clamp-1">{alert.description}</p>
                        <span className="text-[10px] text-[#819e90] mt-1 block flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {alert.time_str} • {alert.zone_name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-[#e5efe8] bg-[#f9fbf9] text-center">
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    setActiveTab('alerts');
                  }}
                  className="text-xs font-semibold text-[#236c43] hover:underline"
                >
                  View All Active Alerts →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdown(!profileDropdown)}
            className="flex items-center gap-2 bg-white/95 border border-[#d2e2d6] hover:border-[#aed0b7] rounded-full pl-1.5 pr-3 py-1 shadow-2xs transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-[#1b4d3e] text-white flex items-center justify-center text-xs font-bold uppercase">
              {currentUser?.name ? currentUser.name.charAt(0) : <User className="w-3.5 h-3.5" />}
            </div>
            <span className="text-xs font-bold text-[#143d2b] max-w-[130px] truncate">
              {currentUser?.name || 'Authorized Officer'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#668677]" />
          </button>

          {profileDropdown && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-[#dbe6de] py-2 z-50 animate-in fade-in">
              <div className="px-3.5 py-2.5 border-b border-[#e5efe8]">
                <p className="text-xs font-bold text-[#143d2b] truncate">{currentUser?.name || 'HeatShield Officer'}</p>
                <p className="text-[11px] text-[#5c7a6b] truncate">{currentUser?.email || 'officer@sahayya.ai'}</p>
                <div className="mt-1.5 flex items-center justify-between text-[10px] bg-[#eaf4ec] text-[#236c43] px-2.5 py-1 rounded-lg font-bold">
                  <span>Role: {userRole}</span>
                </div>
              </div>
              <div className="p-1">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#718f80] tracking-wider">
                  Switch Operational Role
                </div>
                <button
                  onClick={() => {
                    setUserRole('Disaster Management Officer');
                    setProfileDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    userRole === 'Disaster Management Officer' ? 'text-[#1b4d3e] bg-[#edf5ef] font-bold' : 'text-[#2a4537] hover:bg-[#edf5ef]'
                  }`}
                >
                  Disaster Management Officer
                </button>
                <button
                  onClick={() => {
                    setUserRole('Municipal Ward Officer');
                    setProfileDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    userRole === 'Municipal Ward Officer' ? 'text-[#1b4d3e] bg-[#edf5ef] font-bold' : 'text-[#2a4537] hover:bg-[#edf5ef]'
                  }`}
                >
                  Municipal Ward Officer
                </button>
                <button
                  onClick={() => {
                    setUserRole('Citizen Observer');
                    setProfileDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    userRole === 'Citizen Observer' ? 'text-[#1b4d3e] bg-[#edf5ef] font-bold' : 'text-[#2a4537] hover:bg-[#edf5ef]'
                  }`}
                >
                  Citizen Observer
                </button>
              </div>

              <div className="border-t border-[#e5efe8] p-1">
                <button
                  onClick={() => {
                    setProfileDropdown(false);
                    setActiveTab('settings');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#236c43] font-semibold hover:bg-[#edf5ef] rounded-lg"
                >
                  Platform Settings & Thresholds
                </button>
                <button
                  onClick={() => {
                    setProfileDropdown(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#dc2626] font-bold hover:bg-[#fee2e2] rounded-lg flex items-center gap-2 mt-0.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
