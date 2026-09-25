import { GitHubStats } from '../../types/github';
import { calculateStreaks } from '../../utils/streak';
import { fetchGitHubUserProfile, fetchGitHubContributions } from './githubApi';

const GITHUB_CACHE_PREFIX = 'devwidgets_gh_cache_';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache

export async function getGitHubStats(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<GitHubStats> {
  const cleanUsername = username.trim();
  if (!cleanUsername) {
    throw new Error('Please enter a GitHub username');
  }

  const cacheKey = `${GITHUB_CACHE_PREFIX}${cleanUsername.toLowerCase()}`;

  // Check localStorage cache if not forced
  if (!forceRefresh) {
    try {
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        const age = Date.now() - new Date(cached.lastUpdated).getTime();
        if (age < CACHE_TTL_MS && cached.days && cached.days.length > 0) {
          return {
            ...cached,
            isLoading: false,
            error: null,
          };
        }
      }
    } catch (e) {
      console.warn('Failed reading GitHub cache:', e);
    }
  }

  try {
    // Parallel fetch user profile & contribution graph
    const [profile, contributions] = await Promise.all([
      fetchGitHubUserProfile(cleanUsername, token).catch((err) => {
        console.warn('Profile fetch warning:', err);
        return {
          login: cleanUsername,
          id: 0,
          avatar_url: `https://github.com/${cleanUsername}.png`,
          name: cleanUsername,
          bio: 'Software Developer',
          public_repos: 0,
          followers: 0,
          following: 0,
          created_at: new Date().toISOString(),
          html_url: `https://github.com/${cleanUsername}`,
        };
      }),
      fetchGitHubContributions(cleanUsername, token),
    ]);

    const { currentStreak, longestStreak } = calculateStreaks(contributions.days);

    // Compute today, this week, this month contributions
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let contributionsToday = 0;
    let contributionsThisWeek = 0;
    let contributionsThisMonth = 0;

    contributions.days.forEach((d) => {
      if (d.date === todayStr) {
        contributionsToday += d.count;
      }
      const itemDate = new Date(d.date + 'T00:00:00');
      if (itemDate >= startOfWeek && itemDate <= now) {
        contributionsThisWeek += d.count;
      }
      if (itemDate >= startOfMonth && itemDate <= now) {
        contributionsThisMonth += d.count;
      }
    });

    const result: GitHubStats = {
      username: profile.login || cleanUsername,
      name: profile.name || profile.login || cleanUsername,
      avatarUrl: profile.avatar_url || `https://github.com/${cleanUsername}.png`,
      profileUrl: profile.html_url || `https://github.com/${cleanUsername}`,
      totalContributionsThisYear: contributions.totalThisYear,
      totalContributionsOverall: contributions.totalOverall,
      currentStreak,
      longestStreak,
      contributionsThisWeek,
      contributionsThisMonth,
      contributionsToday,
      days: contributions.days,
      lastUpdated: new Date().toISOString(),
      isLoading: false,
      error: null,
    };

    // Cache the result
    try {
      localStorage.setItem(cacheKey, JSON.stringify(result));
    } catch (e) {
      console.warn('Failed saving GitHub cache:', e);
    }

    return result;
  } catch (err: any) {
    // If we have stale cache, return it with error notice
    try {
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        return {
          ...cached,
          isLoading: false,
          error: `Offline/Error: ${err.message || 'Unable to update data'}. Showing cached data.`,
        };
      }
    } catch {}

    throw new Error(err.message || 'Unable to load GitHub data');
  }
}
