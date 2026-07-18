"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setError(error.message || "Invalid email or password.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setValue("email", "demo@smartrecipe.com");
    setValue("password", "demo1234");
    await onSubmit({ email: "demo@smartrecipe.com", password: "demo1234" });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md glass-card p-8 sm:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden bg-[#1c1209]/80 border-white/[0.05]">
        {/* Abstract background blobs */}
        <div className="absolute -top-1/2 -right-1/2 w-full aspect-square bg-primary-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full aspect-square bg-secondary-600/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              Welcome Back
            </h1>
            <p className="text-neutral-400">
              Sign in to access your saved recipes and meal plans.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className={`w-full bg-white/[0.03] border ${
                  errors.email ? "border-red-500/50 focus:ring-red-500/20" : "border-white/10 focus:border-primary-500/50 focus:ring-primary-500/20"
                } rounded-xl py-3 px-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all`}
              />
              {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className={`w-full bg-white/[0.03] border ${
                  errors.password ? "border-red-500/50 focus:ring-red-500/20" : "border-white/10 focus:border-primary-500/50 focus:ring-primary-500/20"
                } rounded-xl py-3 px-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all`}
              />
              {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3.5 shadow-glow-primary flex justify-center items-center mt-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-white/[0.08]"></div>
            <span className="px-4 text-sm text-neutral-500">or</span>
            <div className="flex-1 border-t border-white/[0.08]"></div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full btn-outline py-3 flex justify-center items-center"
            >
              Demo Login
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
