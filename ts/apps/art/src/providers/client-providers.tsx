"use client";

import { ThemeProvider } from "@repo/ui";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="art-theme">
      {children}
    </ThemeProvider>
  );
}
