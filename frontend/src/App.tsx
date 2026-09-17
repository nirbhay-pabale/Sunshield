import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HeroBanner } from './components/layout/HeroBanner';
import { ZoneDetailDrawer } from './components/common/ZoneDetailDrawer';

import { OverviewPage } from './pages/OverviewPage';
import { RiskMapPage } from './pages/RiskMapPage';
import { ThermalStressPage } from './pages/ThermalStressPage';
import { ForecastPage } from './pages/ForecastPage';
import { VulnerableZonesPage } from './pages/VulnerableZonesPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

const MainContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'risk-map':
        return <RiskMapPage />;
      case 'thermal-stress':
        return <ThermalStressPage />;
      case 'forecast':
        return <ForecastPage />;
      case 'vulnerable-zones':
        return <VulnerableZonesPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'data-sources':
        return <DataSourcesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7f4]">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header />

        {/* Scrollable Page Body */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto overflow-y-auto">
          {/* Hero Banner (Always visible on Overview, or top of pages) */}
          <HeroBanner />

          {/* Dynamic Active Page */}
          {renderActivePage()}
        </main>
      </div>

      {/* Floating Zone Detail Drawer */}
      <ZoneDetailDrawer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
