'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface PayPalButtonProps {
  planType: 'monthly' | 'yearly';
}

export default function PayPalButton({ planType }: PayPalButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [planId, setPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlanId = async () => {
      try {
        const res = await fetch('/api/subscription/plans');
        const data = await res.json();
        const id = planType === 'yearly' ? data.yearlyPlanId : data.monthlyPlanId;
        if (!id) {
          setError('Plan not configured. Please contact support.');
        } else {
          setPlanId(id);
        }
      } catch (err) {
        setError('Failed to load payment options');
      } finally {
        setLoading(false);
      }
    };
    fetchPlanId();
  }, [planType]);

  const onApprove = async (data: { subscriptionID?: string | null }) => {
    const subscriptionId = data.subscriptionID;
    if (!subscriptionId) {
      setError('Failed to get subscription ID');
      return;
    }

    try {
      // Call backend to finalize subscription with the PayPal subscription ID
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType,
          paypalSubscriptionId: subscriptionId,
        }),
      });

      if (res.ok) {
        router.push('/subscription/success');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to activate subscription');
      }
    } catch (err) {
      console.error('Subscription activation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to activate subscription');
    }
  };

  if (loading) {
    return (
      <button
        disabled
        className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 font-medium opacity-50 cursor-not-allowed"
      >
        Loading PayPal...
      </button>
    );
  }

  if (error) {
    return (
      <div className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-center font-medium">
        {error}
      </div>
    );
  }

  return (
    <PayPalButtons
      style={{
        layout: 'horizontal',
        color: 'black',
        shape: 'rect',
        label: 'paypal',
      }}
      createSubscription={async () => {
        if (!planId) throw new Error('Plan not loaded');

        // Return plan ID - PayPal SDK will handle subscriber info
        // Note: subscriber email passed via createSubscription actions is not supported
        // Instead, we rely on webhook's custom_id mapping
        return planId;
      }}
      onApprove={onApprove}
      onError={(err) => {
        console.error('PayPal error:', err);
        setError('Payment failed. Please try again.');
      }}
    />
  );
}
