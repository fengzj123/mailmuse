import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createPayPalProduct, createMonthlyPlan, createYearlyPlan, createSubscription } from '@/lib/paypal';
import { SUBSCRIPTION_PLANS } from '@/lib/subscriptions';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planType } = await request.json();

    const plan = planType === 'yearly' ? SUBSCRIPTION_PLANS.yearly : SUBSCRIPTION_PLANS.monthly;

    // If plan ID is not set, create it on PayPal
    if (!plan.id) {
      const productId = await createPayPalProduct('MailCraftUs Pro');
      const monthlyPlanId = await createMonthlyPlan(productId, '9.00');
      const yearlyPlanId = await createYearlyPlan(productId, '99.00');

      console.log('Created PayPal plans:', { monthlyPlanId, yearlyPlanId });
      // In production, save these to env variables or database
    }

    const selectedPlanId = plan.id;
    if (!selectedPlanId) {
      return NextResponse.json({ error: 'Plan not configured' }, { status: 500 });
    }

    // Create subscription and get approval URL for redirect
    const { subscriptionId, approvalUrl } = await createSubscription(
      selectedPlanId,
      session.user.email
    );

    return NextResponse.json({
      subscriptionId,
      approvalUrl,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
