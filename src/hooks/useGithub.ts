import { useState, useEffect, useCallback, useRef } from 'react';
import { GitHubStats } from '../types/github';
import { getGitHubStats } from '../services/github/githubService';
import { useSettings } from '../store/settingsStore';

export function useGithub() {
  const [settings] = useSettings();
  const [data, setData] = useState<GitHubStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const activeUserRef = useRef(settings.githubUsername);

  const fetchData = useCallback(
    async (force = false) => {
      if (!settings.githubUsername) {
        setIsLoading(false);
        setError('GitHub username not configured');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const stats = await getGitHubStats(
          settings.githubUsername,
          settings.githubToken,
          force
        );
        setData(stats);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch GitHub stats');
      } finally {
        setIsLoading(false);
      }
    },
    [settings.githubUsername, settings.githubToken]
  );

  // Initial fetch and on username/token change
  useEffect(() => {
    activeUserRef.current = settings.githubUsername;
    fetchData(false);
  }, [settings.githubUsername, settings.githubToken, fetchData]);

  // Periodic auto-refresh
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
