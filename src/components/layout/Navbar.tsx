"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface NavLink {
  label: string;
  href: string;
}

// ── Nav Links ─────────────────────────────────────────────────────────────────
const publicLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/recipes" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const authLinks: NavLink[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Add Recipe", href: "/recipes/new" },
  { label: "Manage Recipes", href: "/recipes/manage" },
  { label: "Profile", href: "/profile" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // TODO: replace with real auth session check (e.g. Better Auth useSession)
  const isLoggedIn = false;

  const navLinks = isLoggedIn ? [...publicLinks, ...authLinks] : publicLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 nav-blur ${
        scrolled
          ? "bg-[#100b05]/90 border-b border-white/[0.06] shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* ── Logo ───────────────────────────────────────────────────────── */}
          <Link href="/" id="nav-logo" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-glow-primary group-hover:scale-110 transition-transform duration-200">
              <span className="text-white text-lg">🍳</span>
            </div>
            <span className="font-display font-bold text-xl text-white">
              Smart<span className="gradient-text">Recipe</span>
            </span>
          </Link>

          {/* ── Desktop Links ──────────────────────────────────────────────── */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative px-3 py-1.5 text-sm font-medium text-neutral-300 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all duration-200 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-primary-500 to-secondary-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Desktop Auth Actions ───────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:scale-110 transition-transform">
                  U
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  id="nav-login-btn"
                  className="btn-outline px-4 py-1.5 text-sm"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  id="nav-signup-btn"
                  className="btn-primary px-4 py-1.5 text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ───────────────────────────────────────────── */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Toggle mobile menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`h-px bg-current transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`h-px bg-current transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`h-px bg-current transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {/* ── Mobile Menu ─────────────────────────────────────────────────── */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            mobileOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-white/[0.06] pt-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.06]">
              <Link href="/login" className="btn-outline flex-1 text-center py-2 text-sm">
                Log In
              </Link>
              <Link href="/register" className="btn-primary flex-1 text-center py-2 text-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
