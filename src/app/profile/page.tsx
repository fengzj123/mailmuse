'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isPro, setIsPro] = useState(false);
  const [planType, setPlanType] = useState<'monthly' | 'yearly' | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      checkSubscription();
    }
  }, [session]);

  const checkSubscription = async () => {
    try {
      const res = await fetch('/api/subscription/check');
      const data = await res.json();
      setIsPro(data.isPro);
      setPlanType(data.planType);
      setEndDate(data.subscription?.endDate || null);
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0f0f23] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please sign in to view your profile</p>
          <Link
            href="/auth/signin"
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full font-medium hover:from-violet-500 hover:to-purple-500 transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-[#0f0f23]/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold">MailCraftUs</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                Pricing
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        {/* User Info Card */}
        <div className="rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-violet-500 flex items-center justify-center text-white text-2xl font-bold">
                {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold">{session?.user?.name || 'User'}</h2>
              <p className="text-gray-400">{session?.user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-t border-white/10">
              <span className="text-gray-400">Subscription</span>
              <span className={`px-3 py-1 rounded-full text-sm ${isPro ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-300'}`}>
                {isPro ? (planType === 'yearly' ? 'Pro Yearly' : 'Pro Monthly') : 'Free'}
              </span>
            </div>

            {isPro && endDate && (
              <div className="flex justify-between items-center py-3 border-t border-white/10">
                <span className="text-gray-400">Next Billing Date</span>
                <span className="text-white">{formatDate(endDate)}</span>
              </div>
            )}

            {!isPro && (
              <div className="flex justify-between items-center py-3 border-t border-white/10">
                <span className="text-gray-400">Daily Emails</span>
                <span className="text-white">5 / 5 remaining</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {!isPro && (
            <Link
              href="/pricing"
              className="block w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all font-medium text-center"
            >
              Upgrade to Pro
            </Link>
          )}
          <Link
            href="/"
            className="block w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium text-center"
          >
            Back to Generator
          </Link>
        </div>
      </div>
    </div>
  );
}
