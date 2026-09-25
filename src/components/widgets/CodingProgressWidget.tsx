import React, { useState } from 'react';
import { WidgetInstance } from '../../types/widgets';
import { useGithub } from '../../hooks/useGithub';
import { useLeetcode } from '../../hooks/useLeetcode';
import { useSettings } from '../../store/settingsStore';
import { WidgetShell } from './WidgetShell';
import { ContributionHeatmap } from '../common/ContributionHeatmap';
import { StreakCounter } from '../common/StreakCounter';
import { Layers, Github, Code2 } from 'lucide-react';
import { formatFriendlyDate } from '../../utils/date';

export interface CodingProgressWidgetProps {
  widget: WidgetInstance;
  onOpenSettings?: () => void;
}

export const CodingProgressWidget: React.FC<CodingProgressWidgetProps> = ({
  widget,
  onOpenSettings,
}) => {
  const [settings] = useSettings();
  const {
    data: ghData,
    isLoading: ghLoading,
    refetch: refetchGh,
    lastUpdated: ghLastUpdated,
  } = useGithub();
  const {
    data: lcData,
    isLoading: lcLoading,
    refetch: refetchLc,
    lastUpdated: lcLastUpdated,
  } = useLeetcode();

  const [activeHoverInfo, setActiveHoverInfo] = useState<{
    source: 'github' | 'leetcode';
    date: string;
    count: number;
  } | null>(null);

  const handleRefreshAll = () => {
    refetchGh();
    refetchLc();
  };

  const latestUpdate = ghLastUpdated || lcLastUpdated;
  const isLoading = ghLoading || lcLoading;

  return (
    <WidgetShell
      widget={widget}
      title="Coding Progress Dashboard"
      icon={<Layers className="w-4 h-4 text-emerald-400" />}
      lastUpdated={latestUpdate}
      isLoading={isLoading}
      onRefresh={handleRefreshAll}
      onOpenSettings={onOpenSettings}
    >
      <div className="flex-1 flex flex-col justify-between overflow-hidden gap-2">
        {/* Top Split Header: LeetCode on Left, GitHub on Right */}
        <div className="grid grid-cols-2 gap-3 bg-white/[0.02] p-2.5 rounded-2xl border border-white/5">
          {/* LeetCode Side */}
          <div className="flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>LeetCode</span>
              </div>
              <StreakCounter
                streak={lcData?.currentStreak ?? 0}
                label="streak"
                size="sm"
                activeColor="text-emerald-400"
              />
            </div>

            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-xl font-black font-mono text-white tabular-nums">
                {lcData?.totalSolved ?? 59}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {lcData?.totalQuestions ?? 3450} solved
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Today: <span className="text-emerald-400 font-bold">{lcData?.solvedToday ?? 0}</span> · This week: <span className="text-white font-medium">{lcData?.solvedThisWeek ?? 0}</span>
            </div>
          </div>

          {/* GitHub Side */}
          <div className="flex flex-col justify-between border-l border-white/5 pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Github className="w-3.5 h-3.5 text-emerald-400" />
                <span>GitHub</span>
              </div>
              <StreakCounter
                streak={ghData?.currentStreak ?? 0}
                label="streak"
                size="sm"
                activeColor="text-emerald-400"
              />
            </div>

            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-xl font-black font-mono text-white tabular-nums">
                {ghData?.totalContributionsThisYear?.toLocaleString() ?? 342}
              </span>
              <span className="text-xs text-slate-400 font-mono">contributions</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Today: <span className="text-emerald-400 font-bold">{ghData?.contributionsToday ?? 0}</span> · This week: <span className="text-white font-medium">{ghData?.contributionsThisWeek ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Selected Hover Detail Kicker */}
        <div className="px-1 flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-medium text-slate-400">Dual Activity Timeline</span>
          {activeHoverInfo ? (
            <span className="text-emerald-400 font-mono text-[10px]">
              {activeHoverInfo.source === 'github' ? 'GitHub' : 'LeetCode'}: {activeHoverInfo.count} {activeHoverInfo.source === 'github' ? 'contribs' : 'problems'} on {formatFriendlyDate(activeHoverInfo.date)}
            </span>
          ) : (
            <span className="text-slate-400 text-[10px]">Last 6 Months</span>
          )}
        </div>

        {/* Dual Heatmaps Stacked */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          {/* LeetCode Activity Grid */}
          <div className="bg-black/20 rounded-xl p-2 border border-white/5 flex-1 flex flex-col justify-center overflow-hidden">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <Code2 className="w-3 h-3 text-emerald-400" /> LeetCode
              </span>
              <span className="font-mono text-emerald-400">
                {lcData?.activityDays ? lcData.activityDays.filter(d => d.count > 0).length : 0} active days
              </span>
            </div>
            <ContributionHeatmap
              data={lcData?.activityDays || []}
              colorScale={settings.accentColor}
              cellSize={9}
              gap={2}
              unitName="problems solved"
              showMonthLabels={false}
              maxColumns={32}
              onCellClick={(item) =>
                setActiveHoverInfo({ source: 'leetcode', date: item.date, count: item.count })
              }
            />
          </div>

          {/* GitHub Activity Grid */}
          <div className="bg-black/20 rounded-xl p-2 border border-white/5 flex-1 flex flex-col justify-center overflow-hidden">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <Github className="w-3 h-3 text-emerald-400" /> GitHub
              </span>
              <span className="font-mono text-emerald-400">
                {ghData?.days ? ghData.days.filter(d => d.count > 0).length : 0} active days
              </span>
            </div>
            <ContributionHeatmap
              data={ghData?.days || []}
              colorScale={settings.accentColor}
              cellSize={9}
              gap={2}
              unitName="contributions"
              showMonthLabels={false}
              maxColumns={32}
              onCellClick={(item) =>
                setActiveHoverInfo({ source: 'github', date: item.date, count: item.count })
              }
            />
          </div>
        </div>
      </div>
    </WidgetShell>
  );
};
