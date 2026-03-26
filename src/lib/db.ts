import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export { client };

// Initialize database schema
export async function initDatabase() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      name TEXT,
      avatar_url TEXT,
      subscription_tier TEXT DEFAULT 'free' CHECK(subscription_tier IN ('free', 'pro')),
      plan_type TEXT CHECK(plan_type IN ('monthly', 'yearly')),
      paypal_subscription_id TEXT,
      subscription_end_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add columns if they don't exist (for existing tables)
  try {
    await client.execute(`ALTER TABLE users ADD COLUMN name TEXT`);
  } catch {
    // Column may already exist, ignore
  }
  try {
    await client.execute(`ALTER TABLE users ADD COLUMN avatar_url TEXT`);
  } catch {
    // Column may already exist, ignore
  }
  try {
    await client.execute(`ALTER TABLE users ADD COLUMN plan_type TEXT`);
  } catch {
    // Column may already exist, ignore
  }
  try {
    await client.execute(`ALTER TABLE users ADD COLUMN daily_usage_date TEXT`);
  } catch {
    // Column may already exist, ignore
  }
  try {
    await client.execute(`ALTER TABLE users ADD COLUMN daily_usage_count INTEGER DEFAULT 0`);
  } catch {
    // Column may already exist, ignore
  }
}

// Check if user is Pro
export async function isUserPro(email: string): Promise<boolean> {
  const result = await client.execute({
    sql: 'SELECT subscription_tier, subscription_end_date FROM users WHERE email = ?',
    args: [email],
  });

  if (result.rows.length === 0) {
    return false;
  }

  const user = result.rows[0];
  const tier = user.subscription_tier as string;
  const endDate = user.subscription_end_date as string | null;

  if (tier !== 'pro') {
    return false;
  }

  // Check if subscription has expired
  if (endDate) {
    const now = new Date();
    const end = new Date(endDate);
    if (now > end) {
      return false;
    }
  }

  return true;
}

// Get user subscription info
export async function getUserSubscription(email: string) {
  const result = await client.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email],
  });

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

// Create or update user
// Get today's date string in local time
function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Check and increment daily usage for free users
export async function checkAndIncrementDailyUsage(email: string, limit: number = 5): Promise<{ allowed: boolean; remaining: number; todayUsage: number }> {
  const today = getTodayDateString();

  // Get current usage
  const result = await client.execute({
    sql: 'SELECT daily_usage_date, daily_usage_count FROM users WHERE email = ?',
    args: [email],
  });

  if (result.rows.length === 0) {
    // User doesn't exist, should not happen
    return { allowed: false, remaining: 0, todayUsage: 0 };
  }

  const user = result.rows[0];
  const storedDate = user.daily_usage_date as string | null;
  let todayUsage = user.daily_usage_count as number || 0;

  // Reset if it's a new day
  if (storedDate !== today) {
    todayUsage = 0;
    await client.execute({
      sql: 'UPDATE users SET daily_usage_date = ?, daily_usage_count = 0 WHERE email = ?',
      args: [today, email],
    });
  }

  // Check if limit reached
  if (todayUsage >= limit) {
    return { allowed: false, remaining: 0, todayUsage };
  }

  // Increment usage
  todayUsage += 1;
  await client.execute({
    sql: 'UPDATE users SET daily_usage_date = ?, daily_usage_count = ? WHERE email = ?',
    args: [today, todayUsage, email],
  });

  return { allowed: true, remaining: Math.max(0, limit - todayUsage), todayUsage };
}

// Get remaining daily usage for a user
export async function getRemainingDailyUsage(email: string, limit: number = 5): Promise<{ remaining: number; todayUsage: number; isNewDay: boolean }> {
  const today = getTodayDateString();

  const result = await client.execute({
    sql: 'SELECT daily_usage_date, daily_usage_count FROM users WHERE email = ?',
    args: [email],
  });

  if (result.rows.length === 0) {
    return { remaining: limit, todayUsage: 0, isNewDay: true };
  }

  const user = result.rows[0];
  const storedDate = user.daily_usage_date as string | null;
  let todayUsage = user.daily_usage_count as number || 0;

  // Check if it's a new day
  const isNewDay = storedDate !== today;
  if (isNewDay) {
    todayUsage = 0;
  }

  return { remaining: Math.max(0, limit - todayUsage), todayUsage, isNewDay };
}

export async function upsertUser(email: string, data: {
  name?: string;
  avatar_url?: string;
  subscription_tier?: string;
  plan_type?: string;
  paypal_subscription_id?: string;
  subscription_end_date?: string;
}) {
  const existing = await getUserSubscription(email);

  if (existing) {
    const updates: string[] = ['updated_at = CURRENT_TIMESTAMP'];
    const args: (string | null)[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      args.push(data.name);
    }
    if (data.avatar_url !== undefined) {
      updates.push('avatar_url = ?');
      args.push(data.avatar_url);
    }
    if (data.subscription_tier !== undefined) {
      updates.push('subscription_tier = ?');
      args.push(data.subscription_tier);
    }
    if (data.plan_type !== undefined) {
      updates.push('plan_type = ?');
      args.push(data.plan_type);
    }
    if (data.paypal_subscription_id !== undefined) {
      updates.push('paypal_subscription_id = ?');
      args.push(data.paypal_subscription_id);
    }
    if (data.subscription_end_date !== undefined) {
      updates.push('subscription_end_date = ?');
      args.push(data.subscription_end_date);
    }

    args.push(email);

    await client.execute({
      sql: `UPDATE users SET ${updates.join(', ')} WHERE email = ?`,
      args,
    });
  } else {
    await client.execute({
      sql: `INSERT INTO users (email, name, avatar_url, subscription_tier, plan_type, paypal_subscription_id, subscription_end_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        email,
        data.name || null,
        data.avatar_url || null,
        data.subscription_tier || 'free',
        data.plan_type || null,
        data.paypal_subscription_id || null,
        data.subscription_end_date || null,
      ],
    });
  }
}
