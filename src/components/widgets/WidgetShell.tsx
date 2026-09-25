import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Pin,
  RefreshCw,
  Settings,
  X,
  ExternalLink,
  Sliders,
  Move,
} from 'lucide-react';
import { WidgetInstance } from '../../types/widgets';
import { useSettings } from '../../store/settingsStore';
import { widgetActions } from '../../store/widgetStore';
import { formatRelativeTime } from '../../utils/date';
import { startNativeDragging } from '../../services/tauri/tauriBridge';

export interface WidgetShellProps {
  widget: WidgetInstance;
  title: string;
  icon?: React.ReactNode;
  lastUpdated?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  onOpenSettings?: () => void;
  onOpenExternal?: () => void;
  externalLabel?: string;
  headerControls?: React.ReactNode;
  children: React.ReactNode;
}

export const WidgetShell: React.FC<WidgetShellProps> = ({
  widget,
  title,
  icon,
  lastUpdated,
  isLoading = false,
  onRefresh,
  onOpenSettings,
  onOpenExternal,
  externalLabel,
  headerControls,
  children,
}) => {
  const [settings] = useSettings();
  const [isHovered, setIsHovered] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
    initX: number;
    initY: number;
  }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initX: widget.x,
    initY: widget.y,
  });

  const resizeRef = useRef<{
    isResizing: boolean;
    startX: number;
    startY: number;
    initW: number;
    initH: number;
  }>({
    isResizing: false,
    startX: 0,
    startY: 0,
    initW: widget.width,
    initH: widget.height,
  });

  // Dragging logic
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    // Only drag with left mouse button, not when clicking buttons
    if (e.button !== 0 || (e.target as HTMLElement).closest('button, a, input, select')) return;

    widgetActions.bringToFront(widget.id);
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initX: widget.x,
      initY: widget.y,
    };

    // If running in Tauri, start native window drag
    startNativeDragging();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragRef.current.isDragging) return;
      const dx = moveEvent.clientX - dragRef.current.startX;
      const dy = moveEvent.clientY - dragRef.current.startY;

      let newX = dragRef.current.initX + dx;
      let newY = dragRef.current.initY + dy;

      if (settings.snapToGrid && settings.gridSize > 0) {
        newX = Math.round(newX / settings.gridSize) * settings.gridSize;
        newY = Math.round(newY / settings.gridSize) * settings.gridSize;
      }

      // Constrain within visible viewport
      newX = Math.max(0, newX);
      newY = Math.max(0, newY);

      widgetActions.updatePosition(widget.id, newX, newY);
    };

    const handleMouseUp = () => {
      dragRef.current.isDragging = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Resizing logic
  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    widgetActions.bringToFront(widget.id);

    resizeRef.current = {
      isResizing: true,
      startX: e.clientX,
      startY: e.clientY,
      initW: widget.width,
      initH: widget.height,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeRef.current.isResizing) return;
      const dw = moveEvent.clientX - resizeRef.current.startX;
      const dh = moveEvent.clientY - resizeRef.current.startY;

      let newW = resizeRef.current.initW + dw;
      let newH = resizeRef.current.initH + dh;

      if (settings.snapToGrid && settings.gridSize > 0) {
        newW = Math.round(newW / settings.gridSize) * settings.gridSize;
        newH = Math.round(newH / settings.gridSize) * settings.gridSize;
      }

      newW = Math.max(widget.minWidth || 200, newW);
      newH = Math.max(widget.minHeight || 180, newH);

      widgetActions.updateSize(widget.id, newW, newH);
    };

    const handleMouseUp = () => {
      resizeRef.current.isResizing = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const closeMenu = () => setContextMenuPos(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const opacity = widget.opacity ?? settings.globalOpacity ?? 0.94;
  const blur = widget.blur ?? settings.globalBlur ?? 16;
  const isAmoled = settings.theme === 'amoled';

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={handleContextMenu}
      onClick={() => widgetActions.bringToFront(widget.id)}
      style={{
        position: 'absolute',
        left: `${widget.x}px`,
        top: `${widget.y}px`,
        width: `${widget.width}px`,
        height: `${widget.height}px`,
        zIndex: widget.isPinned ? 999 : widget.zIndex,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: isAmoled
          ? `rgba(0, 0, 0, ${opacity})`
          : `rgba(24, 25, 31, ${opacity})`,
      }}
      className={`widget-card rounded-[26px] border ${
        widget.isPinned ? 'border-emerald-500/40' : 'border-white/[0.08]'
      } shadow-2xl flex flex-col overflow-hidden text-slate-100 select-none group`}
    >
      {/* Widget Header */}
      <div
        onMouseDown={handleMouseDownHeader}
        className="px-4 pt-3.5 pb-2 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-white/[0.04]"
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="text-emerald-400 shrink-0">{icon}</span>}
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold tracking-tight text-white truncate">
              {title}
            </span>
            {lastUpdated && (
              <span className="text-[10px] text-slate-400 font-mono tracking-tight -mt-0.5">
                Updated {formatRelativeTime(lastUpdated)}
              </span>
            )}
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {headerControls}

          {onOpenExternal && (
            <button
              onClick={onOpenExternal}
              title={externalLabel || 'Open Profile'}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh Data"
              disabled={isLoading}
              className={`p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors ${
                isLoading ? 'animate-spin text-emerald-400' : ''
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => widgetActions.setPinned(widget.id, !widget.isPinned)}
            title={widget.isPinned ? 'Unpin' : 'Keep Always on Top'}
            className={`p-1 rounded-md transition-colors ${
              widget.isPinned
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              title="Settings"
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => widgetActions.removeWidget(widget.id)}
            title="Close Widget"
            className="p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Widget Body Content */}
      <div className="flex-1 p-3.5 overflow-hidden flex flex-col">{children}</div>

      {/* Resize Handle (bottom-right) */}
      <div
        onMouseDown={handleMouseDownResize}
        className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize flex items-center justify-center text-slate-500/40 hover:text-emerald-400 transition-colors"
        title="Resize Widget"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <circle cx="8" cy="8" r="1.2" />
          <circle cx="4" cy="8" r="1.2" />
          <circle cx="8" cy="4" r="1.2" />
        </svg>
      </div>

      {/* Right-Click Context Menu */}
      {contextMenuPos && (
        <div
          className="fixed z-50 py-1.5 px-1 bg-[#181920]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl text-xs text-slate-200 min-w-[170px] flex flex-col gap-0.5"
          style={{
            left: `${contextMenuPos.x}px`,
            top: `${contextMenuPos.y}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5 mb-1">
            {title}
          </div>
          {onRefresh && (
            <button
              onClick={() => {
                onRefresh();
                setContextMenuPos(null);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-white text-left transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh data</span>
            </button>
          )}
          <button
            onClick={() => {
              widgetActions.setPinned(widget.id, !widget.isPinned);
              setContextMenuPos(null);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-white text-left transition-colors"
          >
            <Pin className="w-3.5 h-3.5" />
            <span>{widget.isPinned ? 'Unpin' : 'Keep on top'}</span>
          </button>
          <button
            onClick={() => {
              widgetActions.setTransparency(widget.id, !widget.transparent, widget.transparent ? 0.94 : 0.7);
              setContextMenuPos(null);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-white text-left transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Toggle glass effect</span>
          </button>
          {onOpenExternal && (
            <button
              onClick={() => {
                onOpenExternal();
                setContextMenuPos(null);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-white text-left transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in browser</span>
            </button>
          )}
          {onOpenSettings && (
            <button
              onClick={() => {
                onOpenSettings();
                setContextMenuPos(null);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-white text-left transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          )}
          <div className="h-px bg-white/5 my-1" />
          <button
            onClick={() => {
              widgetActions.removeWidget(widget.id);
              setContextMenuPos(null);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-red-400 hover:bg-red-500/15 text-left transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove widget</span>
          </button>
        </div>
      )}
    </div>
  );
};
