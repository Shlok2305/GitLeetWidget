import { LeetCodeStats, LeetCodeDayActivity, LeetCodeSubmissionItem } from '../../types/leetcode';
import { calculateStreaks } from '../../utils/streak';
import { fetchLeetCodeStatsFromApi } from './leetcodeApi';

const LEETCODE_CACHE_PREFIX = 'devwidgets_lc_cache_';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function getLeetCodeStats(username: string, forceRefresh = false): Promise<LeetCodeStats> {
  const cleanUsername = username.trim();
  if (!cleanUsername) {
    throw new Error('Please enter a LeetCode username');
  }

  const cacheKey = `${LEETCODE_CACHE_PREFIX}${cleanUsername.toLowerCase()}`;

  // Check cache first
  if (!forceRefresh) {
    try {
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        const age = Date.now() - new Date(cached.lastUpdated).getTime();
        // Verify cache has calendar/activityDays with actual counts
        if (
          age < CACHE_TTL_MS &&
          cached.activityDays &&
          cached.activityDays.length > 0 &&
          cached.calendarData &&
          Object.keys(cached.calendarData).length > 0
        ) {
          return {
            ...cached,
            isLoading: false,
            error: null,
          };
        }
      }
    } catch (e) {
      console.warn('Failed reading LeetCode cache:', e);
    }
  }

  try {
    const raw = await fetchLeetCodeStatsFromApi(cleanUsername);

    // Parse calendar data
    let calendarMap: Record<string, number> = {};
    if (typeof raw.submissionCalendar === 'string') {
      try {
        calendarMap = JSON.parse(raw.submissionCalendar || '{}');
      } catch {
        calendarMap = {};
      }
    } else if (typeof raw.submissionCalendar === 'object' && raw.submissionCalendar !== null) {
      calendarMap = raw.submissionCalendar;
    }

    // Convert epoch seconds to local YYYY-MM-DD
    const dateCounts: Record<string, number> = {};
    Object.entries(calendarMap).forEach(([tsSec, count]) => {
      const timestampMs = parseInt(tsSec, 10) * 1000;
      if (!isNaN(timestampMs)) {
        const d = new Date(timestampMs);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + Number(count);
      }
    });

    // Generate past 365 days up to today
    const activityDays: LeetCodeDayActivity[] = [];
    const now = new Date();
    const todayYear = now.getFullYear();
    const todayMonth = String(now.getMonth() + 1).padStart(2, '0');
    const todayDate = String(now.getDate()).padStart(2, '0');
    const todayStr = `${todayYear}-${todayMonth}-${todayDate}`;

    // Start of current week (Monday)
    const startOfWeek = new Date(now);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // Start of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let solvedToday = 0;
    let solvedThisWeek = 0;
    let solvedThisMonth = 0;

    for (let i = 365; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const count = dateCounts[dateStr] || 0;

      // LeetCode levels: 0 = none, 1 = 1-2 solved, 2 = 3-5 solved, 3 = 6+ solved
      let level: 0 | 1 | 2 | 3 = 0;
      if (count >= 6) level = 3;
      else if (count >= 3) level = 2;
      else if (count >= 1) level = 1;

      activityDays.push({
        date: dateStr,
        count,
        level,
      });

      if (dateStr === todayStr) {
        solvedToday = count;
      }
      const itemDate = new Date(`${dateStr}T00:00:00`);
      if (itemDate >= startOfWeek && itemDate <= now) {
        solvedThisWeek += count;
      }
      if (itemDate >= startOfMonth && itemDate <= now) {
        solvedThisMonth += count;
      }
    }

    const { currentStreak } = calculateStreaks(activityDays);

    // Map recent submissions if returned by API
    const recentSubmissions: LeetCodeSubmissionItem[] = (raw.recentSubmissions || []).map(
      (sub, index) => {
        let tsIso = new Date().toISOString();
        const tsNum = Number(sub.timestamp);
        if (!isNaN(tsNum)) {
          tsIso = new Date(tsNum * 1000).toISOString();
        }
        return {
          id: String(index + 1),
          title: sub.title,
          titleSlug: sub.titleSlug,
          timestamp: tsIso,
          statusDisplay: sub.statusDisplay,
          lang: sub.lang,
        };
      }
    );

    const result: LeetCodeStats = {
      username: cleanUsername,
      avatarUrl: raw.avatar || `https://assets.leetcode.com/users/default_avatar.jpg`,
      profileUrl: `https://leetcode.com/u/${cleanUsername}`,
      totalSolved: raw.totalSolved || 0,
      totalQuestions: raw.totalQuestions || 4060,
      easySolved: raw.easySolved || 0,
      totalEasy: raw.totalEasy || 966,
      mediumSolved: raw.mediumSolved || 0,
      totalMedium: raw.totalMedium || 2117,
      hardSolved: raw.hardSolved || 0,
      totalHard: raw.totalHard || 977,
      acceptanceRate: Math.round((raw.acceptanceRate || 0) * 10) / 10,
      ranking: raw.ranking || null,
      contributionPoints: raw.contributionPoints,
      reputation: raw.reputation,
      solvedToday,
      solvedThisWeek,
      solvedThisMonth,
      currentStreak,
      calendarData: calendarMap,
      activityDays,
      recentSubmissions,
      lastUpdated: new Date().toISOString(),
      isLoading: false,
      error: null,
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(result));
    } catch (e) {
      console.warn('Failed saving LeetCode cache:', e);
    }

    return result;
  } catch (err: any) {
    // If cache available, return it with error badge
    try {
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        return {
          ...cached,
          isLoading: false,
          error: `Offline/Notice: ${err.message || 'Unable to refresh'}. Showing cached data.`,
        };
      }
    } catch {}

    throw new Error(err.message || 'Unable to load LeetCode data');
  }
}
