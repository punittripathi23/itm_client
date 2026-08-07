import { useState, useEffect, useCallback } from 'react';

export const useFetch = (fetchFn, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate real api delay
      await new Promise(resolve => setTimeout(resolve, 600));
      const response = await fetchFn(...args);
      setData(response);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
      throw err;
    }
  }, [fetchFn]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute };
};
