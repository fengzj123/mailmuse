// PayPal API helper

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'sandbox'
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

interface PayPalTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PayPalProduct {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface PayPalPlan {
  id: string;
  product_id: string;
  name: string;
  status: string;
  pricingSchemes: {
    pricingScheme: {
      fixedPrice: {
        value: string;
        currency_code: string;
      };
    };
  }[];
  billingCycles: {
    frequency: { intervalUnit: string; intervalCount: number };
    tenureType: string;
    sequence: number;
    totalCycles: number;
  }[];
}

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;

  if (!clientId || !secret) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get PayPal access token: ${response.statusText}`);
  }

  const data: PayPalTokenResponse = await response.json();
  return data.access_token;
}

// Create PayPal Product
export async function createPayPalProduct(name: string): Promise<string> {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      type: 'SERVICE',
      category: 'SOFTWARE',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create PayPal product: ${error}`);
  }

  const product: PayPalProduct = await response.json();
  return product.id;
}

// Create PayPal Pricing Plan (Monthly)
export async function createMonthlyPlan(productId: string, price: string): Promise<string> {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: productId,
      name: 'MailCraftUs Pro Monthly',
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'MONTH',
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0',
          currency_code: 'USD',
        },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
      pricing_scheme: {
        fixed_price: {
          value: price,
          currency_code: 'USD',
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create monthly plan: ${error}`);
  }

  const plan: PayPalPlan = await response.json();
  return plan.id;
}

// Create PayPal Pricing Plan (Yearly)
export async function createYearlyPlan(productId: string, price: string): Promise<string> {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: productId,
      name: 'MailCraftUs Pro Yearly',
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'YEAR',
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0',
          currency_code: 'USD',
        },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
      pricing_scheme: {
        fixed_price: {
          value: price,
          currency_code: 'USD',
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create yearly plan: ${error}`);
  }

  const plan: PayPalPlan = await response.json();
  return plan.id;
}

// Create PayPal Subscription
export async function createSubscription(planId: string, userEmail: string): Promise<{ subscriptionId: string; approvalUrl: string }> {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plan_id: planId,
      subscriber: {
        email_address: userEmail,
      },
      return_url: `${process.env.NEXTAUTH_URL}/subscription/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/subscription/cancelled`,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create subscription: ${error}`);
  }

  const subscription = await response.json();

  // Find approval URL
  const approvalUrl = subscription.links?.find((link: { rel: string }) => link.rel === 'approve')?.href;

  return {
    subscriptionId: subscription.id,
    approvalUrl: approvalUrl || '',
  };
}

// Get Subscription Details
export async function getSubscription(subscriptionId: string) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get subscription: ${response.statusText}`);
  }

  return response.json();
}

// Cancel Subscription
export async function cancelSubscription(subscriptionId: string) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reason: 'User cancelled subscription',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to cancel subscription: ${response.statusText}`);
  }
}
