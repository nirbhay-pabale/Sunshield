import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polygon, 
  Polyline, 
  CircleMarker, 
  Marker, 
  Tooltip as LeafletTooltip, 
  Popup, 
  useMap,
  useMapEvents 
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp, MapLayer } from '../../context/AppContext';
import { 
  Layers, 
  Radio, 
  Compass, 
  Anchor, 
  Navigation, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  Flame, 
  Wind, 
  Thermometer, 
  Activity, 
  Crosshair, 
  MapPin, 
  Sparkles,
  Check,
  ChevronDown,
  X
} from 'lucide-react';

export type MapMode = 'satellite' | 'streets' | 'dark' | 'terrain';

interface IoTNode {
  id: string;
  name: string;
  type: 'aws' | 'anchor' | 'radar' | 'shelter' | 'vessel' | 'mobile_unit';
  lat: number;
  lon: number;
  temp: number;
  humidity: number;
  wind: number;
  aqi: number;
  status: 'active' | 'warning' | 'critical';
  heading?: number;
}

// 1. ISOLATED MAP CONTROLLER (Only flies when target region/zoom actually changes)
const MapController: React.FC<{
  targetLat: number;
  targetLon: number;
  targetZoom: number;
}> = ({ targetLat, targetLon, targetZoom }) => {
  const map = useMap();
  const prevTargetRef = useRef<{ lat: number; lon: number; zoom: number } | null>(null);

  useEffect(() => {
    const prev = prevTargetRef.current;
    if (!prev || prev.lat !== targetLat || prev.lon !== targetLon || prev.zoom !== targetZoom) {
      prevTargetRef.current = { lat: targetLat, lon: targetLon, zoom: targetZoom };
      map.flyTo([targetLat, targetLon], targetZoom, { duration: 1.2 });
    }
  }, [targetLat, targetLon, targetZoom, map]);

  return null;
};

