// Usage tracking abstraction - can be swapped to database later

export interface UsageRecord {
  date: string; // YYYY-MM-DD format
  count: number;
}

export interface UsageTracker {
  getRemaining(): number;
  getTodayUsage(): number;
  incrementUsage(): boolean; // returns false if limit reached
  isLimitReached(): boolean;
}

// LocalStorage implementation
const STORAGE_KEY = 'mailcraftus_usage';
const DAILY_LIMIT_LOGGED_IN = 10;
const DAILY_LIMIT_GUEST = 3;

function getDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function getStoredUsage(): UsageRecord {
  if (typeof window === 'undefined') {
    return { date: getDateString(), count: 0 };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { date: getDateString(), count: 0 };
  }

  try {
    const record: UsageRecord = JSON.parse(stored);
    // Reset if it's a new day
    const today = getDateString();
    if (record.date !== today) {
      return { date: today, count: 0 };
    }
    return record;
  } catch {
    return { date: getDateString(), count: 0 };
  }
}

function saveUsage(record: UsageRecord): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export function createLocalStorageTracker(isLoggedIn: boolean): UsageTracker {
  const limit = isLoggedIn ? DAILY_LIMIT_LOGGED_IN : DAILY_LIMIT_GUEST;

  return {
    getRemaining(): number {
      const record = getStoredUsage();
      return Math.max(0, limit - record.count);
    },

    getTodayUsage(): number {
      return getStoredUsage().count;
    },

    isLimitReached(): boolean {
      return this.getTodayUsage() >= limit;
    },

    incrementUsage(): boolean {
      const record = getStoredUsage();
      if (record.count >= limit) {
        return false;
      }
      record.count += 1;
      saveUsage(record);
      return true;
    },
  };
}

export function getDailyLimit(isLoggedIn: boolean): number {
  return isLoggedIn ? DAILY_LIMIT_LOGGED_IN : DAILY_LIMIT_GUEST;
}
