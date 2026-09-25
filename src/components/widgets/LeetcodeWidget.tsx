import React, { useState } from 'react';
import { WidgetInstance } from '../../types/widgets';
import { useLeetcode } from '../../hooks/useLeetcode';
import { useSettings } from '../../store/settingsStore';
import { WidgetShell } from './WidgetShell';
import { ProgressRing } from '../common/ProgressRing';
import { ContributionHeatmap } from '../common/ContributionHeatmap';
import { StreakCounter } from '../common/StreakCounter';
import { Code2, AlertCircle, RefreshCw, Trophy, Target } from 'lucide-react';
import { formatFriendlyDate } from '../../utils/date';

export interface LeetcodeWidgetProps {
  widget: WidgetInstance;
  onOpenSettings?: () => void;
}

export const LeetcodeWidget: React.FC<LeetcodeWidgetProps> = ({ widget, onOpenSettings }) => {
  const [settings] = useSettings();
  const { data, isLoading, error, refetch, lastUpdated } = useLeetcode();
  const [selectedDay, setSelectedDay] = useState<{ date: string; count: number } | null>(null);

  const handleOpenProfile = () => {
    if (data?.profileUrl) {
      window.open(data.profileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <WidgetShell
      widget={widget}
      title="LeetCode Progress"
      icon={<Code2 className="w-4 h-4 text-emerald-400" />}
      lastUpdated={lastUpdated}
      isLoading={isLoading}
      onRefresh={refetch}
      onOpenSettings={onOpenSettings}
      onOpenExternal={handleOpenProfile}
      externalLabel="Open LeetCode Profile"
    >
      {error && !data ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <AlertCircle className="w-8 h-8 text-amber-400 mb-2 opacity-80" />
          <p className="text-xs font-semibold text-slate-200">Unable to load LeetCode data</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[220px]">{error}</p>
          <button
            onClick={refetch}
            className="mt-3 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Top Section: Progress Ring + Solved Difficulties */}
          <div className="flex items-center justify-between gap-3 mb-2">
            {/* Progress Ring with Total / Max */}
            <div
              onClick={handleOpenProfile}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <ProgressRing
                value={data?.totalSolved ?? 59}
                max={data?.totalQuestions ?? 3450}
                size={78}
                strokeWidth={7}
                color="#10b981"
              >
                <div className="leading-tight">
                  <div className="text-base font-extrabold text-white font-mono tabular-nums">
                    {data?.totalSolved ?? 59}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    /{data?.totalQuestions ?? 3450}
                  </div>
                </div>
              </ProgressRing>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    @{data?.username || settings.leetcodeUsername}
                  </span>
                  {data?.ranking && (
                    <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-mono">
                      <Trophy className="w-3 h-3 inline" />
                      #{data.ranking.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Acc: <span className="text-emerald-400 font-semibold">{data?.acceptanceRate ?? 58.4}%</span>
                </div>
                <div className="mt-1">
                  <StreakCounter
                    streak={data?.currentStreak ?? 0}
                    label="streak"
                    size="sm"
                    activeColor="text-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Easy / Medium / Hard Mini Breakdown */}
            <div className="flex flex-col gap-1.5 min-w-[130px] bg-white/[0.02] p-2 rounded-xl border border-white/5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-teal-400 font-medium">Easy</span>
                <span className="font-mono tabular-nums text-slate-200">
                  {data?.easySolved ?? 24} <span className="text-slate-400 text-[9px]">/{data?.totalEasy ?? 850}</span>
                </span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-teal-400 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, ((data?.easySolved ?? 24) / (data?.totalEasy || 850)) * 100)}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-medium">Med</span>
                <span className="font-mono tabular-nums text-slate-200">
                  {data?.mediumSolved ?? 28} <span className="text-slate-400 text-[9px]">/{data?.totalMedium ?? 1780}</span>
                </span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, ((data?.mediumSolved ?? 28) / (data?.totalMedium || 1780)) * 100)}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-rose-400 font-medium">Hard</span>
                <span className="font-mono tabular-nums text-slate-200">
                  {data?.hardSolved ?? 7} <span className="text-slate-400 text-[9px]">/{data?.totalHard ?? 820}</span>
                </span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-rose-400 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, ((data?.hardSolved ?? 7) / (data?.totalHard || 820)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar: Today, Week, Month */}
          <div className="grid grid-cols-3 gap-2 mb-2 text-center">
            <div className="bg-white/[0.03] p-1.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block">Today</span>
              <span className="font-mono font-bold text-sm text-emerald-400">
                {data?.solvedToday ?? 0}
              </span>
            </div>
            <div className="bg-white/[0.03] p-1.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block">This Week</span>
              <span className="font-mono font-bold text-sm text-white">
                {data?.solvedThisWeek ?? 0}
              </span>
            </div>
            <div className="bg-white/[0.03] p-1.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block">This Month</span>
              <span className="font-mono font-bold text-sm text-white">
                {data?.solvedThisMonth ?? 0}
              </span>
            </div>
          </div>

          {/* Activity Heatmap Grid */}
          <div className="bg-black/20 rounded-2xl p-2.5 border border-white/5 flex-1 flex flex-col justify-center overflow-hidden">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 px-0.5">
              <span className="font-medium text-slate-300">LeetCode Activity</span>
              {selectedDay ? (
                <span className="text-emerald-400 font-medium font-mono text-[10px]">
                  {selectedDay.count} {selectedDay.count === 1 ? 'solved' : 'solved'} · {formatFriendlyDate(selectedDay.date)}
                </span>
              ) : (
                <span className="text-slate-400 text-[10px]">Recent submissions</span>
              )}
            </div>

            <ContributionHeatmap
              data={data?.activityDays || []}
              colorScale={settings.accentColor}
              cellSize={10}
              gap={2.5}
              unitName="problems solved"
              emptyTooltipText="0 problems solved"
              maxColumns={26} // last 6 months fits nicely
              onCellClick={(item) => setSelectedDay({ date: item.date, count: item.count })}
            />
          </div>
        </div>
      )}
    </WidgetShell>
  );
};