// 2. ISOLATED COORDINATE HUD (Updates locally without triggering re-renders of the Map tree)
const TacticalCoordinatesHUD: React.FC<{
  mode: MapMode;
  nodesCount: number;
}> = ({ mode, nodesCount }) => {
  const [coords, setCoords] = useState<{ lat: number; lon: number }>({ lat: 18.5204, lon: 73.8567 });

  useMapEvents({
    mousemove(e) {
      setCoords({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });

  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-xl text-white text-[11px] font-mono border border-white/15 flex items-center gap-4 shadow-xl pointer-events-auto select-none">
      <div className="flex items-center gap-1.5">
        <Crosshair className="w-3.5 h-3.5 text-[#86efac]" />
        <span>LAT: <b className="text-[#86efac]">{coords.lat.toFixed(4)}°N</b></span>
        <span>LON: <b className="text-[#86efac]">{coords.lon.toFixed(4)}°E</b></span>
      </div>
      <div className="hidden sm:flex items-center gap-3 border-l border-white/20 pl-3">
        <span>ALT: <b>560m</b></span>
        <span>NODES: <b className="text-[#86efac]">{nodesCount} ACTIVE</b></span>
        <span>MODE: <b className="uppercase text-[#fde047]">{mode}</b></span>
      </div>
    </div>
  );
};

// 3. CREATE CUSTOM TACTICAL LEAFLET SVG ICONS
const createCustomIcon = (
  iconType: 'anchor' | 'vessel' | 'radar' | 'sensor' | 'shelter' | 'target',
  status: 'active' | 'warning' | 'critical',
  heading: number = 0
) => {
  const color = status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#10b981';

  let iconSvg = '';
  if (iconType === 'anchor') {
    iconSvg = `
      <div style="background-color: #0284c7; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.35);">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="5" r="3"></circle>
          <line x1="12" y1="22" x2="12" y2="8"></line>
          <path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>
        </svg>
      </div>
    `;
  } else if (iconType === 'vessel') {
    iconSvg = `
      <div style="transform: rotate(${heading}deg); background-color: #dc2626; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; box-shadow: 0 0 12px rgba(220,38,38,0.7);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff" stroke="#ffffff" stroke-width="1.5">
          <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
        </svg>
      </div>
    `;
  } else if (iconType === 'radar') {
    iconSvg = `
      <div style="background-color: #1b4d3e; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #86efac; box-shadow: 0 0 12px rgba(35,108,67,0.6);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86efac" stroke-width="2.2">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
          <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 8a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"></path>
        </svg>
      </div>
    `;
  } else if (iconType === 'shelter') {
    iconSvg = `
      <div style="background-color: #059669; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 3px 8px rgba(0,0,0,0.3);">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
    `;
  } else {
    iconSvg = `
      <div style="position: relative; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: ${color}; opacity: 0.4; animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <div style="position: relative; background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
    `;
  }

  return L.divIcon({
    html: iconSvg,
    className: 'tactical-custom-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  });
};

export const RealtimeRiskMap: React.FC<{
  onSelectZone?: (zoneId: string) => void;
  className?: string;
  height?: string;
}> = ({ onSelectZone, className = '', height = '620px' }) => {
  const { 
    zones, 
    selectedZoneId, 
    setSelectedZoneId, 
    mapLayer, 
    openZoneDrawer 
  } = useApp();

  const [mapMode, setMapMode] = useState<MapMode>('satellite');
  const [liveStreamActive, setLiveStreamActive] = useState<boolean>(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('pune');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // Layer & UI Popovers state
  const [showOverlaysDropdown, setShowOverlaysDropdown] = useState<boolean>(false);
  const [legendMinimized, setLegendMinimized] = useState<boolean>(false);
  const overlaysDropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Layer Visibility Toggles
  const [showZones, setShowZones] = useState<boolean>(true);
  const [showRadarSweep, setShowRadarSweep] = useState<boolean>(true);
  const [showIoTNodes, setShowIoTNodes] = useState<boolean>(true);
  const [showTrajectories, setShowTrajectories] = useState<boolean>(true);
  const [showShelters, setShowShelters] = useState<boolean>(true);

  // Region Center coordinates
  const regionCenters: Record<string, { lat: number; lon: number; zoom: number; name: string }> = useMemo(() => ({
    pune: { lat: 18.5204, lon: 73.8567, zoom: 12, name: 'Pune Metropolitan Core' },
    maharashtra: { lat: 18.9750, lon: 73.4000, zoom: 9, name: 'Maharashtra Regional Corridor' },
    shivajinagar: { lat: 18.5314, lon: 73.8446, zoom: 14, name: 'Shivajinagar Sector' },
    kothrud: { lat: 18.5074, lon: 73.8077, zoom: 14, name: 'Kothrud Sector' },
    hadapsar: { lat: 18.5089, lon: 73.9259, zoom: 14, name: 'Hadapsar Tech Corridor' },
  }), []);

  const currentView = regionCenters[selectedRegion] || regionCenters.pune;

  // Real-time Tactical Nodes
  const [nodes, setNodes] = useState<IoTNode[]>([
    {
      id: 'radar-cmd-01',
      name: 'IMD Doppler & Thermal Radar Command',
      type: 'radar',
      lat: 18.5385,
      lon: 73.8490,
      temp: 39.4,
      humidity: 58,
      wind: 9.2,
      aqi: 128,
      status: 'active',
      heading: 45
    },
    {
      id: 'coastal-anchor-01',
      name: 'JNPT / Coastal Command Terminal',
      type: 'anchor',
      lat: 18.9500,
      lon: 72.9500,
      temp: 34.2,
      humidity: 78,
      wind: 16.5,
      aqi: 95,
      status: 'active',
    },
    {
      id: 'coastal-anchor-02',
      name: 'Mumbai Marine Surveillance Station',
      type: 'anchor',
      lat: 18.9100,
      lon: 72.8200,
      temp: 33.8,
      humidity: 82,
      wind: 18.0,
      aqi: 88,
      status: 'active',
    },
    {
      id: 'vessel-rapid-01',
      name: 'Mobile Heat Distress Rapid Unit 01',
      type: 'vessel',
      lat: 18.5150,
      lon: 73.8350,
      temp: 40.8,
      humidity: 64,
      wind: 6.4,
      aqi: 142,
      status: 'critical',
      heading: 65
    },
    {
      id: 'aws-node-01',
      name: 'Shivajinagar IoT High-Density AWS',
      type: 'aws',
      lat: 18.5300,
      lon: 73.8400,
      temp: 39.8,
      humidity: 59,
      wind: 7.8,
      aqi: 135,
      status: 'warning',
    },
    {
      id: 'aws-node-02',
      name: 'Khadakwasla Microclimate Buoy',
      type: 'aws',
      lat: 18.4400,
      lon: 73.7650,
      temp: 36.2,
      humidity: 68,
      wind: 12.1,
      aqi: 64,
      status: 'active',
    },
    {
      id: 'aws-node-03',
      name: 'Hadapsar Industrial Sensor Mesh',
      type: 'aws',
      lat: 18.5020,
      lon: 73.9350,
      temp: 41.2,
      humidity: 52,
      wind: 5.5,
      aqi: 168,
      status: 'critical',
    },
    {
      id: 'shelter-01',
      name: 'PMC Central Misting Cooling Center',
      type: 'shelter',
      lat: 18.5180,
      lon: 73.8580,
      temp: 24.5,
      humidity: 50,
      wind: 4.0,
      aqi: 45,
      status: 'active',
    },
    {
      id: 'shelter-02',
      name: 'Sassoon Hospital Heatstroke Care Center',
      type: 'shelter',
      lat: 18.5260,
      lon: 73.8730,
      temp: 23.0,
      humidity: 48,
      wind: 3.5,
      aqi: 38,
      status: 'active',
    }
  ]);

  // Click outside to close overlays popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlaysDropdownRef.current && !overlaysDropdownRef.current.contains(event.target as Node)) {
        setShowOverlaysDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live Simulation Ticker
  useEffect(() => {
    if (!liveStreamActive) return;

    const interval = setInterval(() => {
      setNodes(prev => prev.map(n => {
        if (n.type === 'vessel') {
          return {
            ...n,
            temp: Number((n.temp + (Math.random() - 0.5) * 0.2).toFixed(1)),
            humidity: Math.min(95, Math.max(30, Math.round(n.humidity + (Math.random() - 0.5) * 1.5)))
          };
        }
        return {
          ...n,
          temp: Number((n.temp + (Math.random() - 0.5) * 0.15).toFixed(1)),
          humidity: Math.min(95, Math.max(30, Math.round(n.humidity + (Math.random() - 0.5) * 1)))
        };
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [liveStreamActive]);

  // Dynamic Tile Layer URL & Attribution
  const tileConfig = useMemo(() => {
    switch (mapMode) {
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
          labelsUrl: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
        };
      case 'dark':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &copy; OpenStreetMap',
          labelsUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
        };
      case 'terrain':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, USGS',
          labelsUrl: null
        };
      case 'streets':
      default:
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          labelsUrl: null
        };
    }
  }, [mapMode]);

  // Layer Color helper based on active data layer
  const getLayerColor = (z: typeof zones[0], layer: MapLayer) => {
    switch (layer) {
      case 'heat-risk':
        return z.risk.risk_level === 'Very High' ? '#ef4444' : (z.risk.risk_level === 'High' ? '#ea580c' : (z.risk.risk_level === 'Moderate' ? '#eab308' : '#10b981'));
      case 'temperature':
        return z.weather.temperature_c >= 40 ? '#991b1b' : (z.weather.temperature_c >= 38.5 ? '#ef4444' : (z.weather.temperature_c >= 37 ? '#ea580c' : '#eab308'));
      case 'population':
        return z.population > 400000 ? '#7c3aed' : (z.population > 300000 ? '#3b82f6' : '#06b6d4');
      case 'vulnerability':
        return z.vulnerable_pop_count > 70000 ? '#dc2626' : (z.vulnerable_pop_count > 40000 ? '#f97316' : '#10b981');
      case 'exposure':
        return z.dense_housing_pct > 60 ? '#b91c1c' : (z.dense_housing_pct > 45 ? '#f97316' : '#059669');
      case 'priority':
        return z.risk.priority_level === 'Critical' ? '#dc2626' : (z.risk.priority_level === 'High' ? '#ea580c' : '#eab308');
      default:
        return '#10b981';
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const activeOverlayCount = [showZones, showRadarSweep, showIoTNodes, showTrajectories, showShelters].filter(Boolean).length;

  return (
    <div 
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-[#dfebe1] shadow-card transition-all bg-[#0e1e17] select-none ${className}`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* 1. TOP SINGLE CLEAN COMMAND BAR (No Overlap with map) */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: Map Mode Selector & Overlays Dropdown Button */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-[#cbe0d2] pointer-events-auto">
          
          <button
            onClick={() => setMapMode('satellite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              mapMode === 'satellite' 
                ? 'bg-[#1b4d3e] text-white shadow-xs' 
                : 'text-[#2a4537] hover:bg-[#edf5ef]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#86efac]" />
            <span>🛰️ Satellite</span>
          </button>

          <button
            onClick={() => setMapMode('streets')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              mapMode === 'streets' 
                ? 'bg-[#1b4d3e] text-white shadow-xs' 
                : 'text-[#2a4537] hover:bg-[#edf5ef]'
            }`}
          >
            <span>🗺️ Streets</span>
          </button>

          <button
            onClick={() => setMapMode('dark')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold hidden sm:flex items-center gap-1.5 transition-all cursor-pointer ${
              mapMode === 'dark' 
                ? 'bg-[#143d2b] text-white shadow-xs' 
                : 'text-[#2a4537] hover:bg-[#edf5ef]'
            }`}
          >
            <span>🌑 Dark</span>
          </button>

          <button
            onClick={() => setMapMode('terrain')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold hidden md:flex items-center gap-1.5 transition-all cursor-pointer ${
              mapMode === 'terrain' 
                ? 'bg-[#1b4d3e] text-white shadow-xs' 
                : 'text-[#2a4537] hover:bg-[#edf5ef]'
            }`}
          >
            <span>⛰️ Topo</span>
          </button>

          {/* Active GIS Overlays Popover Button */}
          <div className="relative" ref={overlaysDropdownRef}>
            <button
              onClick={() => setShowOverlaysDropdown(!showOverlaysDropdown)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                showOverlaysDropdown
                  ? 'bg-[#eaf4ec] text-[#1b4d3e] border-[#a4d2b2]'
                  : 'bg-[#f4f8f5] text-[#2a4537] border-[#d5e5db] hover:bg-[#eaf4ec]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#236c43]" />
              <span>Overlays ({activeOverlayCount})</span>
              <ChevronDown className={`w-3 h-3 text-[#5f7e6f] transition-transform ${showOverlaysDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Overlays Popover Menu */}
            {showOverlaysDropdown && (
              <div className="absolute left-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-[#cbe0d2] p-3 space-y-2 text-xs font-bold text-[#143d2b] animate-in fade-in slide-in-from-top-2 z-50">
                <div className="flex items-center justify-between border-b border-[#edf4ee] pb-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#5c7a6b] tracking-wider">
                    Toggle GIS Overlays
                  </span>
                  <button 
                    onClick={() => setShowOverlaysDropdown(false)}
                    className="p-1 text-[#718f80] hover:text-[#143d2b] rounded-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <label className="flex items-center justify-between cursor-pointer hover:bg-[#edf5ef] px-2 py-1.5 rounded-lg select-none transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" />
                    <span>Ward Risk Polygons</span>
                  </span>
                  <input 
                    type="checkbox" 
                    checked={showZones} 
                    onChange={e => setShowZones(e.target.checked)} 
                    className="w-4 h-4 accent-[#1b4d3e] rounded" 
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:bg-[#edf5ef] px-2 py-1.5 rounded-lg select-none transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                    <span>Radar Surveillance Arc</span>
                  </span>
                  <input 
                    type="checkbox" 
                    checked={showRadarSweep} 
                    onChange={e => setShowRadarSweep(e.target.checked)} 
                    className="w-4 h-4 accent-[#1b4d3e] rounded" 
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:bg-[#edf5ef] px-2 py-1.5 rounded-lg select-none transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                    <span>IoT AWS Sensor Mesh</span>
                  </span>
                  <input 
                    type="checkbox" 
                    checked={showIoTNodes} 
                    onChange={e => setShowIoTNodes(e.target.checked)} 
                    className="w-4 h-4 accent-[#1b4d3e] rounded" 
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:bg-[#edf5ef] px-2 py-1.5 rounded-lg select-none transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                    <span>Trajectory Vectors</span>
                  </span>
                  <input 
                    type="checkbox" 
                    checked={showTrajectories} 
                    onChange={e => setShowTrajectories(e.target.checked)} 
                    className="w-4 h-4 accent-[#1b4d3e] rounded" 
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer hover:bg-[#edf5ef] px-2 py-1.5 rounded-lg select-none transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                    <span>Cooling Centers / Care</span>
                  </span>
                  <input 
                    type="checkbox" 
                    checked={showShelters} 
                    onChange={e => setShowShelters(e.target.checked)} 
                    className="w-4 h-4 accent-[#1b4d3e] rounded" 
                  />
                </label>
              </div>
            )}
          </div>

        </div>

        {/* Right: Real-time Live Stream Pill, Region Navigator & Fullscreen */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          {/* Live Telemetry Stream Indicator */}
          <button
            onClick={() => setLiveStreamActive(!liveStreamActive)}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-extrabold border shadow-lg backdrop-blur-md transition-all cursor-pointer ${
              liveStreamActive
                ? 'bg-[#143d2b]/95 text-[#86efac] border-[#86efac]/40'
                : 'bg-white/95 text-[#64748b] border-[#cbd5e1]'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${liveStreamActive ? 'bg-[#22c55e] animate-pulse' : 'bg-[#94a3b8]'}`} />
            <span>{liveStreamActive ? 'LIVE TELEMETRY' : 'PAUSED'}</span>
          </button>

          {/* Region Quick Zoom Dropdown */}
          <select
            value={selectedRegion}
            onChange={e => setSelectedRegion(e.target.value)}
            className="bg-white/95 backdrop-blur-md border border-[#cbe0d2] text-[#143d2b] rounded-full px-3 py-1.5 text-xs font-bold shadow-lg outline-none cursor-pointer"
          >
            <option value="pune">📍 Pune Core (10 Wards)</option>
            <option value="maharashtra">🌊 Maharashtra Corridor</option>
            <option value="shivajinagar">🏙️ Shivajinagar</option>
            <option value="kothrud">🌳 Kothrud</option>
            <option value="hadapsar">🏭 Hadapsar Sector</option>
          </select>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-white/95 backdrop-blur-md text-[#143d2b] hover:bg-white rounded-full border border-[#cbe0d2] shadow-lg transition-all cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* 2. LEAFLET MAP CONTAINER (Completely butter-smooth 60fps) */}
      <MapContainer
        center={[currentView.lat, currentView.lon]}
        zoom={currentView.zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <MapController 
          targetLat={currentView.lat} 
          targetLon={currentView.lon} 
          targetZoom={currentView.zoom} 
        />

        {/* Base Tile Layer */}
        <TileLayer
          url={tileConfig.url}
          attribution={tileConfig.attribution}
          maxZoom={19}
        />

        {/* Optional Labels Overlay for Satellite */}
        {tileConfig.labelsUrl && (
          <TileLayer
            url={tileConfig.labelsUrl}
            pane="overlayPane"
            opacity={0.85}
          />
        )}

        {/* A. TACTICAL RADAR SURVEILLANCE SWEEP CONE */}
        {showRadarSweep && (
          <Polygon
            positions={[
              [18.5385, 73.8490],
              [18.6200, 73.7400],
              [18.6700, 73.8500],
              [18.6300, 73.9600],
              [18.5385, 73.8490]
            ]}
            pathOptions={{
              fillColor: '#ea580c',
              fillOpacity: 0.22,
              color: '#ea580c',
              weight: 1.5,
              dashArray: '4, 6',
            }}
          >
            <LeafletTooltip direction="center" opacity={0.95}>
              <div className="text-xs font-bold text-[#143d2b]">
                📡 Doppler Thermal Radar Surveillance Cone (45km Radius)
              </div>
            </LeafletTooltip>
          </Polygon>
        )}

        {/* B. TACTICAL BOUNDARY ZONES & TRAJECTORIES */}
        {showTrajectories && (
          <>
            {/* Green Surveillance Grid */}
            <Polygon
              positions={[
                [18.5600, 73.7800],
                [18.6100, 73.8100],
                [18.5900, 73.8600],
                [18.5400, 73.8300]
              ]}
              pathOptions={{
                fillColor: '#10b981',
                fillOpacity: 0.18,
                color: '#10b981',
                weight: 2,
                dashArray: '6, 6',
              }}
            />

            {/* Red Threat Hotspot Zone */}
            <Polygon
              positions={[
                [18.5250, 73.8250],
                [18.5450, 73.8350],
                [18.5400, 73.8550],
                [18.5150, 73.8500],
                [18.5100, 73.8300]
              ]}
              pathOptions={{
                fillColor: '#ef4444',
                fillOpacity: 0.35,
                color: '#dc2626',
                weight: 2.5,
              }}
            />

            {/* Blue Maritime/Riverine Transit Corridor */}
            <Polygon
              positions={[
                [18.4700, 73.8700],
                [18.4900, 73.9100],
                [18.4400, 73.9400],
                [18.4200, 73.9000]
              ]}
              pathOptions={{
                fillColor: '#0284c7',
                fillOpacity: 0.18,
                color: '#0284c7',
                weight: 2,
                dashArray: '5, 5',
              }}
            />

            {/* Trajectory Vectors */}
            <Polyline
              positions={[
                [18.4600, 73.8100],
                [18.4900, 73.8250],
                [18.5150, 73.8350],
                [18.5385, 73.8490]
              ]}
              pathOptions={{
                color: '#f59e0b',
                weight: 2.5,
                dashArray: '6, 8',
              }}
            />
          </>
        )}

        {/* C. HYPER-LOCAL WARD RISK POLYGONS */}
        {showZones && zones.map(z => {
          const isSelected = z.id === selectedZoneId;
          const color = getLayerColor(z, mapLayer);

          return (
            <React.Fragment key={z.id}>
              {z.polygon_geojson && (
                <Polygon
                  positions={z.polygon_geojson.coordinates[0].map(coord => [coord[1], coord[0]])}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: isSelected ? 0.65 : (mapMode === 'satellite' ? 0.38 : 0.45),
                    color: isSelected ? '#ffffff' : color,
                    weight: isSelected ? 3.5 : 1.8,
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedZoneId(z.id);
                      if (onSelectZone) onSelectZone(z.id);
                      openZoneDrawer(z);
                    }
                  }}
                >
                  <LeafletTooltip direction="top" opacity={0.95}>
                    <div className="text-xs font-sans p-1">
                      <div className="font-extrabold text-sm text-[#143d2b] flex items-center justify-between gap-3">
                        <span>{z.name}</span>
                        <span className="px-2 py-0.5 rounded text-white text-[10px]" style={{ backgroundColor: color }}>
                          {z.risk.risk_level}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-[#4d6b5c] border-t border-[#edf4ee] pt-1.5">
                        <div>Temp: <b className="text-[#143d2b]">{z.weather.temperature_c}°C</b></div>
                        <div>Heat Index: <b className="text-[#ea580c]">{z.thermal_stress.heat_index_c}°C</b></div>
                        <div>WBGT: <b className="text-[#ea580c]">{z.thermal_stress.wbgt_c}°C</b></div>
                        <div>Vulnerable: <b className="text-[#143d2b]">{(z.vulnerable_pop_count / 1000).toFixed(0)}k</b></div>
                      </div>
                      <p className="text-[10px] text-[#236c43] font-bold mt-1">Click to inspect ward details →</p>
                    </div>
                  </LeafletTooltip>
                </Polygon>
              )}

              {/* Center Marker */}
              <CircleMarker
                center={[z.center_lat, z.center_lon]}
                radius={isSelected ? 10 : 7}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.95,
                  color: '#ffffff',
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedZoneId(z.id);
                    if (onSelectZone) onSelectZone(z.id);
                    openZoneDrawer(z);
                  }
                }}
              />
            </React.Fragment>
          );
        })}

        {/* D. LIVE TACTICAL NODES & SENSOR MARKERS */}
        {showIoTNodes && nodes.map(node => {
          const iconType = node.type === 'radar' 
            ? 'radar' 
            : (node.type === 'anchor' 
              ? 'anchor' 
              : (node.type === 'vessel' 
                ? 'vessel' 
                : (node.type === 'shelter' ? 'shelter' : 'sensor')));

          return (
            <Marker
              key={node.id}
              position={[node.lat, node.lon]}
              icon={createCustomIcon(iconType, node.status, node.heading)}
            >
              <Popup className="tactical-popup">
                <div className="p-1 space-y-2 min-w-[210px] text-xs font-sans">
                  <div className="border-b border-[#edf4ee] pb-1.5 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-[#143d2b] text-xs leading-tight">{node.name}</h4>
                      <span className="text-[10px] text-[#5c7a6b] uppercase font-bold tracking-wider">
                        {node.type.toUpperCase()} TELEMETRY NODE
                      </span>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${node.status === 'critical' ? 'bg-[#ef4444] animate-ping' : (node.status === 'warning' ? 'bg-[#f59e0b]' : 'bg-[#10b981]')}`} />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#3e5e4e]">
                    <div className="bg-[#f6faf7] p-1.5 rounded-lg">
                      <span className="text-[10px] text-[#718f80] block">Temp</span>
                      <b className="text-xs text-[#ea580c]">{node.temp}°C</b>
                    </div>
                    <div className="bg-[#f6faf7] p-1.5 rounded-lg">
                      <span className="text-[10px] text-[#718f80] block">Humidity</span>
                      <b className="text-xs text-[#1b4d3e]">{node.humidity}%</b>
                    </div>
                    <div className="bg-[#f6faf7] p-1.5 rounded-lg">
                      <span className="text-[10px] text-[#718f80] block">Wind Speed</span>
                      <b className="text-xs text-[#1b4d3e]">{node.wind} km/h</b>
                    </div>
                    <div className="bg-[#f6faf7] p-1.5 rounded-lg">
                      <span className="text-[10px] text-[#718f80] block">AQI Index</span>
                      <b className="text-xs text-[#143d2b]">{node.aqi}</b>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#718f80] flex items-center justify-between pt-1">
                    <span>GPS: {node.lat.toFixed(4)}, {node.lon.toFixed(4)}</span>
                    <span className="text-[#236c43] font-bold">Sync: 100%</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 3. ISOLATED COORDINATES HUD */}
        <TacticalCoordinatesHUD mode={mapMode} nodesCount={nodes.length} />

      </MapContainer>

      {/* 4. COLLAPSIBLE TACTICAL LEGEND (BOTTOM-RIGHT) */}
      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-auto">
        {legendMinimized ? (
          <button
            onClick={() => setLegendMinimized(false)}
            className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-[#cbe0d2] text-[11px] font-bold text-[#143d2b] flex items-center gap-1.5 hover:bg-white cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#236c43]" />
            <span>Show Legend</span>
          </button>
        ) : (
          <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-[#cbe0d2] text-xs max-w-xs animate-in fade-in">
            <div className="font-extrabold text-[#143d2b] text-[11px] mb-2 flex items-center justify-between border-b border-[#edf4ee] pb-1.5">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#236c43]" />
                <span className="uppercase tracking-wider">Tactical GIS Legend</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#236c43] bg-[#eaf4ec] px-1.5 py-0.5 rounded font-bold capitalize">
                  {mapLayer}
                </span>
                <button
                  onClick={() => setLegendMinimized(true)}
                  className="text-[#718f80] hover:text-[#143d2b] p-0.5 rounded"
                  title="Minimize Legend"
                >
                  <Minimize2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Threat Level Scale */}
            <div className="grid grid-cols-5 gap-1 text-[10px] font-bold text-center mb-2.5">
              <div className="bg-[#10b981]/20 text-[#047857] py-0.5 rounded border border-[#10b981]/40">Low</div>
              <div className="bg-[#eab308]/20 text-[#b45309] py-0.5 rounded border border-[#eab308]/40">Mod</div>
              <div className="bg-[#ea580c]/20 text-[#c2410c] py-0.5 rounded border border-[#ea580c]/40">High</div>
              <div className="bg-[#ef4444]/20 text-[#b91c1c] py-0.5 rounded border border-[#ef4444]/40">V.High</div>
              <div className="bg-[#991b1b]/20 text-[#7f1d1d] py-0.5 rounded border border-[#991b1b]/40">Crit</div>
            </div>

            {/* Tactical Markers Info */}
            <div className="space-y-1 text-[10px] text-[#3a5849] font-semibold border-t border-[#edf4ee] pt-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] inline-block" />
                <span>⚓ Coastal & Terminal Command Ports</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] inline-block" />
                <span>🎯 Mobile Heat Distress Response Unit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1b4d3e] inline-block border border-[#86efac]" />
                <span>📡 Doppler Thermal Radar Station</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-1 bg-[#f59e0b] inline-block border-t border-dashed border-[#f59e0b]" />
                <span>-- Real-time Trajectory Vector Track</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
