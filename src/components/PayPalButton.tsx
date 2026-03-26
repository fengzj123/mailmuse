'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
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
  const [sdkStatus, setSdkStatus] = useState<string>('loading');

  // Debug: Log PayPal SDK loading status
  const [{ isPending, isRejected, isResolved }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    console.log('PayPal SDK status:', { isPending, isRejected, isResolved });
    if (isPending) setSdkStatus('pending');
    if (isRejected) setSdkStatus('rejected');
    if (isResolved) setSdkStatus('resolved');
  }, [isPending, isRejected, isResolved]);

  useEffect(() => {
    const fetchPlanId = async () => {
      try {
        console.log('Fetching plan ID for:', planType);
        const res = await fetch('/api/subscription/plans');
        const data = await res.json();
        console.log('Plans API response:', data);
        const id = planType === 'yearly' ? data.yearlyPlanId : data.monthlyPlanId;
        if (!id) {
          setError('Plan not configured. Please check PAYPAL_MONTHLY_PLAN_ID and PAYPAL_YEARLY_PLAN_ID environment variables.');
        } else {
          setPlanId(id);
          console.log('Set plan ID:', id);
        }
      } catch (err) {
        console.error('Failed to fetch plan ID:', err);
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
      console.log('Subscription approved, activating:', subscriptionId);
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
      <div className="space-y-2">
        <button
          disabled
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 font-medium opacity-50 cursor-not-allowed"
        >
          Loading PayPal... (SDK: {sdkStatus})
        </button>
        {sdkStatus === 'rejected' && (
          <p className="text-red-400 text-sm text-center">
            PayPal SDK failed to load. Please check your network connection.
          </p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <div className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-center font-medium">
          {error}
        </div>
        <p className="text-gray-500 text-xs text-center">
          SDK Status: {sdkStatus}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <PayPalButtons
        style={{
          layout: 'horizontal',
          color: 'black',
          shape: 'rect',
          label: 'paypal',
        }}
        createSubscription={async () => {
          console.log('Creating subscription with planId:', planId);
          if (!planId) throw new Error('Plan not loaded');
          return planId;
        }}
        onApprove={onApprove}
        onError={(err) => {
          console.error('PayPal error:', err);
          setError('Payment failed. Please try again.');
        }}
      />
      <p className="text-gray-500 text-xs text-center">
        SDK: {sdkStatus}
      </p>
    </div>
  );
}
