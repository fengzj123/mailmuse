export const metadata = {
  title: 'Terms of Service - MailCraftUs',
  description: 'Terms of Service for MailCraftUs AI Email Writer',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0f0f23] text-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: March 22, 2026</p>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Agreement to Terms</h2>
            <p>
              By accessing or using MailCraftUs, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Description of Service</h2>
            <p>
              MailCraftUs provides an AI-powered email writing assistant. Our service generates professional emails based on user-provided information and AI processing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Use the service in accordance with applicable laws and regulations</li>
              <li>Not use the service for any illegal or unauthorized purpose</li>
              <li>Not attempt to gain unauthorized access to any systems</li>
              <li>Provide accurate information when using the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Intellectual Property</h2>
            <p>
              The service, including its design, text, graphics, and software, is owned by MailCraftUs and protected by intellectual property laws. You retain ownership of content you create using our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Payment Terms</h2>
            <p>
              Paid subscriptions are billed in advance on a monthly basis. All fees are non-refundable except as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, MailCraftUs shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Disclaimer of Warranties</h2>
            <p>
              The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@MailCraftUs.com" className="text-amber-400 hover:text-amber-300">
                legal@MailCraftUs.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
