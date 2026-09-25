import React from 'react';
import { WidgetInstance } from '../../types/widgets';
import { useGithub } from '../../hooks/useGithub';
import { useLeetcode } from '../../hooks/useLeetcode';
import { useSettings } from '../../store/settingsStore';
import { WidgetShell } from './WidgetShell';
import { ProgressBar } from '../common/ProgressBar';
import { StreakCounter } from '../common/StreakCounter';
import { CalendarCheck, Code2, Github } from 'lucide-react';

export interface DailyProgressWidgetProps {
  widget: WidgetInstance;
  onOpenSettings?: () => void;
}

export const DailyProgressWidget: React.FC<DailyProgressWidgetProps> = ({
  widget,
  onOpenSettings,
}) => {
  const [settings] = useSettings();
  const { data: ghData, isLoading: ghLoading, refetch: refetchGh } = useGithub();
  const { data: lcData, isLoading: lcLoading, refetch: refetchLc } = useLeetcode();

  const handleRefresh = () => {
    refetchGh();
    refetchLc();
  };

  const lcToday = lcData?.solvedToday ?? 0;
  const lcGoal = settings.goals.dailyLeetcode || 3;

  const ghToday = ghData?.contributionsToday ?? 0;
  const ghGoal = settings.goals.dailyGithubContributions || 5;

  // Joint daily streak
  const activeStreak = Math.max(lcData?.currentStreak ?? 0, ghData?.currentStreak ?? 0);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <WidgetShell
      widget={widget}
      title="Today's Progress"
      icon={<CalendarCheck className="w-4 h-4 text-emerald-400" />}
      isLoading={ghLoading || lcLoading}
      onRefresh={handleRefresh}
      onOpenSettings={onOpenSettings}
    >
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        {/* Date header */}
        <div className="flex items-center justify-between pb-1 border-b border-white/5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            TODAY
          </span>
          <span className="text-[10px] font-mono text-slate-400">{formattedDate}</span>
        </div>

        {/* LeetCode Section */}
        <div className="bg-white/[0.02] p-2.5 rounded-2xl border border-white/5 flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" /> LeetCode
            </span>
            <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
              {lcToday} / {lcGoal}
            </span>
          </div>
          <ProgressBar
            value={lcToday}
            max={lcGoal}
            color="bg-emerald-500"
            height="h-2"
          />
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            {lcToday} {lcToday === 1 ? 'problem' : 'problems'} completed
          </div>
        </div>

        {/* GitHub Section */}
        <div className="bg-white/[0.02] p-2.5 rounded-2xl border border-white/5 flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-emerald-400" /> GitHub
            </span>
            <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
              {ghToday} / {ghGoal}
            </span>
          </div>
          <ProgressBar
            value={ghToday}
            max={ghGoal}
            color="bg-emerald-500"
            height="h-2"
          />
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            {ghToday} {ghToday === 1 ? 'contribution' : 'contributions'} committed
          </div>
        </div>

        {/* Coding Streak Footer */}
        <div className="bg-black/25 p-2 rounded-xl border border-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-300 font-medium">Coding Streak</span>
          <StreakCounter
            streak={activeStreak}
            label="days"
            size="md"
            activeColor="text-amber-400"
          />
        </div>
      </div>
    </WidgetShell>
  );
};
