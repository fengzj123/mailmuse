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

    // Determine plan type based on PayPal plan ID
    let planType = null;
    if (subscription?.paypal_subscription_id) {
      const subId = subscription.paypal_subscription_id as string;
      if (subId.includes('yearly') || subId === process.env.PAYPAL_YEARLY_PLAN_ID) {
        planType = 'yearly';
      } else {
        planType = 'monthly';
      }
    }

    return NextResponse.json({
      tier: isPro ? 'pro' : 'free',
      isPro,
      planType,
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
