import React, { useState, useEffect } from 'react';
import {
  Settings,
  RefreshCw,
  Plus,
  RotateCcw,
  Pin,
  ChevronUp,
  Wifi,
  Volume2,
  Battery,
  Search,
  Sparkles,
} from 'lucide-react';
import { useSettings } from '../../store/settingsStore';
import { widgetActions } from '../../store/widgetStore';

export interface WindowsTaskbarProps {
  onOpenSettings: (tab?: 'general' | 'widgets' | 'desktop') => void;
  onRefreshAll: () => void;
}

export const WindowsTaskbar: React.FC<WindowsTaskbarProps> = ({
  onOpenSettings,
  onRefreshAll,
}) => {
  const [settings, updateSettings] = useSettings();
  const [showTrayMenu, setShowTrayMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = currentTime.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' });

  return (
    <div className="relative h-12 w-full bg-[#111217]/85 backdrop-blur-2xl border-t border-white/[0.08] flex items-center justify-between px-3 select-none z-50">
      {/* Left: Weather / Widgets button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onOpenSettings('widgets')}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-xs"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-[11px] hidden sm:inline">Widgets Active</span>
        </button>
      </div>

      {/* Center: Windows 11 App Icons */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
        {/* Windows Start Button */}
        <button
          onClick={() => onOpenSettings('general')}
          title="Windows Start / DevWidgets"
          className="p-2 rounded-xl hover:bg-white/10 text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
          </svg>
        </button>

        {/* Search */}
        <button
          onClick={() => onOpenSettings('widgets')}
          title="Search / Add Widgets"
          className="p-2 rounded-xl hover:bg-white/10 text-slate-300 transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* DevWidgets App icon (Active with small pill indicator) */}
        <div className="relative">
          <button
            onClick={() => onOpenSettings('general')}
            title="DevWidgets - Productivity Dashboard"
            className="p-2 rounded-xl bg-white/10 text-emerald-400 hover:bg-white/15 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-emerald-400" />
        </div>

        {/* Add Widget Quick Button */}
        <button
          onClick={() => onOpenSettings('widgets')}
          title="Add New Widget"
          className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Refresh All Button */}
        <button
          onClick={onRefreshAll}
          title="Refresh All Widgets"
          className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Right: System Tray & Clock */}
      <div className="flex items-center gap-1.5">
        {/* Tray Overflow Arrow */}
        <div className="relative">
          <button
            onClick={() => setShowTrayMenu(!showTrayMenu)}
            title="Show hidden tray icons"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {/* System Tray Menu Popover */}
          {showTrayMenu && (
            <div
              className="absolute bottom-12 right-0 w-52 bg-[#181920]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-1.5 text-xs text-slate-200 z-50 flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 flex items-center justify-between">
                <span>DevWidgets Tray</span>
                <span className="text-emerald-400">v1.0</span>
              </div>

              <button
                onClick={() => {
                  onRefreshAll();
                  setShowTrayMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/10 text-left transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh all widgets</span>
              </button>

              <button
                onClick={() => {
                  updateSettings({ alwaysOnTop: !settings.alwaysOnTop });
                  setShowTrayMenu(false);
                }}
                className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-white/10 text-left transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Pin className="w-3.5 h-3.5" />
                  <span>Always on top</span>
                </span>
                {settings.alwaysOnTop && (
                  <span className="text-[10px] text-emerald-400 font-semibold">ON</span>
                )}
              </button>

              <button
                onClick={() => {
                  widgetActions.resetLayout();
                  setShowTrayMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/10 text-left transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset widgets layout</span>
              </button>

              <button
                onClick={() => {
                  onOpenSettings('general');
                  setShowTrayMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/10 text-left transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick System Controls: Wifi, Sound, Battery */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/10 cursor-pointer text-slate-300">
          <Wifi className="w-3.5 h-3.5" />
          <Volume2 className="w-3.5 h-3.5" />
          <Battery className="w-3.5 h-3.5" />
        </div>

        {/* Clock & Date */}
        <button
          onClick={() => onOpenSettings('general')}
          className="px-2.5 py-1 rounded-lg hover:bg-white/10 text-right flex flex-col justify-center leading-none"
        >
          <span className="text-xs font-semibold text-slate-200">{timeStr}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">{dateStr}</span>
        </button>

        {/* Show Desktop Peek Strip (far right line) */}
        <div className="w-1.5 h-7 border-l border-white/10 ml-1 hover:bg-white/20 cursor-pointer" title="Show desktop" />
      </div>
    </div>
  );
};
