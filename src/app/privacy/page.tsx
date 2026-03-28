export const metadata = {
  title: 'Privacy Policy - MailCraftUs',
  description: 'Privacy Policy for MailCraftUs AI Email Writer',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f0f23] text-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: March 22, 2026</p>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Information We Collect</h2>
            <p>
              We collect information you provide directly, including the content you generate using our AI email writing service. We do not collect personally identifiable information unless you voluntarily provide it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">How We Use Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services. Your generated email content is processed in real-time and is not stored on our servers after the session ends.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Cookies</h2>
            <p>
              We may use cookies and similar technologies to enhance your experience. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Third-Party Services</h2>
            <p>
              We use third-party services including AI providers (Alibaba Cloud) for email generation. These services have their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Children&apos;s Privacy</h2>
            <p>
              Our service is not intended for users under 18 years of age. We do not knowingly collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@MailCraftUs.com" className="text-amber-400 hover:text-amber-300">
                privacy@MailCraftUs.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
