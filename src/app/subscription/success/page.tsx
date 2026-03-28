'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SubscriptionSuccess() {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Subscription Activated!</h1>
        <p className="text-gray-400 mb-8">
          Thank you for subscribing to MailCraftUs Pro. You now have unlimited email generation.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full font-medium hover:from-amber-500 hover:to-yellow-500 transition-all mb-4"
        >
          Go to Generator
        </Link>
        <p className="text-gray-500 text-sm">
          Redirecting in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}
