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
  const { subscriber, plan_id } = payload.resource;

  if (!subscriber?.email_address) {
    console.error('No email in subscription:', payload);
    return;
  }

  // Calculate end date based on billing cycle
  const endDate = calculateEndDate(plan_id);

  await upsertUser(subscriber.email_address, {
    subscription_tier: 'pro',
    paypal_subscription_id: payload.resource.id,
    subscription_end_date: endDate,
  });

  console.log('Subscription created for:', subscriber.email_address);
}

async function handleSubscriptionActivated(payload: any) {
  const { subscriber } = payload.resource;

  if (!subscriber?.email_address) {
    return;
  }

  // Ensure user is marked as pro
  await upsertUser(subscriber.email_address, {
    subscription_tier: 'pro',
  });

  console.log('Subscription activated for:', subscriber.email_address);
}

async function handleSubscriptionCancelled(payload: any) {
  const subscriptionId = payload.resource.id;

  // We need to find user by subscription ID - for now just log
  console.log('Subscription cancelled:', subscriptionId);

  // In production, query user by subscription_id
  // For now, we'll rely on the check endpoint to verify status
}

async function handleSubscriptionExpired(payload: any) {
  const subscriptionId = payload.resource.id;
  console.log('Subscription expired:', subscriptionId);
  // Similar to cancelled
}

async function handlePaymentCompleted(payload: any) {
  const { subscriber, billing_info } = payload.resource;

  if (!subscriber?.email_address) {
    return;
  }

  // Update subscription end date
  const nextPaymentDate = billing_info?.next_billing_time;

  if (nextPaymentDate) {
    await upsertUser(subscriber.email_address, {
      subscription_end_date: new Date(nextPaymentDate).toISOString(),
    });
  }

  console.log('Payment completed for:', subscriber.email_address);
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
