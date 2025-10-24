"use client";

import { useEffect, useState, useCallback } from "react";

interface CacheEntry<T> {
  data: T[];
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

class SubmissionsCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  set<T>(key: string, data: T[]): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string): T[] | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if cache has expired
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  isExpired(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;
    return Date.now() - entry.timestamp > CACHE_DURATION;
  }
}

// Singleton instance
const cacheInstance = new SubmissionsCache();

export function useSubmissionsCache<T>(
  cacheKey: string,
  fetchFn: () => Promise<T[]>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = cacheInstance.get<T>(cacheKey);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      // Fetch fresh data
      const freshData = await fetchFn();
      cacheInstance.set(cacheKey, freshData);
      setData(freshData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error(`Error fetching ${cacheKey}:`, errorMessage);
    } finally {
      setLoading(false);
    }
  }, [cacheKey, fetchFn]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const invalidateCache = useCallback(() => {
    cacheInstance.clear(cacheKey);
    fetchData();
  }, [cacheKey, fetchData]);

  return {
    data,
    loading,
    error,
    invalidateCache,
    isCached: !cacheInstance.isExpired(cacheKey),
  };
}

export function clearAllCache() {
  cacheInstance.clear();
}

export function clearCacheKey(key: string) {
  cacheInstance.clear(key);
}
