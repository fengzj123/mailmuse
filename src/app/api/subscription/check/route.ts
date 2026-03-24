import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isUserPro, getUserSubscription } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ tier: 'free', isPro: false });
    }

    const isPro = await isUserPro(session.user.email);
    const subscription = await getUserSubscription(session.user.email);

    return NextResponse.json({
      tier: isPro ? 'pro' : 'free',
      isPro,
      planType: subscription?.plan_type || null,
      subscription: subscription ? {
        subscriptionId: subscription.paypal_subscription_id,
        endDate: subscription.subscription_end_date,
      } : null,
    });
  } catch (error) {
    console.error('Check subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription' },
      { status: 500 }
    );
  }
}
