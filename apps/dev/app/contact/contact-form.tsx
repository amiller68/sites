"use client";

import { useState } from "react";
import { useContactSubmit } from "@/lib/quotient/client";

export function ContactForm() {
  const contactSubmit = useContactSubmit();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await contactSubmit({ ...formData });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          firstName: "",
          lastName: "",
          emailAddress: "",
        });
      }, 3000);
    } catch (err: unknown) {
      setError("Something went wrong. Please try again.");
      console.error("Contact submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <p className="text-muted-foreground">Thanks, I&apos;ll be in touch.</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="firstName" className="text-sm text-muted-foreground">
            First name
          </label>
          <input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="input"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="lastName" className="text-sm text-muted-foreground">
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="input"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm text-muted-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={formData.emailAddress}
          onChange={(e) =>
            setFormData({ ...formData, emailAddress: e.target.value })
          }
          className="input"
        />
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 text-sm bg-foreground text-background rounded hover:bg-foreground/90 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "sending..." : "send"}
      </button>
    </form>
  );
}
