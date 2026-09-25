export interface HeatmapCell {
  date: string; // YYYY-MM-DD
  count: number;
  level: number; // 0..4
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  weekIndex: number;
}

export const COLOR_SCALES = {
  green: {
    empty: 'bg-[#1e232a]',
    levels: [
      'bg-[#1e232a]', // 0
      'bg-[#0e4429]', // 1 (dark green)
      'bg-[#006d32]', // 2 (medium green)
      'bg-[#26a641]', // 3 (bright green)
      'bg-[#39d353]', // 4 (brightest green)
    ],
    borderColors: [
      'border-white/5',
      'border-emerald-600/30',
      'border-emerald-500/40',
      'border-emerald-400/50',
      'border-emerald-300/60',
    ],
  },
  emerald: {
    empty: 'bg-[#182322]',
    levels: [
      'bg-[#182322]',
      'bg-[#064e3b]',
      'bg-[#059669]',
      'bg-[#10b981]',
      'bg-[#34d399]',
    ],
    borderColors: [
      'border-white/5',
      'border-teal-600/30',
      'border-teal-500/40',
      'border-teal-400/50',
      'border-teal-300/60',
    ],
  },
  cyan: {
    empty: 'bg-[#14222a]',
    levels: [
      'bg-[#14222a]',
      'bg-[#164e63]',
      'bg-[#0891b2]',
      'bg-[#06b6d4]',
      'bg-[#22d3ee]',
    ],
    borderColors: [
      'border-white/5',
      'border-cyan-600/30',
      'border-cyan-500/40',
      'border-cyan-400/50',
      'border-cyan-300/60',
    ],
  },
  amber: {
    empty: 'bg-[#26201a]',
    levels: [
      'bg-[#26201a]',
      'bg-[#78350f]',
      'bg-[#d97706]',
      'bg-[#f59e0b]',
      'bg-[#fbbf24]',
    ],
    borderColors: [
      'border-white/5',
      'border-amber-600/30',
      'border-amber-500/40',
      'border-amber-400/50',
      'border-amber-300/60',
    ],
  },
  blue: {
    empty: 'bg-[#172033]',
    levels: [
      'bg-[#172033]',
      'bg-[#1e3a8a]',
      'bg-[#2563eb]',
      'bg-[#3b82f6]',
      'bg-[#60a5fa]',
    ],
    borderColors: [
      'border-white/5',
      'border-blue-600/30',
      'border-blue-500/40',
      'border-blue-400/50',
      'border-blue-300/60',
    ],
  },
};

/**
 * Filter days for a specific timeframe (3m, 6m, 12m, or all)
 */
export function filterDaysByTimeframe<T extends { date: string }>(
  days: T[],
  timeframe: '3m' | '6m' | '12m' | 'all'
): T[] {
  if (timeframe === 'all' || !days.length) return days;

  let daysBack = 90;
  if (timeframe === '6m') daysBack = 180;
  if (timeframe === '12m') daysBack = 365;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysBack);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  return days.filter((d) => d.date >= cutoffStr);
}
