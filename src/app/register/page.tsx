"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signUp } from "@/lib/auth-client";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (error) {
        setError(error.message || "Registration failed. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md glass-card p-8 sm:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden bg-[#1c1209]/80 border-white/[0.05]">
        {/* Abstract background blobs */}
        <div className="absolute -top-1/2 -left-1/2 w-full aspect-square bg-secondary-600/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full aspect-square bg-primary-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              Create an Account
            </h1>
            <p className="text-neutral-400">
              Join SmartRecipe to start your AI-powered culinary journey.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Full Name</label>
              <input
                {...register("name")}
                type="text"
                placeholder="John Doe"
                className={`w-full bg-white/[0.03] border ${
                  errors.name ? "border-red-500/50 focus:ring-red-500/20" : "border-white/10 focus:border-primary-500/50 focus:ring-primary-500/20"
                } rounded-xl py-3 px-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all`}
              />
              {errors.name && <p className="mt-1.5 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className={`w-full bg-white/[0.03] border ${
                  errors.email ? "border-red-500/50 focus:ring-red-500/20" : "border-white/10 focus:border-primary-500/50 focus:ring-primary-500/20"
                } rounded-xl py-3 px-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all`}
              />
              {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className={`w-full bg-white/[0.03] border ${
                  errors.password ? "border-red-500/50 focus:ring-red-500/20" : "border-white/10 focus:border-primary-500/50 focus:ring-primary-500/20"
                } rounded-xl py-3 px-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all`}
              />
              {errors.password && <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Confirm Password</label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className={`w-full bg-white/[0.03] border ${
                  errors.confirmPassword ? "border-red-500/50 focus:ring-red-500/20" : "border-white/10 focus:border-primary-500/50 focus:ring-primary-500/20"
                } rounded-xl py-3 px-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all`}
              />
              {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3.5 shadow-glow-primary flex justify-center items-center mt-6"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-400">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
