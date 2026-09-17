import React from 'react';
import { useApp } from '../../context/AppContext';
import { Leaf, FileText, Sparkles } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { overviewData, setActiveTab, selectedZoneId } = useApp();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#eef6f0] via-[#f4f8f4] to-[#eaf3ec] rounded-2xl border border-[#dce8df] p-6 mb-6 shadow-xs">
      {/* Subtle Pune Skyline / Greenery SVG Graphic in Background */}
      <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none select-none max-w-xl">
        <svg viewBox="0 0 600 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Skyline and hills silhouette */}
          <path d="M0 120 L0 100 Q 50 70, 100 95 T 200 80 Q 250 60, 300 85 T 400 70 Q 450 40, 500 75 T 600 90 L 600 120 Z" fill="#236c43" />
          <path d="M50 120 L50 85 L65 85 L65 70 L80 70 L80 120 Z" fill="#143d2b" opacity="0.6"/>
          <path d="M120 120 L120 75 L140 75 L140 60 L155 60 L155 120 Z" fill="#143d2b" opacity="0.5"/>
          <path d="M220 120 L220 65 L245 65 L245 120 Z" fill="#143d2b" opacity="0.4"/>
          <path d="M340 120 L340 80 L360 80 L360 50 L375 50 L375 120 Z" fill="#143d2b" opacity="0.7"/>
          <path d="M480 120 L480 70 L510 70 L510 120 Z" fill="#143d2b" opacity="0.5"/>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title and Subtitle */}
        <div>
          <h1 className="font-display text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#143d2b] flex items-center gap-2">
            Heat Risk Intelligence
          </h1>
          <p className="font-sans text-[14px] font-normal leading-[1.5] text-[#4f6e5f] mt-1">
            Real-time insights. Healthier communities. A safer tomorrow.
          </p>
        </div>

        {/* Last updated and Generate Report Button */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-right">
            <span className="font-sans text-[11px] font-normal text-[#668576]">
              Last Updated : {overviewData.last_updated}
            </span>
          </div>

          <button
            onClick={() => setActiveTab('reports')}
            className="font-sans text-[13px] font-semibold leading-[1.2] bg-[#1b4d3e] hover:bg-[#143d2b] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#86efac]" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
