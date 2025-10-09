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
    return (
      <ThemeProvider defaultTheme="light" storageKey="geney-theme">
        {children}
      </ThemeProvider>
    );
  }

  return (
    <QuotientProvider
      clientOptions={{
        apiKey: quotientApiKey,
        baseUrl: "https://www.getquotient.ai",
      }}
      autoTrackPageViews={true}
    >
      <ThemeProvider defaultTheme="light" storageKey="geney-theme">
        {children}
      </ThemeProvider>
    </QuotientProvider>
  );
}
