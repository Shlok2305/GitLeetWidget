import { AppSettings, DEFAULT_SETTINGS } from '../types/settings';
import { WidgetInstance } from '../types/widgets';

const SETTINGS_KEY = 'devwidgets_settings_v1';
const WIDGETS_KEY = 'devwidgets_widgets_v1';

export const DEFAULT_WIDGETS: WidgetInstance[] = [
  {
    id: 'widget-github-1',
    type: 'github',
    title: 'GitHub Activity',
    x: 40,
    y: 40,
    width: 440,
    height: 310,
    minWidth: 320,
    minHeight: 240,
    zIndex: 10,
    visible: true,
    timeframe: '6m',
    transparent: false,
    opacity: 0.94,
    blur: 16,
  },
  {
    id: 'widget-leetcode-1',
    type: 'leetcode',
    title: 'LeetCode Progress',
    x: 504,
    y: 40,
    width: 440,
    height: 310,
    minWidth: 320,
    minHeight: 240,
    zIndex: 11,
    visible: true,
    transparent: false,
    opacity: 0.94,
    blur: 16,
  },
  {
    id: 'widget-combined-1',
    type: 'combined',
    title: 'Coding Progress Dashboard',
    x: 40,
    y: 374,
    width: 610,
    height: 340,
    minWidth: 400,
    minHeight: 280,
    zIndex: 12,
    visible: true,
    transparent: false,
    opacity: 0.94,
    blur: 16,
  },
  {
    id: 'widget-daily-1',
    type: 'daily',
    title: "Today's Progress",
    x: 674,
    y: 374,
    width: 270,
    height: 340,
    minWidth: 220,
    minHeight: 250,
    zIndex: 13,
    visible: true,
    transparent: false,
    opacity: 0.94,
    blur: 16,
  },
  {
    id: 'widget-goal-1',
    type: 'goal',
    title: 'Monthly Goals',
    x: 968,
    y: 40,
    width: 320,
    height: 310,
    minWidth: 260,
    minHeight: 240,
    zIndex: 14,
    visible: true,
    transparent: false,
    opacity: 0.94,
    blur: 16,
  },
  {
    id: 'widget-stats-1',
    type: 'quickStats',
    title: 'Quick Stats',
    x: 968,
    y: 374,
    width: 320,
    height: 340,
    minWidth: 240,
    minHeight: 240,
    zIndex: 15,
    visible: true,
    transparent: false,
    opacity: 0.94,
    blur: 16,
  },
];

export function loadSettingsFromStorage(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      goals: {
        ...DEFAULT_SETTINGS.goals,
        ...(parsed.goals || {}),
      },
    };
  } catch (e) {
    console.warn('Failed to load settings from storage, using defaults:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettingsToStorage(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadWidgetsFromStorage(): WidgetInstance[] {
  try {
    const raw = localStorage.getItem(WIDGETS_KEY);
    if (!raw) return DEFAULT_WIDGETS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_WIDGETS;
  } catch (e) {
    console.warn('Failed to load widgets from storage, using defaults:', e);
    return DEFAULT_WIDGETS;
  }
}

export function saveWidgetsToStorage(widgets: WidgetInstance[]): void {
  try {
    localStorage.setItem(WIDGETS_KEY, JSON.stringify(widgets));
  } catch (e) {
    console.error('Failed to save widgets:', e);
  }
}
