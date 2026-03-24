'use client';

import { useState, useEffect, useCallback } from 'react';
import { createLocalStorageTracker, UsageTracker, getDailyLimit } from './usageTracker';

export function useUsageTracker(isLoggedIn: boolean, isPro: boolean = false) {
  const [tracker, setTracker] = useState<UsageTracker | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    // Pro users have unlimited usage, no need for tracker
    if (isPro) {
      setTracker(null);
      setRemaining(Infinity);
      return;
    }

    const newTracker = createLocalStorageTracker(isLoggedIn);
    setTracker(newTracker);
    setRemaining(newTracker.getRemaining());
  }, [isLoggedIn, isPro]);

  const checkAndIncrement = useCallback(() => {
    // Pro users always have unlimited access
    if (isPro) {
      return true;
    }

    if (!tracker) return false;

    if (tracker.isLimitReached()) {
      setShowLimitModal(true);
      return false;
    }

    const success = tracker.incrementUsage();
    if (success) {
      setRemaining(tracker.getRemaining());
    }
    return success;
  }, [tracker, isPro]);

  const refresh = useCallback(() => {
    if (tracker) {
      setRemaining(tracker.getRemaining());
    }
  }, [tracker]);

  const closeLimitModal = useCallback(() => {
    setShowLimitModal(false);
  }, []);

  const dailyLimit = isPro ? Infinity : getDailyLimit(isLoggedIn);

  return {
    remaining,
    dailyLimit,
    showLimitModal,
    checkAndIncrement,
    refresh,
    closeLimitModal,
  };
}
