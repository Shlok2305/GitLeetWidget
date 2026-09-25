import { useState, useEffect } from 'react';
import { WidgetInstance, WidgetType } from '../types/widgets';
import { DEFAULT_WIDGETS, loadWidgetsFromStorage, saveWidgetsToStorage } from '../utils/storage';

let currentWidgets: WidgetInstance[] = loadWidgetsFromStorage();
let maxZIndex = Math.max(20, ...currentWidgets.map((w) => w.zIndex || 10));
const listeners = new Set<(widgets: WidgetInstance[]) => void>();

function notify() {
  saveWidgetsToStorage(currentWidgets);
  listeners.forEach((listener) => listener([...currentWidgets]));
}

export function getWidgets(): WidgetInstance[] {
  return currentWidgets;
}

export function updateWidgetPosition(id: string, x: number, y: number): void {
  currentWidgets = currentWidgets.map((w) => (w.id === id ? { ...w, x, y } : w));
  notify();
}

export function updateWidgetSize(id: string, width: number, height: number): void {
  currentWidgets = currentWidgets.map((w) => {
    if (w.id === id) {
      return {
        ...w,
        width: Math.max(w.minWidth, width),
        height: Math.max(w.minHeight, height),
      };
    }
    return w;
  });
  notify();
}

export function bringWidgetToFront(id: string): void {
  maxZIndex += 1;
  currentWidgets = currentWidgets.map((w) => (w.id === id ? { ...w, zIndex: maxZIndex } : w));
  notify();
}

export function toggleWidgetVisibility(id: string): void {
  currentWidgets = currentWidgets.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w));
  notify();
}

export function setWidgetPinned(id: string, isPinned: boolean): void {
  currentWidgets = currentWidgets.map((w) => (w.id === id ? { ...w, isPinned } : w));
  notify();
}

export function setWidgetTransparency(id: string, transparent: boolean, opacity?: number): void {
  currentWidgets = currentWidgets.map((w) =>
    w.id === id
      ? {
          ...w,
          transparent,
          opacity: opacity !== undefined ? opacity : w.opacity,
        }
      : w
  );
  notify();
}

export function setWidgetTimeframe(id: string, timeframe: '3m' | '6m' | '12m' | 'all'): void {
  currentWidgets = currentWidgets.map((w) => (w.id === id ? { ...w, timeframe } : w));
  notify();
}

export function resetWidgetsLayout(): void {
  currentWidgets = DEFAULT_WIDGETS.map((w) => ({ ...w }));
  maxZIndex = 20;
  notify();
}

export function removeWidget(id: string): void {
  currentWidgets = currentWidgets.filter((w) => w.id !== id);
  notify();
}

export function addWidget(type: WidgetType): void {
  maxZIndex += 1;
  const newId = `widget-${type}-${Date.now()}`;
  let title = 'New Widget';
  let width = 380;
  let height = 280;
  let minWidth = 260;
  let minHeight = 220;

  switch (type) {
    case 'github':
      title = 'GitHub Activity';
      width = 440;
      height = 310;
      break;
    case 'leetcode':
      title = 'LeetCode Progress';
      width = 440;
      height = 310;
      break;
    case 'combined':
      title = 'Coding Progress Dashboard';
      width = 610;
      height = 340;
      minWidth = 380;
      break;
    case 'daily':
      title = "Today's Progress";
      width = 270;
      height = 340;
      break;
    case 'goal':
      title = 'Monthly Goals';
      width = 320;
      height = 310;
      break;
    case 'quickStats':
      title = 'Quick Stats';
      width = 320;
      height = 340;
      break;
  }

  const newWidget: WidgetInstance = {
    id: newId,
    type,
    title,
    x: 80 + (currentWidgets.length % 6) * 30,
    y: 80 + (currentWidgets.length % 6) * 30,
    width,
    height,
    minWidth,
    minHeight,
    zIndex: maxZIndex,
    visible: true,
    transparent: false,
    opacity: 0.94,
    blur: 16,
  };

  currentWidgets = [...currentWidgets, newWidget];
  notify();
}

export function useWidgets(): [WidgetInstance[], typeof widgetActions] {
  const [widgets, setLocalWidgets] = useState<WidgetInstance[]>(currentWidgets);

  useEffect(() => {
    const handleUpdate = (updated: WidgetInstance[]) => {
      setLocalWidgets([...updated]);
    };
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return [widgets, widgetActions];
}

export const widgetActions = {
  updatePosition: updateWidgetPosition,
  updateSize: updateWidgetSize,
  bringToFront: bringWidgetToFront,
  toggleVisibility: toggleWidgetVisibility,
  setPinned: setWidgetPinned,
  setTransparency: setWidgetTransparency,
  setTimeframe: setWidgetTimeframe,
  resetLayout: resetWidgetsLayout,
  removeWidget,
  addWidget,
};
