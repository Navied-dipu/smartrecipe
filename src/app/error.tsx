"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="glass-card rounded-3xl p-8 sm:p-12 max-w-md w-full text-center bg-[#1c1209]/80 border-white/[0.05]">
        <div className="w-16 h-16 rounded-full bg-secondary-600/15 border border-secondary-500/30 flex items-center justify-center text-3xl mx-auto mb-6">
          🍽️
        </div>
        <h1 className="font-display text-3xl font-bold text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-neutral-400 mb-8 leading-relaxed">
          We hit an unexpected error while preparing this page. You can try again,
          or head back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={reset} className="btn-primary px-6 py-3 w-full sm:w-auto">
            Try Again
          </button>
          <Link href="/" className="btn-outline px-6 py-3 w-full sm:w-auto text-center">
            Go Home
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-neutral-600">Error ref: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
