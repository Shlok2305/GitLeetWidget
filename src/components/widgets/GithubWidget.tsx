import React, { useState } from 'react';
import { WidgetInstance } from '../../types/widgets';
import { useGithub } from '../../hooks/useGithub';
import { useSettings } from '../../store/settingsStore';
import { widgetActions } from '../../store/widgetStore';
import { WidgetShell } from './WidgetShell';
import { ContributionHeatmap } from '../common/ContributionHeatmap';
import { StreakCounter } from '../common/StreakCounter';
import { StatCard } from '../common/StatCard';
import { filterDaysByTimeframe } from '../../utils/heatmap';
import { Github, AlertCircle, RefreshCw } from 'lucide-react';
import { formatFriendlyDate } from '../../utils/date';

export interface GithubWidgetProps {
  widget: WidgetInstance;
  onOpenSettings?: () => void;
}

export const GithubWidget: React.FC<GithubWidgetProps> = ({ widget, onOpenSettings }) => {
  const [settings] = useSettings();
  const { data, isLoading, error, refetch, lastUpdated } = useGithub();
  const [selectedDay, setSelectedDay] = useState<{ date: string; count: number } | null>(null);

  const currentTimeframe = widget.timeframe || '6m';

  const handleTimeframeChange = (tf: '3m' | '6m' | '12m') => {
    widgetActions.setTimeframe(widget.id, tf);
  };

  const handleOpenProfile = () => {
    if (data?.profileUrl) {
      window.open(data.profileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const visibleDays = data?.days ? filterDaysByTimeframe(data.days, currentTimeframe) : [];

  return (
    <WidgetShell
      widget={widget}
      title="GitHub Activity"
      icon={<Github className="w-4 h-4 text-emerald-400" />}
      lastUpdated={lastUpdated}
      isLoading={isLoading}
      onRefresh={refetch}
      onOpenSettings={onOpenSettings}
      onOpenExternal={handleOpenProfile}
      externalLabel="Open GitHub Profile"
      headerControls={
        <div className="flex items-center bg-black/30 rounded-lg p-0.5 border border-white/5 mr-1">
          {(['3m', '6m', '12m'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              className={`px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors ${
                currentTimeframe === tf
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      }
    >
      {error && !data ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <AlertCircle className="w-8 h-8 text-amber-400 mb-2 opacity-80" />
          <p className="text-xs font-semibold text-slate-200">Unable to load GitHub data</p>
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
          {/* Top Profile & Summary Row */}
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div
              onClick={handleOpenProfile}
              className="flex items-center gap-2.5 cursor-pointer group min-w-0"
            >
              <img
                src={data?.avatarUrl || `https://github.com/${settings.githubUsername}.png`}
                alt={data?.username || 'GitHub User'}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full ring-2 ring-emerald-500/30 group-hover:ring-emerald-400 transition-all object-cover shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                    {data?.name || data?.username || settings.githubUsername}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    @{data?.username || settings.githubUsername}
                  </span>
                </div>
                <div className="text-[11px] font-mono font-semibold text-emerald-400">
                  {data?.totalContributionsThisYear?.toLocaleString() ?? '—'}{' '}
                  <span className="text-slate-400 font-sans font-normal text-[10px]">
                    contributions
                  </span>
                </div>
              </div>
            </div>

            {/* Streaks */}
            <div className="flex items-center gap-1.5 shrink-0">
              <StreakCounter
                streak={data?.currentStreak ?? 0}
                label="current"
                size="sm"
                activeColor="text-emerald-400"
              />
              <StreakCounter
                streak={data?.longestStreak ?? 0}
                label="longest"
                size="sm"
                activeColor="text-amber-400"
              />
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 mb-2.5">
            <StatCard
              label="Today"
              value={data?.contributionsToday ?? 0}
              subValue="commits"
            />
            <StatCard
              label="This Week"
              value={data?.contributionsThisWeek ?? 0}
              subValue="contributions"
            />
            <StatCard
              label="This Month"
              value={data?.contributionsThisMonth ?? 0}
              subValue="contributions"
            />
          </div>

          {/* Heatmap Section */}
          <div className="bg-black/20 rounded-2xl p-2.5 border border-white/5 flex-1 flex flex-col justify-center overflow-hidden">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 px-0.5">
              <span className="font-medium text-slate-300">Contribution Heatmap</span>
              {selectedDay ? (
                <span className="text-emerald-400 font-medium font-mono text-[10px]">
                  {selectedDay.count} {selectedDay.count === 1 ? 'contrib' : 'contribs'} · {formatFriendlyDate(selectedDay.date)}
                </span>
              ) : (
                <span className="text-slate-400 text-[10px]">Click any cell for details</span>
              )}
            </div>

            <ContributionHeatmap
              data={visibleDays}
              colorScale={settings.accentColor}
              cellSize={10}
              gap={2.5}
              unitName="contributions"
              onCellClick={(item) => setSelectedDay({ date: item.date, count: item.count })}
            />
          </div>
        </div>
      )}
    </WidgetShell>
  );
};
