import { NextRequest, NextResponse } from 'next/server';
import { upsertUser, isUserPro } from '@/lib/db';
import { getSubscription } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const eventType = payload.event_type;

    console.log('PayPal Webhook received:', eventType);

    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.CREATED':
        await handleSubscriptionCreated(payload);
        break;

      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(payload);
        break;

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(payload);
        break;

      case 'BILLING.SUBSCRIPTION.EXPIRED':
        await handleSubscriptionExpired(payload);
        break;

      case 'PAYMENT.SALE.COMPLETED':
        await handlePaymentCompleted(payload);
        break;

      default:
        console.log('Unhandled event type:', eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(payload: any) {
  const { subscriber, plan_id, custom_id } = payload.resource;

  // Use custom_id (Google email) if available, otherwise fallback to PayPal email
  const userEmail = custom_id || subscriber?.email_address;

  if (!userEmail) {
    console.error('No email in subscription:', payload);
    return;
  }

  // Determine plan type from plan_id
  const isYearlyPlan = plan_id === process.env.PAYPAL_YEARLY_PLAN_ID;
  const planType = isYearlyPlan ? 'yearly' : 'monthly';
  const endDate = calculateEndDate(plan_id);

  await upsertUser(userEmail, {
    subscription_tier: 'free', // Start as free, upgrade to pro in ACTIVATED
    paypal_subscription_id: payload.resource.id,
    subscription_end_date: endDate,
    plan_type: planType,
  });

  console.log('Subscription created (pending activation):', userEmail, 'plan:', planType);
}

async function handleSubscriptionActivated(payload: any) {
  const { subscriber, custom_id } = payload.resource;

  // Use custom_id (Google email) if available
  const userEmail = custom_id || subscriber?.email_address;

  if (!userEmail) {
    return;
  }

  // User completed payment - now mark as pro
  await upsertUser(userEmail, {
    subscription_tier: 'pro',
  });

  console.log('Subscription activated (payment confirmed):', userEmail);
}

async function handleSubscriptionCancelled(payload: any) {
  const { id, subscriber } = payload.resource;

  console.log('Subscription cancelled:', id);

  // Try to find user by subscription_id first
  // For now, rely on the check endpoint to verify status
  // The user will be downgraded when we check subscription status
}

async function handleSubscriptionExpired(payload: any) {
  const { id, subscriber } = payload.resource;

  console.log('Subscription expired:', id);

  // Similar to cancelled - user will be downgraded on next status check
}

async function handlePaymentCompleted(payload: any) {
  const { subscriber, billing_info, custom_id } = payload.resource;

  // Use custom_id (Google email) if available
  const userEmail = custom_id || subscriber?.email_address;

  if (!userEmail) {
    return;
  }

  // Mark as pro on payment completion
  const endDate = billing_info?.next_billing_time
    ? new Date(billing_info.next_billing_time).toISOString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await upsertUser(userEmail, {
    subscription_tier: 'pro',
    subscription_end_date: endDate,
  });

  console.log('Payment completed, user marked as pro:', userEmail);
}

function calculateEndDate(planId: string): string {
  // Determine if monthly or yearly based on plan ID or env
  const isYearly = planId.includes('yearly') || planId === process.env.PAYPAL_YEARLY_PLAN_ID;

  const endDate = new Date();

  if (isYearly) {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }

  return endDate.toISOString();
}
