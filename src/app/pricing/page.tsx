'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

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
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  };

  const handleUpgrade = async () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/pricing');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: selectedPlan }),
      });

      const data = await res.json();

      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        alert('Failed to create subscription. Please try again.');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to start upgrade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-[#0f0f23]/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold">MailCraftUs</span>
            </a>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <span className="text-sm text-gray-300">
                    {session.user?.name || session.user?.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Home
                  </a>
                  <a
                    href="/auth/signin"
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full text-sm font-medium hover:from-violet-500 hover:to-purple-500 transition-all"
                  >
                    Sign In
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-400 mb-12">
            Start free. Upgrade when you need more.
          </p>

          {isPro && session && (
            <div className="mb-8 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
              You are currently on the Pro plan. Thank you for your support!
            </div>
          )}

          {/* Plan Selector for Pro upgrade */}
          {!isPro && session && (
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedPlan === 'monthly'
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                Monthly - $9/mo
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedPlan === 'yearly'
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                Yearly - $99/yr (Save 8%)
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="text-sm text-gray-400 mb-2">Free</div>
              <div className="text-4xl font-bold mb-2">$0</div>
              <div className="text-gray-500 mb-6">Forever free</div>
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sign in to start
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  5 emails per day
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All email scenarios
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All tones & languages
                </li>
              </ul>
              <a
                href="/"
                className="block w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium text-center"
              >
                Get Started
              </a>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-violet-600/20 to-purple-600/20 border border-violet-500/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-xs font-medium">
                Recommended
              </div>
              <div className="text-sm text-violet-400 mb-2">Pro</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold">${selectedPlan === 'monthly' ? '9' : '99'}</span>
                <span className="text-gray-400">/{selectedPlan === 'monthly' ? 'month' : 'year'}</span>
              </div>
              <div className="text-gray-500 mb-6">
                {selectedPlan === 'monthly' ? '' : 'Save 8% compared to monthly'}
              </div>
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Everything in Free
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <strong>Unlimited</strong> emails
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Email history
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
              {isPro ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl bg-green-600/20 text-green-400 border border-green-500/20 font-medium cursor-default"
                >
                  Current Plan
                </button>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all font-medium disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Upgrade to Pro'}
                </button>
              )}
            </div>
          </div>

          <p className="text-gray-500 text-sm mt-8">
            All plans include access to our AI email generation technology.
            <br />
            No credit card required to start.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400 text-sm">
                Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What counts as an email?</h3>
              <p className="text-gray-400 text-sm">
                Each time you generate an email, it counts as one email against your daily limit. Regenerating counts as another email.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400 text-sm">
                We accept all major credit cards and PayPal through our secure payment partner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-bold">MailCraftUs</span>
            </a>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>

            <div className="text-sm text-gray-500">
              © 2026 MailCraftUs. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
