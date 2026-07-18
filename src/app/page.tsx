import Link from "next/link";
import HeroShowcase from "@/components/home/HeroShowcase";
import NewsletterForm from "@/components/home/NewsletterForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-16 lg:pt-18 overflow-hidden">
      {/* ── 1. Hero Section ────────────────────────────────────────────────────── */}
      <section className="relative min-h-[65vh] flex items-center pt-10 pb-20 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 inset-x-0 h-full bg-hero-gradient -z-10" />
        <div className="absolute -top-[20%] -right-[10%] w-[50%] aspect-square rounded-full bg-primary-500/10 blur-[100px] -z-10" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] aspect-square rounded-full bg-secondary-600/10 blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="space-y-8 max-w-2xl animate-slide-in-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-sm font-medium text-primary-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                SmartRecipe AI 2.0 is live
              </div>
              
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] text-white">
                Cook <span className="gradient-text">Smarter,</span><br />
                Not Harder.
              </h1>
              
              <p className="text-lg sm:text-xl text-neutral-400 leading-relaxed max-w-xl text-balance">
                Your personal AI sous-chef. Tell us what's in your pantry, your dietary goals, and your cravings — we'll generate the perfect recipe in seconds.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link href="/recipes" className="btn-primary px-8 py-3.5 text-base shadow-glow-primary">
                  Explore Recipes
                </Link>
                <Link href="/how-it-works" className="px-8 py-3.5 text-base font-medium text-white hover:text-primary-300 transition-colors">
                  See how it works →
                </Link>
              </div>
              
              <div className="flex items-center gap-4 pt-8 text-sm text-neutral-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#100b05] bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-xs text-white shadow-sm">
                      {["👨‍🍳", "👩‍🍳", "🧑‍🍳", "🥘"][i-1]}
                    </div>
                  ))}
                </div>
                <p>Join <span className="font-semibold text-white">10,000+</span> happy cooks</p>
              </div>
            </div>

            <div className="animate-fade-in-up delay-200">
              <HeroShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Features Section ────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-transparent to-[#160f07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up delay-100">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
              Everything you need to master your kitchen
            </h2>
            <p className="text-neutral-400 text-lg">
              SmartRecipe isn't just a cookbook. It's a living, breathing culinary assistant designed to adapt to your life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🧠",
                title: "AI Recipe Generator",
                desc: "Input your leftover ingredients and let our AI craft a delicious, customized meal in seconds.",
              },
              {
                icon: "🎯",
                title: "Smart Recommendations",
                desc: "The more you cook, the better we get. Discover new favorites tailored exactly to your taste profile.",
              },
              {
                icon: "❤️",
                title: "Save Favorites",
                desc: "Build your personal cookbook. Save, organize, and tweak your favorite recipes for easy access anytime.",
              },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-3xl recipe-card flex flex-col items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.05] flex items-center justify-center text-3xl shadow-inner-top">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Popular Cuisines ────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/[0.03] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-between items-end">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">Popular Cuisines</h2>
            <p className="text-neutral-400">Explore flavors from around the globe.</p>
          </div>
          <Link href="/recipes" className="hidden sm:inline-flex text-primary-400 hover:text-primary-300 font-medium transition-colors">
            View all cuisines →
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-8 scrollbar-hide snap-x">
          {[
            { name: "Italian", emoji: "🍝", color: "from-[#2a5c3e]/20 to-transparent" },
            { name: "Mexican", emoji: "🌮", color: "from-[#E8872B]/20 to-transparent" },
            { name: "Japanese", emoji: "🍱", color: "from-[#C0543A]/20 to-transparent" },
            { name: "Indian", emoji: "🍛", color: "from-[#b55413]/20 to-transparent" },
            { name: "Thai", emoji: "🍜", color: "from-[#5da975]/20 to-transparent" },
            { name: "Mediterranean", emoji: "🥙", color: "from-[#9d8764]/20 to-transparent" },
          ].map((cuisine) => (
            <Link 
              key={cuisine.name}
              href={`/recipes?cuisine=${cuisine.name.toLowerCase()}`}
              className={`snap-start min-w-[200px] h-40 glass-card rounded-3xl p-6 flex flex-col justify-between hover:scale-105 transition-transform duration-300 relative overflow-hidden group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cuisine.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <span className="text-4xl drop-shadow-lg relative z-10">{cuisine.emoji}</span>
              <span className="font-semibold text-lg text-white relative z-10">{cuisine.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. How It Works ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#160f07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
              How SmartRecipe Works
            </h2>
            <p className="text-neutral-400 text-lg">
              Three simple steps to transform your daily cooking routine.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (desktop only) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 step-line opacity-30" />

            {[
              {
                step: "1",
                title: "Tell us what you have",
                desc: "Open your fridge, list a few ingredients, and set any dietary restrictions.",
                icon: "🥬",
              },
              {
                step: "2",
                title: "AI works its magic",
                desc: "Our engine cross-references thousands of culinary profiles to generate a unique recipe.",
                icon: "✨",
              },
              {
                step: "3",
                title: "Cook & Enjoy",
                desc: "Follow the step-by-step interactive guide and savor a perfect, stress-free meal.",
                icon: "🍽️",
              },
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-[#1c1209] border border-white/10 flex items-center justify-center text-4xl shadow-xl z-10 mb-8 relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                  {item.icon}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Stats Section ───────────────────────────────────────────────────── */}
      <section className="py-20 border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/[0.05]">
            {[
              { label: "AI Generated Recipes", value: "5,000+" },
              { label: "Happy Cooks", value: "10,000+" },
              { label: "Average Rating", value: "4.9/5" },
              { label: "Cuisines Available", value: "50+" },
            ].map((stat, i) => (
              <div key={i} className="text-center px-4">
                <div className="text-3xl sm:text-4xl md:text-5xl font-display font-bold stat-number mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base text-neutral-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Testimonials ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-t from-[#160f07] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-4">Loved by home chefs everywhere</h2>
            <p className="text-neutral-400">Don't just take our word for it.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "SmartRecipe completely changed my weeknights. I used to stare at a full fridge and order takeout. Now, I just type in 'chicken, broccoli, soy sauce' and get a gourmet meal plan instantly.",
                name: "Sarah Jenkins",
                role: "Busy Parent",
                avatar: "SJ",
              },
              {
                quote: "As someone with strict dietary needs, finding recipes used to be a chore. The AI takes my restrictions perfectly into account and actually suggests flavorful, creative dishes.",
                name: "Marcus Chen",
                role: "Fitness Enthusiast",
                avatar: "MC",
              },
              {
                quote: "The interface is gorgeous and the recipes are surprisingly authentic. I made the Saffron Butter Chicken last night and it tasted like it came from a high-end restaurant.",
                name: "Elena Rodriguez",
                role: "Amateur Cook",
                avatar: "ER",
              },
            ].map((t, i) => (
              <div key={i} className="glass-card p-8 rounded-3xl relative">
                <div className="text-primary-500/20 text-6xl font-display absolute top-4 left-6 leading-none">"</div>
                <p className="text-neutral-300 relative z-10 mb-8 pt-4 italic">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center font-bold text-white shadow-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-xs text-neutral-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "Is SmartRecipe really free to use?", a: "Yes! We offer a generous free tier that lets you generate up to 20 recipes per month and save unlimited favorites. For heavy users, we offer a Pro plan." },
              { q: "Can it handle complex dietary restrictions?", a: "Absolutely. You can specify vegan, gluten-free, keto, nut allergies, and more. Our AI strictly filters ingredients to ensure your safety and preferences." },
              { q: "How accurate are the cooking times?", a: "Our AI calculates cooking times based on standard culinary techniques. However, times can vary based on your specific appliances and skill level." },
              { q: "Can I edit the generated recipes?", a: "Yes. Once a recipe is generated, you can save it to your cookbook and tweak the ingredients, instructions, or notes to make it truly yours." },
              { q: "Does it work with metric measurements?", a: "SmartRecipe supports both Imperial and Metric systems. You can toggle your preference in your account settings." },
            ].map((faq, i) => (
              <details key={i} className="glass-card rounded-2xl group">
                <summary className="flex items-center justify-between p-6 font-semibold text-lg text-white">
                  {faq.q}
                  <span className="faq-arrow text-primary-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-neutral-400 leading-relaxed border-t border-white/[0.05] pt-4 mt-2">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA & Newsletter ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary-900/40 to-secondary-900/40 border border-primary-500/20 rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] aspect-square bg-primary-500/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] aspect-square bg-secondary-600/20 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
              Start cooking smarter today.
            </h2>
            <p className="text-xl text-neutral-300 mb-10">
              Join our newsletter for weekly AI-curated recipes, kitchen hacks, and exclusive early access to new features.
            </p>
            <NewsletterForm />
            <p className="text-xs text-neutral-500 mt-4">We respect your inbox. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
