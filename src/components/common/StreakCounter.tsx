import React from 'react';
import { Flame } from 'lucide-react';

export interface StreakCounterProps {
  streak: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  activeColor?: string;
  className?: string;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  streak,
  label = 'day streak',
  size = 'md',
  activeColor = 'text-amber-400',
  className = '',
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/5 ${className}`}
    >
      <Flame
        className={`${isSm ? 'w-3.5 h-3.5' : isLg ? 'w-5 h-5' : 'w-4 h-4'} ${
          streak > 0 ? activeColor : 'text-slate-500'
        } animate-pulse`}
      />
      <span
        className={`font-mono font-bold tabular-nums text-white ${
          isSm ? 'text-xs' : isLg ? 'text-lg' : 'text-sm'
        }`}
      >
        {streak}
      </span>
      {label && (
        <span
          className={`text-slate-400 font-medium ${
            isSm ? 'text-[10px]' : isLg ? 'text-xs' : 'text-xs'
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
};
