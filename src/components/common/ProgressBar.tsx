import React from 'react';

export interface ProgressBarProps {
  value: number;
  max: number;
  color?: string; // e.g. 'bg-emerald-500'
  height?: string; // e.g. 'h-2'
  label?: string;
  valueDisplay?: string;
  className?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  color = 'bg-emerald-500',
  height = 'h-2',
  label,
  valueDisplay,
  className = '',
  showPercentage = false,
}) => {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className={`w-full ${className}`}>
      {(label || valueDisplay || showPercentage) && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
          {label && <span className="text-slate-300">{label}</span>}
          <span className="font-mono text-slate-400 tabular-nums">
            {valueDisplay || (showPercentage ? `${Math.round(percentage)}%` : `${value} / ${max}`)}
          </span>
        </div>
      )}
      <div className={`w-full bg-white/5 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
