"use client";

import { QuotientProvider } from "@quotientjs/react";
import { ThemeProvider } from "@repo/ui";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const quotientApiKey = process.env.NEXT_PUBLIC_QUOTIENT_API_KEY;

  if (!quotientApiKey) {
    console.error(
      "NEXT_PUBLIC_QUOTIENT_API_KEY is not set. Quotient features will not work.",
    );
  }

  // Always wrap with QuotientProvider to avoid hook errors
  // API calls will fail at runtime if key is missing
  return (
    <QuotientProvider
      clientOptions={{
        apiKey: quotientApiKey || "missing-key",
        baseUrl: "https://www.getquotient.ai",
      }}
      autoTrackPageViews={!!quotientApiKey}
    >
      <ThemeProvider defaultTheme="dark" storageKey="geney-theme">
        {children}
      </ThemeProvider>
    </QuotientProvider>
  );
}
