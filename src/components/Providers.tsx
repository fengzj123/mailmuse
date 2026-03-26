'use client';

import { SessionProvider } from "next-auth/react";
import PayPalProvider from "./PayPalProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PayPalProvider>{children}</PayPalProvider>
    </SessionProvider>
  );
}
