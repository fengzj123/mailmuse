'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SubscriptionCancelled() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/pricing');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Subscription Cancelled</h1>
        <p className="text-gray-400 mb-8">
          Your subscription was not completed. You can always upgrade later from the pricing page.
        </p>
        <a
          href="/pricing"
          className="inline-block px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full font-medium hover:from-amber-500 hover:to-yellow-500 transition-all"
        >
          Back to Pricing
        </a>
      </div>
    </div>
  );
}
