import { NextResponse } from 'next/server';
import { SUBSCRIPTION_PLANS } from '@/lib/subscriptions';

export async function GET() {
  try {
    return NextResponse.json({
      monthlyPlanId: SUBSCRIPTION_PLANS.monthly.id,
      yearlyPlanId: SUBSCRIPTION_PLANS.yearly.id,
    });
  } catch (error) {
    console.error('Get plans error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get plans' },
      { status: 500 }
    );
  }
}
