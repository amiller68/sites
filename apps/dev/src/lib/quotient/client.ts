"use client";

import { useQuotient } from "@quotientjs/react";
import { useCallback } from "react";

export interface ContactSubmitData {
  emailAddress: string;
  firstName?: string;
  lastName?: string;
}

// Hook for contact form submission
export function useContactSubmit() {
  const { client } = useQuotient();

  const contactSubmit = useCallback(
    async (data: ContactSubmitData) => {
      if (!client) {
        throw new Error("Quotient client not initialized");
      }

      await client.people.upsert({
        emailAddress: data.emailAddress,
        firstName: data.firstName,
        lastName: data.lastName,
        emailMarketingState: "SUBSCRIBED",
      });
    },
    [client],
  );

  return contactSubmit;
}
