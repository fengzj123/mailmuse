import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createPayPalProduct, createMonthlyPlan, createYearlyPlan } from '@/lib/paypal';
import { SUBSCRIPTION_PLANS } from '@/lib/subscriptions';
import { upsertUser } from '@/lib/db';

function calculateEndDate(planType: 'monthly' | 'yearly'): string {
  const endDate = new Date();
  if (planType === 'yearly') {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }
  return endDate.toISOString();
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planType, paypalSubscriptionId } = await request.json();

    // If PayPal subscription ID is provided (Smart Buttons flow), activate immediately
    if (paypalSubscriptionId) {
      const endDate = calculateEndDate(planType);

      await upsertUser(session.user.email, {
        subscription_tier: 'pro',
        plan_type: planType,
        paypal_subscription_id: paypalSubscriptionId,
        subscription_end_date: endDate,
      });

      return NextResponse.json({
        success: true,
        subscriptionId: paypalSubscriptionId,
      });
    }

    // Old redirect flow: Create subscription via PayPal API
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

    // For redirect flow, we would create subscription and return approvalUrl
    // This is deprecated but kept for backwards compatibility
    return NextResponse.json({ error: 'Redirect flow deprecated' }, { status: 400 });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
