"use client";

import { useState } from "react";
import { useContactSubmit } from "@/lib/quotient/client";

export function Subscribe() {
  const contactSubmit = useContactSubmit();
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await contactSubmit({ emailAddress: email });
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => {
        setIsSubmitted(false);
        setIsExpanded(false);
      }, 2000);
    } catch (err: unknown) {
      setError("Something went wrong. Please try again.");
      console.error("Subscribe error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-sm text-success">
        subscribed! thanks for joining.
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        subscribe for updates →
      </button>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          autoFocus
          className="text-sm px-3 py-1 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-sm px-3 py-1 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? "..." : "subscribe"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsExpanded(false);
            setError("");
          }}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ×
        </button>
      </form>
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
    </div>
  );
}
