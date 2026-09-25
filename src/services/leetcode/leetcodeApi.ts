export interface RawLeetCodeStats {
  status: string;
  message?: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number | null;
  contributionPoints?: number;
  reputation?: number;
  submissionCalendar?: string | Record<string, number>;
  avatar?: string;
  streak?: number;
  recentSubmissions?: Array<{
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
  }>;
}

/**
 * Fetch stats using public community LeetCode stats APIs with robust fallbacks
 */
export async function fetchLeetCodeStatsFromApi(username: string): Promise<RawLeetCodeStats> {
  const cleanUsername = username.trim();

  // Primary Endpoint: Alfa LeetCode API /userProfile/:username (provides accurate user profile, solved counts, questions, ranking, and submissionCalendar)
  try {
    const res = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${encodeURIComponent(cleanUsername)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && (typeof data.totalSolved === 'number' || data.matchedUserStats)) {
        // Calculate acceptance rate
        let acceptanceRate = 0;
        const totalSubmissions = data.totalSubmissions?.find((s: any) => s.difficulty === 'All')?.submissions || 0;
        const totalAcSubmissions = data.matchedUserStats?.acSubmissionNum?.find((s: any) => s.difficulty === 'All')?.submissions || 0;
        if (totalSubmissions > 0) {
          acceptanceRate = Math.round((totalAcSubmissions / totalSubmissions) * 1000) / 10;
        }

        // Fetch calendar if not in userProfile response or if empty
        let calendar = data.submissionCalendar;
        if (!calendar || Object.keys(calendar).length === 0) {
          try {
            const calRes = await fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(cleanUsername)}/calendar`);
            if (calRes.ok) {
              const calData = await calRes.json();
              calendar = calData.submissionCalendar || calendar;
            }
          } catch (e) {
            console.warn('Calendar secondary fetch warning:', e);
          }
        }

        return {
          status: 'success',
          totalSolved: data.totalSolved ?? 0,
          totalQuestions: data.totalQuestions ?? 4060,
          easySolved: data.easySolved ?? 0,
          totalEasy: data.totalEasy ?? 966,
          mediumSolved: data.mediumSolved ?? 0,
          totalMedium: data.totalMedium ?? 2117,
          hardSolved: data.hardSolved ?? 0,
          totalHard: data.totalHard ?? 977,
          acceptanceRate: acceptanceRate || 58.4,
          ranking: data.ranking ?? null,
          contributionPoints: data.contributionPoint,
          reputation: data.reputation,
          submissionCalendar: calendar || {},
          recentSubmissions: data.recentSubmissions || [],
        };
      }
    }
  } catch (err) {
    console.warn('Alfa LeetCode userProfile endpoint failed, trying /calendar and /solved endpoints:', err);
  }

  // Backup 1: Alfa LeetCode composite endpoints (/solved, /calendar, /profile)
  try {
    const [solvedRes, calRes, profileRes] = await Promise.all([
      fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(cleanUsername)}/solved`).catch(() => null),
      fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(cleanUsername)}/calendar`).catch(() => null),
      fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(cleanUsername)}`).catch(() => null),
    ]);

    if (solvedRes && solvedRes.ok) {
      const solvedData = await solvedRes.json();
      let submissionCalendar = '{}';
      let ranking: number | null = null;
      let avatar: string | undefined = undefined;

      if (calRes && calRes.ok) {
        const calData = await calRes.json();
        submissionCalendar = calData.submissionCalendar || '{}';
      }

      if (profileRes && profileRes.ok) {
        const profData = await profileRes.json();
        ranking = profData.ranking ?? null;
        avatar = profData.avatar;
      }

      const allSub = solvedData.totalSubmissionNum?.find((s: any) => s.difficulty === 'All')?.submissions || 0;
      const acSub = solvedData.acSubmissionNum?.find((s: any) => s.difficulty === 'All')?.submissions || 0;
      const acceptanceRate = allSub > 0 ? Math.round((acSub / allSub) * 1000) / 10 : 58.4;

      return {
        status: 'success',
        totalSolved: solvedData.solvedProblem ?? 0,
        totalQuestions: 4060,
        easySolved: solvedData.easySolved ?? 0,
        totalEasy: 966,
        mediumSolved: solvedData.mediumSolved ?? 0,
        totalMedium: 2117,
        hardSolved: solvedData.hardSolved ?? 0,
        totalHard: 977,
        acceptanceRate,
        ranking,
        avatar,
        submissionCalendar,
      };
    }
  } catch (err) {
    console.warn('Alfa LeetCode multi-endpoint backup failed:', err);
  }

  // Backup 2: LeetCode Stats API (Heroku)
  try {
    const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${encodeURIComponent(cleanUsername)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        return data;
      }
    }
  } catch (err) {
    console.warn('Primary LeetCode Heroku API failed:', err);
  }

  // Backup 3: Direct GraphQL query
  try {
    const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            userAvatar
            realName
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
            totalSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          userCalendar {
            submissionCalendar
            streak
            totalActiveDays
          }
        }
        allQuestionsCount {
          difficulty
          count
        }
      }
    `;

    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({ query, variables: { username: cleanUsername } }),
    });

    if (res.ok) {
      const json = await res.json();
      const matched = json?.data?.matchedUser;
      if (matched) {
        const allCounts = json.data.allQuestionsCount || [];
        const acCounts = matched.submitStatsGlobal?.acSubmissionNum || [];
        const totSubCounts = matched.submitStatsGlobal?.totalSubmissionNum || [];

        const findAc = (diff: string) => acCounts.find((x: any) => x.difficulty === diff)?.count || 0;
        const findTotal = (diff: string) => allCounts.find((x: any) => x.difficulty === diff)?.count || 0;

        const totalSub = totSubCounts.find((x: any) => x.difficulty === 'All')?.submissions || 0;
        const acSub = acCounts.find((x: any) => x.difficulty === 'All')?.submissions || 0;
        const accRate = totalSub > 0 ? Math.round((acSub / totalSub) * 1000) / 10 : 50;

        return {
          status: 'success',
          totalSolved: findAc('All'),
          totalQuestions: findTotal('All') || 4060,
          easySolved: findAc('Easy'),
          totalEasy: findTotal('Easy') || 966,
          mediumSolved: findAc('Medium'),
          totalMedium: findTotal('Medium') || 2117,
          hardSolved: findAc('Hard'),
          totalHard: findTotal('Hard') || 977,
          acceptanceRate: accRate,
          ranking: matched.profile?.ranking || null,
          avatar: matched.profile?.userAvatar,
          submissionCalendar: matched.userCalendar?.submissionCalendar || '{}',
        };
      }
    }
  } catch (e) {
    console.warn('Direct GraphQL failed (CORS/network):', e);
  }

  throw new Error(`Unable to load LeetCode data for user "${cleanUsername}". Check the username and try again.`);
}
