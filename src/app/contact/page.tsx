'use client';

import { useState } from 'react';

export const metadata = {
  title: 'Contact Us - MailMuse',
  description: 'Contact MailMuse AI Email Writer',
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send an email or create a support ticket
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
        <p className="text-gray-400 text-center mb-12">
          Have questions or feedback? We&apos;d love to hear from you.
        </p>

        {submitted ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Message Sent!</h2>
            <p className="text-gray-400">
              Thank you for reaching out. We&apos;ll get back to you as soon as possible.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none resize-none"
                placeholder="How can we help you?"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-semibold hover:from-violet-500 hover:to-purple-500 transition-all"
            >
              Send Message
            </button>
          </form>
        )}

        <div className="mt-12 pt-12 border-t border-white/10">
          <h3 className="text-lg font-semibold mb-4">Other Ways to Reach Us</h3>
          <div className="space-y-3 text-gray-400">
            <p>
              <span className="text-gray-300">Email:</span>{' '}
              <a href="mailto:support@mailmuse.com" className="text-violet-400 hover:text-violet-300">
                support@mailmuse.com
              </a>
            </p>
            <p>
              <span className="text-gray-300">Response Time:</span> Usually within 24-48 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
