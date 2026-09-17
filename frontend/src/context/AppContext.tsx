import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OverviewData, ZoneSummary, AlertItem, RiskLevel, User, RegisterPayload } from '../types';
import { apiService, fallbackOverviewData } from '../services/api';

export type NavTab = 
  | 'overview' 
  | 'risk-map' 
  | 'thermal-stress' 
  | 'forecast' 
  | 'vulnerable-zones' 
  | 'alerts' 
  | 'reports' 
  | 'data-sources' 
  | 'settings';

export type MapLayer = 'heat-risk' | 'temperature' | 'population' | 'vulnerability' | 'exposure' | 'priority';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedZoneId: string;
  setSelectedZoneId: (id: string) => void;
  overviewData: OverviewData;
  zones: ZoneSummary[];
  mapLayer: MapLayer;
  setMapLayer: (layer: MapLayer) => void;
  selectedZoneDetail: ZoneSummary | null;
  isDrawerOpen: boolean;
  openZoneDrawer: (zone: ZoneSummary | string) => void;
  closeZoneDrawer: () => void;
  notificationCount: number;
  activeAlerts: AlertItem[];
  acknowledgeAlert: (alertId: string) => Promise<void>;
  heatwaveSimulated: boolean;
  toggleHeatwaveSimulation: () => Promise<void>;
  userRole: string;
  setUserRole: (role: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  activePeriod: string;
  setActivePeriod: (p: string) => void;
  // Authentication & Session
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterPayload) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('central-pune');
  const [overviewData, setOverviewData] = useState<OverviewData>(fallbackOverviewData);
  const [zones, setZones] = useState<ZoneSummary[]>(fallbackOverviewData.zones_summary);
  const [mapLayer, setMapLayer] = useState<MapLayer>('heat-risk');
  const [selectedZoneDetail, setSelectedZoneDetail] = useState<ZoneSummary | null>(fallbackOverviewData.zones_summary[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeAlerts, setActiveAlerts] = useState<AlertItem[]>(fallbackOverviewData.active_alerts);
  const [heatwaveSimulated, setHeatwaveSimulated] = useState<boolean>(false);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('sahayya_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('sahayya_token') || !!localStorage.getItem('sahayya_user');
  });
  
  const [userRole, setUserRole] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('sahayya_user');
      if (saved) {
        const u = JSON.parse(saved);
        return u.role || 'Disaster Management Officer';
      }
    } catch {}
    return 'Disaster Management Officer';
  });

  const [selectedCity, setSelectedCity] = useState<string>('Pune, Maharashtra');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activePeriod, setActivePeriod] = useState<string>('24 Apr 2025');

  const login = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      const res = await apiService.login({ email, password, remember_me: rememberMe });
      if (res && res.user) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        setUserRole(res.user.role || 'Disaster Management Officer');
        if (rememberMe) {
          localStorage.setItem('sahayya_user', JSON.stringify(res.user));
          localStorage.setItem('sahayya_token', res.token || 'demo_token');
        }
        return { success: true, message: res.message };
      }
      return { success: false, message: 'Invalid server response' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed. Please check your credentials.' };
    }
  };

  const register = async (data: RegisterPayload) => {
    try {
      const res = await apiService.register(data);
      if (res && res.user) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        setUserRole(res.user.role || 'Disaster Management Officer');
        localStorage.setItem('sahayya_user', JSON.stringify(res.user));
        localStorage.setItem('sahayya_token', res.token || 'demo_token');
        return { success: true, message: res.message };
      }
      return { success: false, message: 'Registration could not be completed.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration failed.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('sahayya_user');
    localStorage.removeItem('sahayya_token');
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await apiService.forgotPassword(email);
      return { success: true, message: res.message || 'Reset link sent successfully.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error requesting reset link.' };
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getOverview(selectedZoneId);
      setOverviewData(data);
      if (data.zones_summary && data.zones_summary.length > 0) {
        setZones(data.zones_summary);
        const match = data.zones_summary.find(z => z.id === selectedZoneId) || data.zones_summary[0];
        setSelectedZoneDetail(match);
      }
      if (data.active_alerts) {
        setActiveAlerts(data.active_alerts);
      }
    } catch (e) {
      console.error('Error refreshing data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [selectedZoneId]);

  const openZoneDrawer = (zone: ZoneSummary | string) => {
    if (typeof zone === 'string') {
      const found = zones.find(z => z.id === zone) || zones[0];
      setSelectedZoneDetail(found);
      setSelectedZoneId(found.id);
    } else {
      setSelectedZoneDetail(zone);
      setSelectedZoneId(zone.id);
    }
    setIsDrawerOpen(true);
  };

  const closeZoneDrawer = () => {
    setIsDrawerOpen(false);
  };

  const acknowledgeAlert = async (alertId: string) => {
    await apiService.acknowledgeAlert(alertId);
    setActiveAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const toggleHeatwaveSimulation = async () => {
    const nextState = !heatwaveSimulated;
    setHeatwaveSimulated(nextState);
    await apiService.simulateHeatwave(nextState);
    await refreshData();
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedZoneId,
        setSelectedZoneId,
        overviewData,
        zones,
        mapLayer,
        setMapLayer,
        selectedZoneDetail,
        isDrawerOpen,
        openZoneDrawer,
        closeZoneDrawer,
        notificationCount: activeAlerts.length,
        activeAlerts,
        acknowledgeAlert,
        heatwaveSimulated,
        toggleHeatwaveSimulation,
        userRole,
        setUserRole,
        searchQuery,
        setSearchQuery,
        isLoading,
        refreshData,
        activePeriod,
        setActivePeriod,
        currentUser,
        isAuthenticated,
        login,
        register,
        logout,
        forgotPassword,
        selectedCity,
        setSelectedCity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
