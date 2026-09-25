export interface LeetCodeSubmissionItem {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

export interface LeetCodeDayActivity {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3; // 0=none, 1=1 solved, 2=2-3 solved, 3=4+ solved
}

export interface LeetCodeStats {
  username: string;
  avatarUrl: string;
  profileUrl: string;
  totalSolved: number;
  totalQuestions: number; // e.g. 4060
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number; // percentage
  ranking: number | null;
  contributionPoints?: number;
  reputation?: number;
  contestRating?: number | null;
  solvedToday: number;
  solvedThisWeek: number;
  solvedThisMonth: number;
  currentStreak: number;
  calendarData: Record<string, number>; // timestamp in seconds -> count
  activityDays: LeetCodeDayActivity[];
  recentSubmissions: LeetCodeSubmissionItem[];
  lastUpdated: string;
  isLoading: boolean;
  error: string | null;
}
