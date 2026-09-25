import React from 'react';
import {
  Plus,
  RefreshCw,
  RotateCcw,
  Settings,
  Image,
  Grid,
  Check,
} from 'lucide-react';
import { widgetActions } from '../../store/widgetStore';
import { useSettings } from '../../store/settingsStore';

export interface DesktopContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onOpenSettings: (tab?: 'general' | 'widgets' | 'desktop') => void;
  onRefreshAll: () => void;
}

export const DesktopContextMenu: React.FC<DesktopContextMenuProps> = ({
  x,
  y,
  onClose,
  onOpenSettings,
  onRefreshAll,
}) => {
  const [settings, updateSettings] = useSettings();

  return (
    <div
      className="fixed z-[9999] py-1.5 px-1 bg-[#181920]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl text-xs text-slate-200 min-w-[200px] flex flex-col gap-0.5 animate-in fade-in duration-100"
      style={{ left: `${x}px`, top: `${y}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 mb-0.5">
        Windows Desktop
      </div>

      <button
        onClick={() => {
          onOpenSettings('widgets');
          onClose();
        }}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/10 text-left transition-colors"
      >
        <Plus className="w-3.5 h-3.5 text-emerald-400" />
        <span>Add widget...</span>
      </button>

      <button
        onClick={() => {
          onRefreshAll();
          onClose();
        }}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/10 text-left transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Refresh all widgets</span>
      </button>

      <button
        onClick={() => {
          updateSettings({ snapToGrid: !settings.snapToGrid });
          onClose();
        }}
        className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-white/10 text-left transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <Grid className="w-3.5 h-3.5" />
          <span>Snap to grid</span>
        </span>
        {settings.snapToGrid && <Check className="w-3.5 h-3.5 text-emerald-400" />}
      </button>

      <div className="h-px bg-white/5 my-0.5" />

      <button
        onClick={() => {
          widgetActions.resetLayout();
          onClose();
        }}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/10 text-left transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset widgets layout</span>
      </button>

      <button
        onClick={() => {
          onOpenSettings('desktop');
          onClose();
        }}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/10 text-left transition-colors"
      >
        <Image className="w-3.5 h-3.5" />
        <span>Change wallpaper...</span>
      </button>

      <div className="h-px bg-white/5 my-0.5" />

      <button
        onClick={() => {
          onOpenSettings('general');
          onClose();
        }}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/10 text-left transition-colors"
      >
        <Settings className="w-3.5 h-3.5" />
        <span>DevWidgets Settings</span>
      </button>
    </div>
  );
};
