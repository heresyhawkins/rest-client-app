import { useState } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetcher = async <T>(
    url: string,
    options?: RequestInit
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          `HTTP ${response.status}: ${data.message || 'Server error'}`
        );
      }

      return await response.json();
    } catch (err) {
      if (err instanceof Error) {
        if (
          err.message.includes('Failed to fetch') ||
          err.message.includes('Network')
        ) {
          setError(
            'Failed to connect to the server. Please check your internet connection or CORS settings.'
          );
        } else {
          throw err;
        }
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }

    return null;
  };

  return { fetcher, loading, error };
};
