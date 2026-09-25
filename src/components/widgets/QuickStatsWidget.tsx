import React from 'react';
import { WidgetInstance } from '../../types/widgets';
import { useGithub } from '../../hooks/useGithub';
import { useLeetcode } from '../../hooks/useLeetcode';
import { WidgetShell } from './WidgetShell';
import { StreakCounter } from '../common/StreakCounter';
import { Zap, Code2, Github, Calendar } from 'lucide-react';

export interface QuickStatsWidgetProps {
  widget: WidgetInstance;
  onOpenSettings?: () => void;
}

export const QuickStatsWidget: React.FC<QuickStatsWidgetProps> = ({
  widget,
  onOpenSettings,
}) => {
  const { data: ghData, isLoading: ghLoading, refetch: refetchGh } = useGithub();
  const { data: lcData, isLoading: lcLoading, refetch: refetchLc } = useLeetcode();

  const handleRefresh = () => {
    refetchGh();
    refetchLc();
  };

  const highestStreak = Math.max(lcData?.currentStreak ?? 0, ghData?.currentStreak ?? 0);
  const totalThisWeek = (lcData?.solvedThisWeek ?? 0) + (ghData?.contributionsThisWeek ?? 0);
  const totalThisMonth = (lcData?.solvedThisMonth ?? 0) + (ghData?.contributionsThisMonth ?? 0);

  return (
    <WidgetShell
      widget={widget}
      title="Quick Stats"
      icon={<Zap className="w-4 h-4 text-emerald-400" />}
      isLoading={ghLoading || lcLoading}
      onRefresh={handleRefresh}
      onOpenSettings={onOpenSettings}
    >
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        {/* Streak highlight */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-transparent p-2.5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              CODING STREAK
            </span>
            <span className="text-xs text-slate-300 font-medium">Consistent daily activity</span>
          </div>
          <StreakCounter
            streak={highestStreak}
            label="days"
            size="md"
            activeColor="text-amber-400"
          />
        </div>

        {/* Platform Totals Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* LeetCode stats */}
          <div className="bg-white/[0.02] p-2 rounded-xl border border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>LeetCode</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-black font-mono text-white tabular-nums">
                {lcData?.totalSolved ?? 59}
              </span>
              <span className="text-[10px] text-slate-400">solved</span>
            </div>
          </div>

          {/* GitHub stats */}
          <div className="bg-white/[0.02] p-2 rounded-xl border border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <Github className="w-3.5 h-3.5 text-emerald-400" />
              <span>GitHub</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-black font-mono text-white tabular-nums">
                {ghData?.totalContributionsThisYear ?? 342}
              </span>
              <span className="text-[10px] text-slate-400">contribs</span>
            </div>
          </div>
        </div>

        {/* Time periods summary */}
        <div className="bg-black/25 p-2 rounded-xl border border-white/5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-emerald-400" />
              <span>This Week</span>
            </span>
            <span className="font-mono font-bold text-white tabular-nums">
              {lcData?.solvedThisWeek ?? 0} problems · {ghData?.contributionsThisWeek ?? 0} commits
            </span>
          </div>

          <div className="h-px bg-white/5" />

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-emerald-400" />
              <span>This Month</span>
            </span>
            <span className="font-mono font-bold text-white tabular-nums">
              {lcData?.solvedThisMonth ?? 0} problems · {ghData?.contributionsThisMonth ?? 0} commits
            </span>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 text-center">
          Combined monthly output: <span className="text-emerald-400 font-semibold">{totalThisMonth} actions</span>
        </div>
      </div>
    </WidgetShell>
  );
};
