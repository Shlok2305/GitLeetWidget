import { useState, useEffect, useCallback, useRef } from 'react';
import { LeetCodeStats } from '../types/leetcode';
import { getLeetCodeStats } from '../services/leetcode/leetcodeService';
import { useSettings } from '../store/settingsStore';

export function useLeetcode() {
  const [settings] = useSettings();
  const [data, setData] = useState<LeetCodeStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const activeUserRef = useRef(settings.leetcodeUsername);

  const fetchData = useCallback(
    async (force = false) => {
      if (!settings.leetcodeUsername) {
        setIsLoading(false);
        setError('LeetCode username not configured');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const stats = await getLeetCodeStats(settings.leetcodeUsername, force);
        setData(stats);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch LeetCode stats');
      } finally {
        setIsLoading(false);
      }
    },
    [settings.leetcodeUsername]
  );

  useEffect(() => {
    activeUserRef.current = settings.leetcodeUsername;
    fetchData(false);
  }, [settings.leetcodeUsername, fetchData]);

  useEffect(() => {
    const minutes = Math.max(5, settings.autoRefreshIntervalMinutes || 30);
    const interval = setInterval(() => {
      fetchData(true);
    }, minutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [settings.autoRefreshIntervalMinutes, fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: () => fetchData(true),
    lastUpdated: data?.lastUpdated,
  };
}
