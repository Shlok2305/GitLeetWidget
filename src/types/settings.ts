export interface GoalTargets {
  monthlyLeetcode: number;
  weeklyLeetcode: number;
  dailyLeetcode: number;
  monthlyGithubDays: number;
  weeklyGithubDays: number;
  dailyGithubContributions: number;
}

export interface AppSettings {
  // General
  theme: 'dark' | 'amoled' | 'light';
  accentColor: 'green' | 'emerald' | 'cyan' | 'amber' | 'blue';
  globalOpacity: number; // 0.2 to 1.0 (default: 0.92)
  globalBlur: number; // 0 to 24 (default: 16)
  alwaysOnTop: boolean;
  startWithWindows: boolean;
  autoRefreshIntervalMinutes: number; // 5, 15, 30, 60
  snapToGrid: boolean;
  gridSize: number; // e.g. 16px

  // Desktop Simulator / Appearance
  desktopWallpaper: string;
  desktopScale: number; // 1, 1.25, 1.5 DPI scaling
  showTaskbar: boolean;
  showDesktopIcons: boolean;
  framelessMode: boolean; // whether to hide outer window borders

  // Accounts
  githubUsername: string;
  githubToken?: string;
  leetcodeUsername: string;

  // Goals
  goals: GoalTargets;

  // Cache settings
  lastGithubRefresh?: string;
  lastLeetcodeRefresh?: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accentColor: 'green',
  globalOpacity: 0.92,
  globalBlur: 16,
  alwaysOnTop: false,
  startWithWindows: true,
  autoRefreshIntervalMinutes: 30,
  snapToGrid: true,
  gridSize: 12,

  desktopWallpaper: 'bloom-dark',
  desktopScale: 1,
  showTaskbar: true,
  showDesktopIcons: true,
  framelessMode: false,

  githubUsername: 'torvalds', // default popular profile with active data
  leetcodeUsername: 'neal_wu', // popular active LeetCode user

  goals: {
    monthlyLeetcode: 80,
    weeklyLeetcode: 20,
    dailyLeetcode: 3,
    monthlyGithubDays: 25,
    weeklyGithubDays: 6,
    dailyGithubContributions: 5,
  },
};
