"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire to real newsletter API endpoint
    setStatus("done");
    setEmail("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto w-full"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@kitchen.com"
        className="flex-1 px-5 py-3 rounded-full bg-white/[0.06] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/20 transition-all"
      />
      <button type="submit" className="btn-primary px-6 py-3 whitespace-nowrap">
        {status === "done" ? "Subscribed ✓" : "Subscribe"}
      </button>
    </form>
  );
}
