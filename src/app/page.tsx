'use client';

import { useState } from 'react';

const scenarios = [
  { value: 'job-application', label: 'Job Application' },
  { value: 'sales-outreach', label: 'Sales Outreach' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'networking', label: 'Networking' },
  { value: 'customer-inquiry', label: 'Customer Inquiry' },
  { value: 'custom', label: 'Custom' },
];

const tones = [
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
];

const languages = [
  { value: 'English', label: 'English' },
  { value: 'Chinese', label: '中文' },
  { value: 'Spanish', label: 'Español' },
  { value: 'French', label: 'Français' },
  { value: 'German', label: 'Deutsch' },
];

export default function Home() {
  const [scenario, setScenario] = useState('job-application');
  const [recipientRole, setRecipientRole] = useState('');
  const [senderBackground, setSenderBackground] = useState('');
  const [emailPurpose, setEmailPurpose] = useState('');
  const [tone, setTone] = useState('formal');
  const [language, setLanguage] = useState('English');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!recipientRole || !emailPurpose) {
      setError('Please fill in recipient and email purpose');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedEmail('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario,
          recipientRole,
          senderBackground,
          emailPurpose,
          tone,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate');
      }

      setGeneratedEmail(data.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedEmail) return;
    await navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            MailMuse AI
          </h1>
          <p className="text-lg text-gray-600">
            Write professional emails in seconds with AI
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Scenario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scenario
              </label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                {scenarios.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                {tones.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                {languages.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Recipient Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Role / Company
              </label>
              <input
                type="text"
                value={recipientRole}
                onChange={(e) => setRecipientRole(e.target.value)}
                placeholder="e.g., Hiring Manager at Google"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Sender Background */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Background (Optional)
            </label>
            <textarea
              value={senderBackground}
              onChange={(e) => setSenderBackground(e.target.value)}
              placeholder="Briefly describe yourself or your company..."
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Email Purpose */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Purpose / Key Points
            </label>
            <textarea
              value={emailPurpose}
              onChange={(e) => setEmailPurpose(e.target.value)}
              placeholder="What do you want to say? Include key points you want to cover..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Email'
            )}
          </button>
        </div>

        {/* Generated Email Card */}
        {generatedEmail && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Generated Email
              </h2>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-wrap text-gray-800 leading-relaxed">
              {generatedEmail}
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition-colors"
              >
                Regenerate
              </button>
              <button
                onClick={() => {
                  const subject = generatedEmail.match(/^Subject: (.+)$/m)?.[1] || '';
                  const body = generatedEmail.replace(/^Subject: .+$/m, '').trim();
                  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  window.location.href = mailtoLink;
                }}
                className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-medium rounded-lg transition-colors"
              >
                Open in Email Client
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>3 free emails per day for non-logged-in users</p>
        </div>
      </div>
    </div>
  );
}
