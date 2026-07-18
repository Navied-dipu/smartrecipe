"use client";

import { useEffect, useState } from "react";

// ── Rotating recipe showcase ────────────────────────────────────────────────
// Self-contained visuals built from the Tailwind palette (no external images),
// so the hero renders reliably without a configured remote image host.
interface Dish {
  name: string;
  cuisine: string;
  time: string;
  emoji: string;
  gradient: string;
}

const dishes: Dish[] = [
  {
    name: "Saffron Butter Chicken",
    cuisine: "Indian",
    time: "40 min",
    emoji: "🍛",
    gradient: "linear-gradient(145deg, #b55413 0%, #C0543A 55%, #743918 100%)",
  },
  {
    name: "Wild Mushroom Risotto",
    cuisine: "Italian",
    time: "35 min",
    emoji: "🍚",
    gradient: "linear-gradient(145deg, #2a5c3e 0%, #4A7C59 55%, #1e3d2c 100%)",
  },
  {
    name: "Charred Street Tacos",
    cuisine: "Mexican",
    time: "25 min",
    emoji: "🌮",
    gradient: "linear-gradient(145deg, #d96d18 0%, #E8872B 55%, #904317 100%)",
  },
  {
    name: "Miso Ramen Bowl",
    cuisine: "Japanese",
    time: "50 min",
    emoji: "🍜",
    gradient: "linear-gradient(145deg, #a03429 0%, #d9593c 55%, #6e2a23 100%)",
  },
];

export default function HeroShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % dishes.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
      {/* Glow behind the stack */}
      <div className="absolute -inset-6 bg-primary-500/10 blur-3xl rounded-full" aria-hidden />

      {/* Card stack / carousel */}
      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-card-hover animate-float">
        {dishes.map((dish, i) => (
          <div
            key={dish.name}
            className={`hero-slide ${i === active ? "active" : ""}`}
            aria-hidden={i !== active}
          >
            <div className="absolute inset-0" style={{ background: dish.gradient }} />
            {/* subtle texture overlay */}
            <div
              className="absolute inset-0 opacity-30 mix-blend-overlay"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 75% 80%, rgba(0,0,0,0.35), transparent 50%)",
              }}
              aria-hidden
            />

            {/* Big dish glyph */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[7rem] drop-shadow-2xl select-none">{dish.emoji}</span>
            </div>

            {/* Gradient scrim for text */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

            {/* Card info */}
            <div className="absolute inset-x-0 bottom-0 p-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-sm mb-3">
                {dish.cuisine} · {dish.time}
              </span>
              <h3 className="font-display text-2xl font-bold text-white">{dish.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Floating stat chip */}
      <div className="absolute -left-4 top-8 glass-card rounded-2xl px-4 py-3 shadow-card hidden sm:block animate-float delay-300">
        <p className="text-xs text-neutral-300">AI match</p>
        <p className="font-display font-bold text-lg text-white">98% for you</p>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {dishes.map((dish, i) => (
          <button
            key={dish.name}
            onClick={() => setActive(i)}
            aria-label={`Show ${dish.name}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-8 bg-primary-500" : "w-1.5 bg-white/25 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
