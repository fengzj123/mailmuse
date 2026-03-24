import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cancelSubscription } from '@/lib/paypal';
import { getUserSubscription, upsertUser } from '@/lib/db';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await getUserSubscription(session.user.email);

    if (!subscription?.paypal_subscription_id) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
    }

    await cancelSubscription(subscription.paypal_subscription_id as string);

    // Downgrade to free
    await upsertUser(session.user.email, {
      subscription_tier: 'free',
      paypal_subscription_id: '',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
