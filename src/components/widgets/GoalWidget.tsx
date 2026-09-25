import React, { useState } from 'react';
import { WidgetInstance } from '../../types/widgets';
import { useGithub } from '../../hooks/useGithub';
import { useLeetcode } from '../../hooks/useLeetcode';
import { useSettings } from '../../store/settingsStore';
import { WidgetShell } from './WidgetShell';
import { ProgressBar } from '../common/ProgressBar';
import { Target, Edit3, Check, Code2, Github } from 'lucide-react';

export interface GoalWidgetProps {
  widget: WidgetInstance;
  onOpenSettings?: () => void;
}

export const GoalWidget: React.FC<GoalWidgetProps> = ({ widget, onOpenSettings }) => {
  const [settings, updateSettings] = useSettings();
  const { data: ghData, isLoading: ghLoading } = useGithub();
  const { data: lcData, isLoading: lcLoading } = useLeetcode();

  const [period, setPeriod] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoals, setTempGoals] = useState(settings.goals);

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long' }).toUpperCase();

  // Values based on active period
  let lcCurrent = 0;
  let lcTarget = 1;
  let ghCurrent = 0;
  let ghTarget = 1;
  let periodTitle = `${monthName} GOALS`;
  let ghUnit = 'active days';

  if (period === 'monthly') {
    periodTitle = `${monthName} GOAL`;
    lcCurrent = lcData?.solvedThisMonth ?? 0;
    lcTarget = settings.goals.monthlyLeetcode;
    // Calculate active days this month for github
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    ghCurrent = (ghData?.days || []).filter((d) => {
      const itemDate = new Date(d.date + 'T00:00:00');
      return itemDate >= startOfMonth && itemDate <= now && d.count > 0;
    }).length;
    ghTarget = settings.goals.monthlyGithubDays;
    ghUnit = 'active days';
  } else if (period === 'weekly') {
    periodTitle = 'THIS WEEK GOAL';
    lcCurrent = lcData?.solvedThisWeek ?? 0;
    lcTarget = settings.goals.weeklyLeetcode;
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    ghCurrent = (ghData?.days || []).filter((d) => {
      const itemDate = new Date(d.date + 'T00:00:00');
      return itemDate >= startOfWeek && itemDate <= now && d.count > 0;
    }).length;
    ghTarget = settings.goals.weeklyGithubDays;
    ghUnit = 'active days';
  } else {
    periodTitle = "TODAY'S TARGET";
    lcCurrent = lcData?.solvedToday ?? 0;
    lcTarget = settings.goals.dailyLeetcode;
    ghCurrent = ghData?.contributionsToday ?? 0;
    ghTarget = settings.goals.dailyGithubContributions;
    ghUnit = 'contributions';
  }

  const handleSaveGoals = () => {
    updateSettings({ goals: tempGoals });
    setIsEditing(false);
  };

  return (
    <WidgetShell
      widget={widget}
      title="Coding Goals"
      icon={<Target className="w-4 h-4 text-emerald-400" />}
      isLoading={ghLoading || lcLoading}
      onOpenSettings={onOpenSettings}
      headerControls={
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-black/30 rounded-lg p-0.5 border border-white/5">
            <button
              onClick={() => setPeriod('daily')}
              className={`px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors ${
                period === 'daily'
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors ${
                period === 'weekly'
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors ${
                period === 'monthly'
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Month
            </button>
          </div>

          <button
            onClick={() => {
              if (isEditing) handleSaveGoals();
              else {
                setTempGoals(settings.goals);
                setIsEditing(true);
              }
            }}
            title={isEditing ? 'Save Goals' : 'Edit Target Numbers'}
            className={`p-1 rounded-md transition-colors ${
              isEditing
                ? 'text-emerald-400 bg-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          </button>
        </div>
      }
    >
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between pb-1 border-b border-white/5">
          <span className="text-[10px] font-bold tracking-wider text-slate-400">
            {periodTitle}
          </span>
          {isEditing && (
            <span className="text-[10px] text-emerald-400 font-medium animate-pulse">
              Editing targets...
            </span>
          )}
        </div>

        {/* LeetCode Goal */}
        <div className="bg-white/[0.02] p-2.5 rounded-2xl border border-white/5 flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" /> LeetCode
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-white tabular-nums">
                {lcCurrent} /
              </span>
              {isEditing ? (
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={
                    period === 'monthly'
                      ? tempGoals.monthlyLeetcode
                      : period === 'weekly'
                      ? tempGoals.weeklyLeetcode
                      : tempGoals.dailyLeetcode
                  }
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 1);
                    if (period === 'monthly') {
                      setTempGoals({ ...tempGoals, monthlyLeetcode: val });
                    } else if (period === 'weekly') {
                      setTempGoals({ ...tempGoals, weeklyLeetcode: val });
                    } else {
                      setTempGoals({ ...tempGoals, dailyLeetcode: val });
                    }
                  }}
                  className="w-12 px-1 py-0.5 text-xs font-mono bg-black/60 border border-emerald-500/50 rounded text-emerald-400 text-center"
                />
              ) : (
                <span className="font-mono text-xs text-slate-400 tabular-nums">
                  {lcTarget} problems
                </span>
              )}
            </div>
          </div>
          <ProgressBar
            value={lcCurrent}
            max={lcTarget}
            color="bg-emerald-500"
            height="h-2.5"
            showPercentage={true}
          />
        </div>

        {/* GitHub Goal */}
        <div className="bg-white/[0.02] p-2.5 rounded-2xl border border-white/5 flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-emerald-400" /> GitHub
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-white tabular-nums">
                {ghCurrent} /
              </span>
              {isEditing ? (
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={
                    period === 'monthly'
                      ? tempGoals.monthlyGithubDays
                      : period === 'weekly'
                      ? tempGoals.weeklyGithubDays
                      : tempGoals.dailyGithubContributions
                  }
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 1);
                    if (period === 'monthly') {
                      setTempGoals({ ...tempGoals, monthlyGithubDays: val });
                    } else if (period === 'weekly') {
                      setTempGoals({ ...tempGoals, weeklyGithubDays: val });
                    } else {
                      setTempGoals({ ...tempGoals, dailyGithubContributions: val });
                    }
                  }}
                  className="w-12 px-1 py-0.5 text-xs font-mono bg-black/60 border border-emerald-500/50 rounded text-emerald-400 text-center"
                />
              ) : (
                <span className="font-mono text-xs text-slate-400 tabular-nums">
                  {ghTarget} {ghUnit}
                </span>
              )}
            </div>
          </div>
          <ProgressBar
            value={ghCurrent}
            max={ghTarget}
            color="bg-emerald-500"
            height="h-2.5"
            showPercentage={true}
          />
        </div>

        {/* Goal Motivation Footer */}
        <div className="text-[10px] text-slate-400 text-center py-1">
          {lcCurrent >= lcTarget && ghCurrent >= ghTarget ? (
            <span className="text-emerald-400 font-semibold">🎉 All targets achieved! Keep up the momentum!</span>
          ) : (
            <span>
              {Math.max(0, lcTarget - lcCurrent)} problems & {Math.max(0, ghTarget - ghCurrent)} {ghUnit} remaining
            </span>
          )}
        </div>
      </div>
    </WidgetShell>
  );
};
