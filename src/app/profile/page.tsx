"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useSession, signOut } from "@/lib/auth-client";

function initialsOf(name?: string, email?: string) {
  if (name && name.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");
  }
  if (email) return email[0]?.toUpperCase() || "U";
  return "U";
}

function ProfileContent() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/10 border-t-[#E8872B] rounded-full animate-spin" />
          <p className="text-neutral-400 text-sm">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  const { name, email, id, createdAt } = session.user;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-2">
          Account
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">
          Profile <span className="gradient-text">Settings</span>
        </h1>
      </div>

      <div className="glass-card rounded-3xl p-8 bg-[#1c1209]/80 border-white/[0.05]">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white text-3xl font-semibold shrink-0">
            {initialsOf(name, email)}
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold text-white truncate">
              {name || "SmartRecipe User"}
            </h2>
            <p className="text-neutral-400 truncate">{email}</p>
          </div>
        </div>

        <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mb-8">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
              Full name
            </dt>
            <dd className="text-white">{name || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
              Email
            </dt>
            <dd className="text-white truncate">{email}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
              User ID
            </dt>
            <dd className="text-neutral-300 font-mono text-sm truncate">{id}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
              Member since
            </dt>
            <dd className="text-neutral-300">
              {createdAt ? new Date(createdAt).toLocaleDateString() : "—"}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/[0.06]">
          <Link href="/dashboard" className="btn-primary px-6 py-3 text-center flex-1 sm:flex-none">
            Go to Dashboard
          </Link>
          <button
            onClick={handleSignOut}
            className="px-6 py-3 text-center rounded-full text-red-400 font-semibold border border-red-500/20 hover:bg-red-500/10 transition-colors flex-1 sm:flex-none"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
