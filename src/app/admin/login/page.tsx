"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Full navigation so middleware/layout pick up the new session cookies.
    router.replace(redirect);
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-muted px-6 py-16">
      <div className="w-full max-w-sm rounded-lg border border-border bg-white p-8 shadow-card">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="relative h-12 w-16">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/logo.png`}
              alt="Solic Medical"
              fill
              priority
              className="object-contain"
            />
          </span>
          <h1 className="mt-3 text-lg font-semibold text-navy-900">
            Admin sign in
          </h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-navy-800"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2.5 text-sm focus:border-navy-400 focus:outline-none focus:ring-1 focus:ring-navy-400"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-navy-800"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2.5 text-sm focus:border-navy-400 focus:outline-none focus:ring-1 focus:ring-navy-400"
            />
          </div>

          {error && (
            <p className="rounded-md bg-accent-50 px-3 py-2 text-sm text-accent-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
