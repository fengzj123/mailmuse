import GoogleSignIn from "@/components/GoogleSignIn";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to MailCraftUs</h1>
          <p className="text-gray-400">Sign in to access your account</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <GoogleSignIn />
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-violet-400 hover:text-violet-300">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-violet-400 hover:text-violet-300">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
