import React from 'react';
import { RiskLevel, PriorityLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel | PriorityLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showDot = false }) => {
  const getColors = (lvl: string) => {
    switch (lvl.toLowerCase()) {
      case 'low':
      case 'satisfactory':
        return 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]';
      case 'moderate':
      case 'caution':
      case 'medium':
        return 'bg-[#fef9c3] text-[#a16207] border-[#fde047]';
      case 'high':
      case 'extreme caution':
        return 'bg-[#ffedd5] text-[#c2410c] border-[#fdba74]';
      case 'very high':
      case 'critical':
        return 'bg-[#fee2e2] text-[#dc2626] border-[#fca5a5]';
      case 'extreme':
      case 'emergency':
        return 'bg-[#7f1d1d] text-white border-[#991b1b]';
      default:
        return 'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]';
    }
  };

  const getDotColor = (lvl: string) => {
    switch (lvl.toLowerCase()) {
      case 'low': return 'bg-[#2e7d32]';
      case 'moderate': return 'bg-[#eab308]';
      case 'high': return 'bg-[#ea580c]';
      case 'very high':
      case 'critical': return 'bg-[#dc2626]';
      case 'extreme': return 'bg-[#7f1d1d]';
      default: return 'bg-gray-400';
    }
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 font-semibold rounded-full leading-tight',
    md: 'text-[12px] px-3 py-1 font-semibold rounded-full leading-tight',
    lg: 'text-[13px] px-3.5 py-1.5 font-semibold rounded-lg leading-tight',
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 border ${getColors(level)} ${sizeClasses}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(level)}`} />}
      <span>{level}</span>
    </span>
  );
};
