import React from 'react';

interface CircularGaugeProps {
  value: number;
  max?: number;
  label: string;
  sublabel?: string;
  color?: string;
  strokeWidth?: number;
  size?: number;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  color = '#ea580c',
  strokeWidth = 10,
  size = 130
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Make gauge cover 260 degrees arc for reference styling
  const arcLength = circumference * 0.75;
  const progress = Math.min(1, Math.max(0, value / max));
  const strokeDashoffset = arcLength - (arcLength * progress);

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-135">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e8efe9"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Progress bar */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[24px] font-bold leading-none" style={{ color: color }}>
          {label}
        </span>
        {sublabel && (
          <span className="text-[12px] font-medium text-[#688576] mt-1">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
