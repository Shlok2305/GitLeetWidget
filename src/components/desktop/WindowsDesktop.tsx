import React, { useState } from 'react';
import { useSettings } from '../../store/settingsStore';
import { useWidgets, widgetActions } from '../../store/widgetStore';
import { useGithub } from '../../hooks/useGithub';
import { useLeetcode } from '../../hooks/useLeetcode';
import { GithubWidget } from '../widgets/GithubWidget';
import { LeetcodeWidget } from '../widgets/LeetcodeWidget';
import { CodingProgressWidget } from '../widgets/CodingProgressWidget';
import { DailyProgressWidget } from '../widgets/DailyProgressWidget';
import { GoalWidget } from '../widgets/GoalWidget';
import { QuickStatsWidget } from '../widgets/QuickStatsWidget';
import { WindowsTaskbar } from './WindowsTaskbar';
import { DesktopContextMenu } from './DesktopContextMenu';
import { SettingsModal } from '../settings/SettingsModal';
import {
  Settings,
  Plus,
  RotateCcw,
  Sparkles,
  Terminal,
  Folder,
  Trash2,
  Code,
  Image as ImageIcon,
  Grid,
} from 'lucide-react';

export const WindowsDesktop: React.FC = () => {
  const [settings, updateSettings] = useSettings();
  const [widgets] = useWidgets();
  const { refetch: refetchGh } = useGithub();
  const { refetch: refetchLc } = useLeetcode();

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<
    'general' | 'github' | 'leetcode' | 'widgets' | 'desktop'
  >('general');

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleOpenSettings = (
    tab: 'general' | 'github' | 'leetcode' | 'widgets' | 'desktop' = 'general'
  ) => {
    setSettingsInitialTab(tab);
    setSettingsModalOpen(true);
  };

  const handleRefreshAll = () => {
    refetchGh();
    refetchLc();
  };

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    // If clicking directly on desktop background (not widget)
    if ((e.target as HTMLElement).closest('.widget-card')) return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const getWallpaperBackground = () => {
    switch (settings.desktopWallpaper) {
      case 'bloom-light':
        return 'radial-gradient(ellipse at center, #2e384d 0%, #151922 100%)';
      case 'cyberpunk':
        return 'radial-gradient(circle at 50% 50%, #171b26 0%, #0d0e12 100%)';
      case 'dusk':
        return 'linear-gradient(135deg, #1f1b2e 0%, #12141f 50%, #0b0c10 100%)';
      case 'bloom-dark':
      default:
        return 'radial-gradient(circle at 60% 40%, #181d28 0%, #0c0e14 100%)';
    }
  };

  return (
    <div
      onContextMenu={handleDesktopContextMenu}
      onClick={() => setContextMenu(null)}
      className="relative w-screen h-screen overflow-hidden flex flex-col justify-between select-none"
      style={{
        background: getWallpaperBackground(),
      }}
    >
      {/* Decorative desktop grid lines (if cyberpunk or dark wallpaper) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Subtle organic light glow matching Windows 11 Bloom aesthetic */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20 -top-20 -left-20 bg-emerald-500/30"
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-15 bottom-20 right-10 bg-teal-500/20"
      />

      {/* Top Floating Utility Control Bar */}
      <div className="absolute top-3 right-4 z-40 flex items-center gap-2 bg-[#16171d]/80 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-2xl shadow-xl">
        <button
          onClick={() => handleOpenSettings('widgets')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Widget</span>
        </button>

        <div className="w-px h-4 bg-white/10" />

        <button
          onClick={() => {
            const wallpapers = ['bloom-dark', 'cyberpunk', 'dusk', 'bloom-light'];
            const nextIdx = (wallpapers.indexOf(settings.desktopWallpaper) + 1) % wallpapers.length;
            updateSettings({ desktopWallpaper: wallpapers[nextIdx] });
          }}
          title="Switch Desktop Wallpaper"
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => updateSettings({ snapToGrid: !settings.snapToGrid })}
          title={settings.snapToGrid ? 'Snap to Grid: ON' : 'Snap to Grid: OFF'}
          className={`p-1.5 rounded-xl transition-colors ${
            settings.snapToGrid
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Grid className="w-4 h-4" />
        </button>

        <button
          onClick={() => widgetActions.resetLayout()}
          title="Reset Default Layout"
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleOpenSettings('general')}
          title="DevWidgets Settings"
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Optional Windows Desktop Icons (Recycle bin, VS Code, Terminal) */}
      {settings.showDesktopIcons && (
        <div className="absolute top-6 left-6 z-0 flex flex-col gap-4 pointer-events-auto">
          <div
            onClick={() => handleOpenSettings('general')}
            className="flex flex-col items-center w-16 p-2 rounded-xl hover:bg-white/10 cursor-pointer text-center group transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-black shadow-lg mb-1 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] text-white font-medium drop-shadow-md leading-tight">
              DevWidgets
            </span>
          </div>

          <div
            onClick={() => handleOpenSettings('widgets')}
            className="flex flex-col items-center w-16 p-2 rounded-xl hover:bg-white/10 cursor-pointer text-center group transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#007acc] flex items-center justify-center text-white shadow-lg mb-1 group-hover:scale-105 transition-transform">
              <Code className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-white font-medium drop-shadow-md leading-tight">
              VS Code
            </span>
          </div>

          <div
            onClick={() => handleOpenSettings('github')}
            className="flex flex-col items-center w-16 p-2 rounded-xl hover:bg-white/10 cursor-pointer text-center group transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-black border border-white/20 flex items-center justify-center text-white shadow-lg mb-1 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-white font-medium drop-shadow-md leading-tight">
              Terminal
            </span>
          </div>

          <div className="flex flex-col items-center w-16 p-2 rounded-xl hover:bg-white/10 cursor-pointer text-center group transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-700/80 flex items-center justify-center text-slate-300 shadow-lg mb-1 group-hover:scale-105 transition-transform">
              <Trash2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-300 font-medium drop-shadow-md leading-tight">
              Recycle Bin
            </span>
          </div>
        </div>
      )}

      {/* Active Desktop Widgets Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {widgets
          .filter((w) => w.visible)
          .map((widget) => {
            switch (widget.type) {
              case 'github':
                return (
                  <GithubWidget
                    key={widget.id}
                    widget={widget}
                    onOpenSettings={() => handleOpenSettings('github')}
                  />
                );
              case 'leetcode':
                return (
                  <LeetcodeWidget
                    key={widget.id}
                    widget={widget}
                    onOpenSettings={() => handleOpenSettings('leetcode')}
                  />
                );
              case 'combined':
                return (
                  <CodingProgressWidget
                    key={widget.id}
                    widget={widget}
                    onOpenSettings={() => handleOpenSettings('widgets')}
                  />
                );
              case 'daily':
                return (
                  <DailyProgressWidget
                    key={widget.id}
                    widget={widget}
                    onOpenSettings={() => handleOpenSettings('general')}
                  />
                );
              case 'goal':
                return (
                  <GoalWidget
                    key={widget.id}
                    widget={widget}
                    onOpenSettings={() => handleOpenSettings('general')}
                  />
                );
              case 'quickStats':
                return (
                  <QuickStatsWidget
                    key={widget.id}
                    widget={widget}
                    onOpenSettings={() => handleOpenSettings('general')}
                  />
                );
              default:
                return null;
            }
          })}
      </div>

      {/* Windows 11 Taskbar */}
      {settings.showTaskbar && (
        <WindowsTaskbar
          onOpenSettings={handleOpenSettings}
          onRefreshAll={handleRefreshAll}
        />
      )}

      {/* Desktop Context Menu */}
      {contextMenu && (
        <DesktopContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onOpenSettings={handleOpenSettings}
          onRefreshAll={handleRefreshAll}
        />
      )}

      {/* DevWidgets Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        initialTab={settingsInitialTab}
      />
    </div>
  );
};
