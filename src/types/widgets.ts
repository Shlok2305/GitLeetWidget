export type WidgetType =
  | 'github'
  | 'leetcode'
  | 'combined'
  | 'daily'
  | 'goal'
  | 'quickStats';

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetSize {
  width: number;
  height: number;
}

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  zIndex: number;
  isMinimized?: boolean;
  isPinned?: boolean; // Always on top
  transparent?: boolean;
  opacity?: number; // 0.2 to 1
  blur?: number; // 0 to 24px
  customTitle?: string;
  timeframe?: '3m' | '6m' | '12m' | 'all';
  visible: boolean;
}

export interface DragState {
  isDragging: boolean;
  widgetId: string | null;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}

export interface ResizeState {
  isResizing: boolean;
  widgetId: string | null;
  direction: 'se' | 's' | 'e';
  startX: number;
  startY: number;
  initialWidth: number;
  initialHeight: number;
}
