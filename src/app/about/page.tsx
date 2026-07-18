import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — Our Mission & How the AI Works",
  description:
    "Learn how SmartRecipe uses AI to turn everyday ingredients into personalized recipes, cut food waste, and make home cooking effortless for everyone.",
  openGraph: {
    title: "About SmartRecipe",
    description:
      "Our mission to make personalized, AI-powered home cooking accessible to everyone.",
    type: "website",
  },
};

// ── Content data ────────────────────────────────────────────────────────────
const values = [
  {
    icon: "🎯",
    title: "Cook with what you have",
    desc: "No more last-minute grocery runs. We build recipes around the ingredients already in your kitchen to cut waste and save money.",
  },
  {
    icon: "🧠",
    title: "Personal, not generic",
    desc: "Every suggestion respects your diet, allergies, skill level, and taste — so recommendations actually feel like they're for you.",
  },
  {
    icon: "🌍",
    title: "Cuisines from everywhere",
    desc: "From weeknight pasta to regional street food, we celebrate the full range of world cooking, not just the popular hits.",
  },
];

const aiSteps = [
  {
    step: "01",
    title: "Understanding your taste",
    desc: "As you save, rate, and cook recipes, SmartRecipe builds a private taste profile — the cuisines you gravitate toward, your preferred cook times, and the ingredients you love or avoid.",
  },
  {
    step: "02",
    title: "Generating recipes",
    desc: "Our AI composes complete recipes from the ingredients you enter, drawing on proven flavor pairings and cooking techniques to produce clear steps, quantities, and timing you can trust.",
  },
  {
    step: "03",
    title: "Ranking recommendations",
    desc: "A recommendation model scores thousands of recipes against your profile and current filters, then surfaces the best matches with a plain-language reason for each pick.",
  },
  {
    step: "04",
    title: "Learning continuously",
    desc: "Every interaction is a signal. The more you use SmartRecipe, the sharper your recommendations get — while your data stays private to your account.",
  },
];

const stats = [
  { value: "500+", label: "Curated recipes" },
  { value: "1,000+", label: "Home cooks" },
  { value: "25+", label: "World cuisines" },
  { value: "4.8/5", label: "Average rating" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      {/* ── Hero ── */}
      <section className="text-center mb-20">
        <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3">
          About SmartRecipe
        </p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
          Making great cooking <span className="gradient-text">effortless</span> for
          everyone
        </h1>
        <p className="text-neutral-400 text-lg leading-relaxed max-w-2xl mx-auto">
          SmartRecipe was born from a simple, daily frustration: standing in front
          of a full fridge with no idea what to make. We set out to fix that with
          AI that understands your taste and turns what you already have into meals
          worth sitting down for.
        </p>
      </section>

      {/* ── Mission ── */}
      <section className="glass-card rounded-3xl p-8 sm:p-12 mb-20 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/10 blur-3xl rounded-full" aria-hidden />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Our mission
          </h2>
          <p className="text-neutral-300 text-lg leading-relaxed mb-4">
            We believe home cooking should be joyful, not stressful. Too many
            people default to takeout because deciding what to cook feels like a
            chore — and too much good food gets thrown away because it never made
            it into a meal.
          </p>
          <p className="text-neutral-400 leading-relaxed">
            SmartRecipe exists to close that gap. By pairing real culinary
            knowledge with modern AI, we help you cook more of what you love, waste
            less of what you buy, and discover dishes you&apos;d never have thought
            to try — all personalized to you.
          </p>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            What we stand for
          </h2>
          <p className="text-neutral-400">The principles behind every feature we build.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v) => (
            <article
              key={v.title}
              className="glass-card rounded-3xl p-6 h-full flex flex-col recipe-card bg-[#1c1209]/80 border-white/[0.05]"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-600/20 border border-primary-500/20 flex items-center justify-center text-2xl mb-5">
                {v.icon}
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">
                {v.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{v.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── How the AI works ── */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Under the hood
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            How our AI features work
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            No magic — just a thoughtful pipeline that learns your preferences and
            puts them to work every time you open the app.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {aiSteps.map((s) => (
            <article
              key={s.step}
              className="glass-card rounded-3xl p-6 h-full flex flex-col recipe-card bg-[#1c1209]/80 border-white/[0.05]"
            >
              <span className="font-display text-3xl font-bold gradient-text mb-3">
                {s.step}
              </span>
              <h3 className="font-display text-xl font-bold text-white mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="mb-20">
        <div className="glass-card rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="stat-number font-display text-4xl sm:text-5xl font-bold">
                  {s.value}
                </p>
                <p className="mt-2 text-sm text-neutral-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 text-balance">
          Ready to cook smarter?
        </h2>
        <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
          Join a growing community of home cooks turning everyday ingredients into
          something special.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="btn-primary px-8 py-3.5 w-full sm:w-auto text-center">
            Get Started Free
          </Link>
          <Link href="/recipes" className="btn-outline px-8 py-3.5 w-full sm:w-auto text-center">
            Explore Recipes
          </Link>
        </div>
      </section>
    </div>
  );
}
