import { createAuthClient } from "better-auth/react";

// The frontend proxies all /api/* calls (including Better Auth's /api/auth/*)
// to the Express backend via the Next.js rewrites in next.config.mjs. So in the
// browser we simply use the current origin — the proxy forwards to the backend,
// which is the single source of truth for auth.
export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
