import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getRemainingDailyUsage } from '@/lib/db';

const FREE_DAILY_LIMIT = 5;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { remaining, todayUsage } = await getRemainingDailyUsage(session.user.email, FREE_DAILY_LIMIT);

    return NextResponse.json({
      remaining,
      usedToday: todayUsage,
      dailyLimit: FREE_DAILY_LIMIT,
    });
  } catch (error) {
    console.error('Check usage error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check usage' },
      { status: 500 }
    );
  }
}
