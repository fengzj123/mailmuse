// Subscription plans configuration
// These plan IDs are created in PayPal and stored here

export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: process.env.PAYPAL_MONTHLY_PLAN_ID || '',
    name: 'MailCraftUs Pro Monthly',
    price: 9,
    interval: 'month',
  },
  yearly: {
    id: process.env.PAYPAL_YEARLY_PLAN_ID || '',
    name: 'MailCraftUs Pro Yearly',
    price: 99,
    interval: 'year',
  },
} as const;

export type SubscriptionTier = 'free' | 'pro';

export function isProUser(tier: string): boolean {
  return tier === 'pro';
}
