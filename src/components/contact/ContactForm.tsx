"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name (at least 2 characters)."),
  email: z.string().email("Please enter a valid email address."),
  message: z
    .string()
    .min(10, "Your message should be at least 10 characters.")
    .max(1000, "Please keep your message under 1000 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const CONTACT_EMAIL = "hello@smartrecipe.app";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const message = watch("message") || "";

  const onSubmit = async (data: ContactFormValues) => {
    setStatus("idle");
    try {
      // Placeholder endpoint — swap for the real contact API when available.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      reset();
    } catch {
      // Graceful fallback: open the user's mail client pre-filled.
      const subject = encodeURIComponent(`Message from ${data.name}`);
      const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} <${data.email}>`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      setStatus("success");
      reset();
    }
  };

  const inputBase =
    "w-full bg-white/[0.03] border rounded-xl py-3 px-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all";
  const okBorder = "border-white/10 focus:border-primary-500/50 focus:ring-primary-500/20";
  const errBorder = "border-red-500/50 focus:ring-red-500/20";

  if (status === "success") {
    return (
      <div className="glass-card rounded-3xl p-8 sm:p-10 text-center bg-[#1c1209]/80 border-white/[0.05]">
        <div className="w-14 h-14 rounded-full bg-accent-500/15 border border-accent-500/30 flex items-center justify-center text-3xl mx-auto mb-5">
          ✅
        </div>
        <h3 className="font-display text-2xl font-bold text-white mb-2">
          Message sent!
        </h3>
        <p className="text-neutral-400 mb-6">
          Thanks for reaching out. Our team typically replies within 1–2 business
          days.
        </p>
        <button onClick={() => setStatus("idle")} className="btn-outline px-6 py-2.5 text-sm">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="glass-card rounded-3xl p-6 sm:p-8 space-y-5 bg-[#1c1209]/80 border-white/[0.05]"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-1.5">
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Your name"
          aria-invalid={!!errors.name}
          {...register("name")}
          className={`${inputBase} ${errors.name ? errBorder : okBorder}`}
        />
        {errors.name && <p className="mt-1.5 text-sm text-red-400">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          {...register("email")}
          className={`${inputBase} ${errors.email ? errBorder : okBorder}`}
        />
        {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="message" className="block text-sm font-medium text-neutral-300">
            Message
          </label>
          <span className="text-xs text-neutral-500">{message.length}/1000</span>
        </div>
        <textarea
          id="message"
          rows={5}
          placeholder="How can we help?"
          aria-invalid={!!errors.message}
          {...register("message")}
          className={`${inputBase} resize-y ${errors.message ? errBorder : okBorder}`}
        />
        {errors.message && (
          <p className="mt-1.5 text-sm text-red-400">{errors.message.message}</p>
        )}
      </div>

      {status === "error" && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          Something went wrong sending your message. Please try again or email us
          directly at {CONTACT_EMAIL}.
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary py-3.5 flex justify-center items-center"
      >
        {isSubmitting ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
