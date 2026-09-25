export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // 0=none, 1=light, 2=medium, 3=high, 4=very high
}

export interface GitHubStats {
  username: string;
  name: string;
  avatarUrl: string;
  profileUrl: string;
  totalContributionsThisYear: number;
  totalContributionsOverall: number;
  currentStreak: number;
  longestStreak: number;
  contributionsThisWeek: number;
  contributionsThisMonth: number;
  contributionsToday: number;
  days: ContributionDay[];
  lastUpdated: string;
  isLoading: boolean;
  error: string | null;
}
