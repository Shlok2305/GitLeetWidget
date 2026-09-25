import React from 'react';

export interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  trend,
  icon,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-2xl p-3 flex flex-col justify-between transition-colors ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>{label}</span>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-xl font-bold tracking-tight text-white font-mono tabular-nums">
          {value}
        </span>
        {trend && <span className="text-[11px] text-emerald-400 font-medium">{trend}</span>}
      </div>
      {subValue && (
        <span className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
          {subValue}
        </span>
      )}
    </div>
  );
};
