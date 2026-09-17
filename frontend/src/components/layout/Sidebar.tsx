import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import { 
  Home, 
  Map, 
  Thermometer, 
  Calendar, 
  Users, 
  Bell, 
  FileText, 
  Database, 
  Settings,
  Leaf
} from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, notificationCount } = useApp();

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'risk-map', label: 'Risk Map', icon: Map },
    { id: 'thermal-stress', label: 'Thermal Stress', icon: Thermometer },
    { id: 'forecast', label: 'Forecast', icon: Calendar },
    { id: 'vulnerable-zones', label: 'Vulnerable Zones', icon: Users },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: notificationCount },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'data-sources', label: 'Data Sources', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#f4f7f4] border-r border-[#e0ece2] flex flex-col justify-between shrink-0 min-h-screen select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 pb-6 border-b border-[#e4efe6]">
          <div className="flex items-center gap-3">
            {/* Seamless Unbordered Logo */}
            <div className="w-11 h-11 flex items-center justify-center shrink-0">
              <img 
                src="/sunshield_logo.png" 
                alt="SUNSHIELD" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-display font-bold text-[24px] leading-[1.1] tracking-tight text-[#143d2b]">
                  SUNSHIELD
                </span>
              </div>
              <p className="font-sans text-[11px] font-normal leading-[1.4] text-[#5c7a6b] mt-0.5">
                Safer Today. Healthier Tomorrow.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] leading-[1.2] transition-all duration-150 text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#d8edd9] text-[#143d2b] font-semibold shadow-xs'
                    : 'text-[#4d6a5d] font-medium hover:bg-[#e6f2e8] hover:text-[#1b4d3e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#1b4d3e]' : 'text-[#6b8c7e]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ef4444] text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Branding Slogan */}
      <div className="p-5 border-t border-[#e4efe6]">
        <div className="flex items-start gap-2.5 text-[#527464]">
          <Leaf className="w-5 h-5 text-[#95c5a4] shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight font-medium">
            <p className="text-[#325243] font-semibold">Cleaner Air.</p>
            <p className="text-[#325243] font-semibold">Safer Cities.</p>
            <p className="text-[#236c43] font-bold">Healthier Communities.</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
