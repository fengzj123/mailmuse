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
      subscription_tier TEXT DEFAULT 'free' CHECK(subscription_tier IN ('free', 'pro')),
      plan_type TEXT CHECK(plan_type IN ('monthly', 'yearly')),
      paypal_subscription_id TEXT,
      subscription_end_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add plan_type column if it doesn't exist (for existing tables)
  try {
    await client.execute(`ALTER TABLE users ADD COLUMN plan_type TEXT`);
  } catch {
    // Column may already exist, ignore error
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
export async function upsertUser(email: string, data: {
  subscription_tier?: string;
  plan_type?: string;
  paypal_subscription_id?: string;
  subscription_end_date?: string;
}) {
  const existing = await getUserSubscription(email);

  if (existing) {
    const updates: string[] = ['updated_at = CURRENT_TIMESTAMP'];
    const args: (string | null)[] = [];

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
      sql: `INSERT INTO users (email, subscription_tier, plan_type, paypal_subscription_id, subscription_end_date)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        email,
        data.subscription_tier || 'free',
        data.plan_type || null,
        data.paypal_subscription_id || null,
        data.subscription_end_date || null,
      ],
    });
  }
}
