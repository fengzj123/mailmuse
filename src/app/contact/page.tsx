import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact Us - MailCraftUs',
  description: 'Contact MailCraftUs AI Email Writer',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0f0f23] text-white py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
        <p className="text-gray-400 text-center mb-12">
          Have questions or feedback? We&apos;d love to hear from you.
        </p>

        <ContactForm />

        <div className="mt-12 pt-12 border-t border-white/10">
          <h3 className="text-lg font-semibold mb-4">Other Ways to Reach Us</h3>
          <div className="space-y-3 text-gray-400">
            <p>
              <span className="text-gray-300">Email:</span>{' '}
              <a href="mailto:support@MailCraftUs.com" className="text-amber-400 hover:text-amber-300">
                support@MailCraftUs.com
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
