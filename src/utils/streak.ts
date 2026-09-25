export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  activeDaysCount: number;
}

export function calculateStreaks(days: Array<{ date: string; count: number }>): StreakResult {
  if (!days || days.length === 0) {
    return { currentStreak: 0, longestStreak: 0, activeDaysCount: 0 };
  }

  // Sort ascending by date
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

  let longestStreak = 0;
  let tempStreak = 0;
  let activeDaysCount = 0;

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].count > 0) {
      activeDaysCount++;
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Calculate current streak backwards from latest entry
  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const lastDay = sorted[sorted.length - 1];
  const secondLastDay = sorted.length > 1 ? sorted[sorted.length - 2] : null;

  // If today has count > 0, count backwards
  // If today has count 0 but yesterday has count > 0, streak is still alive
  let startIndex = -1;
  if (lastDay && lastDay.count > 0) {
    startIndex = sorted.length - 1;
  } else if (secondLastDay && secondLastDay.count > 0 && lastDay && lastDay.date === today) {
    startIndex = sorted.length - 2;
  }

  if (startIndex >= 0) {
    for (let i = startIndex; i >= 0; i--) {
      if (sorted[i].count > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    activeDaysCount,
  };
}
