'use client';

import { useState, useEffect, useCallback } from 'react';
import { createLocalStorageTracker, UsageTracker, getDailyLimit } from './usageTracker';

export function useUsageTracker(isLoggedIn: boolean) {
  const [tracker, setTracker] = useState<UsageTracker | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    const newTracker = createLocalStorageTracker(isLoggedIn);
    setTracker(newTracker);
    setRemaining(newTracker.getRemaining());
  }, [isLoggedIn]);

  const checkAndIncrement = useCallback(() => {
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
  }, [tracker]);

  const refresh = useCallback(() => {
    if (tracker) {
      setRemaining(tracker.getRemaining());
    }
  }, [tracker]);

  const closeLimitModal = useCallback(() => {
    setShowLimitModal(false);
  }, []);

  const dailyLimit = getDailyLimit(isLoggedIn);

  return {
    remaining,
    dailyLimit,
    showLimitModal,
    checkAndIncrement,
    refresh,
    closeLimitModal,
  };
}
