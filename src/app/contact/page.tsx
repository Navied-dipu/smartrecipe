import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — We'd Love to Hear From You",
  description:
    "Have a question, feature idea, or partnership request? Get in touch with the SmartRecipe team — we typically reply within 1–2 business days.",
  openGraph: {
    title: "Contact SmartRecipe",
    description: "Reach the SmartRecipe team with questions, feedback, or partnership requests.",
    type: "website",
  },
};

const contactMethods = [
  {
    icon: "📧",
    title: "Email us",
    detail: "hello@smartrecipe.app",
    href: "mailto:hello@smartrecipe.app",
  },
  {
    icon: "💬",
    title: "Support",
    detail: "support@smartrecipe.app",
    href: "mailto:support@smartrecipe.app",
  },
  {
    icon: "📍",
    title: "Office",
    detail: "San Francisco, CA 94103",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      {/* ── Header ── */}
      <div className="text-center mb-14">
        <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Contact
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4 text-balance">
          Get in <span className="gradient-text">touch</span>
        </h1>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          Questions, feedback, or partnership ideas? Fill out the form and we&apos;ll
          get back to you shortly.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
        {/* ── Contact methods ── */}
        <div className="lg:col-span-2 space-y-4">
          {contactMethods.map((m) => {
            const inner = (
              <div className="glass-card rounded-3xl p-6 flex items-start gap-4 h-full recipe-card bg-[#1c1209]/80 border-white/[0.05]">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-600/20 border border-primary-500/20 flex items-center justify-center text-xl shrink-0">
                  {m.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{m.title}</h3>
                  <p className="text-sm text-neutral-400 break-words">{m.detail}</p>
                </div>
              </div>
            );
            return m.href ? (
              <a key={m.title} href={m.href} className="block">
                {inner}
              </a>
            ) : (
              <div key={m.title}>{inner}</div>
            );
          })}

          <div className="glass-card rounded-3xl p-6 bg-[#1c1209]/80 border-white/[0.05]">
            <h3 className="font-semibold text-white mb-2">Response time</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              We read every message and typically reply within 1–2 business days.
              For account issues, please include the email you signed up with.
            </p>
          </div>
        </div>

        {/* ── Form ── */}
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
