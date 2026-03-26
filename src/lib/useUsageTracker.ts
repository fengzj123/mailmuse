'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDailyLimit } from './usageTracker';

const FREE_DAILY_LIMIT = 5;

interface UsageData {
  remaining: number;
  usedToday: number;
  dailyLimit: number;
}

export function useUsageTracker(isLoggedIn: boolean, isPro: boolean = false) {
  const [remaining, setRemaining] = useState(0);
  const [usedToday, setUsedToday] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const dailyLimit = isPro ? Infinity : FREE_DAILY_LIMIT;

  // Fetch usage from server when logged in
  const fetchUsage = useCallback(async () => {
    if (!isLoggedIn || isPro) {
      setRemaining(Infinity);
      setUsedToday(0);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/usage/check');
      const data: UsageData = await res.json();
      setRemaining(data.remaining);
      setUsedToday(data.usedToday);
    } catch (error) {
      console.error('Failed to fetch usage:', error);
      // If fetch fails, assume they can try (server will validate)
      setRemaining(FREE_DAILY_LIMIT);
      setUsedToday(0);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, isPro]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const checkAndIncrement = useCallback(() => {
    // Pro users always have unlimited access
    if (isPro) {
      return true;
    }

    if (remaining <= 0) {
      setShowLimitModal(true);
      return false;
    }

    return true;
  }, [remaining, isPro]);

  const decrement = useCallback(() => {
    // Called after successful API request to decrement locally
    // This is optimistic - the server is authoritative
    setRemaining(prev => Math.max(0, prev - 1));
    setUsedToday(prev => prev + 1);
  }, []);

  const refresh = useCallback(() => {
    fetchUsage();
  }, [fetchUsage]);

  const closeLimitModal = useCallback(() => {
    setShowLimitModal(false);
  }, []);

  return {
    remaining,
    usedToday,
    dailyLimit,
    showLimitModal,
    checkAndIncrement,
    decrement,
    refresh,
    closeLimitModal,
    loading,
  };
}
