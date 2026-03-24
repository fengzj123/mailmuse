'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function SubscriptionSuccess() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      // Redirect to home after 3 seconds
      const timer = setTimeout(() => {
        router.push('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0f0f23] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Processing your subscription...</p>
        </div>
      </div>
    );
  }

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
        <p className="text-gray-500 text-sm">
          Redirecting to home page...
        </p>
      </div>
    </div>
  );
}
