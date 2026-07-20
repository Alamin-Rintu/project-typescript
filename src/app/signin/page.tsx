"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DemoCredentials from "@/components/DemoCredentials";

import { api } from "@/services/api";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let { data, error: signInError } = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
      });

      // Auto-provision demo account if for any reason it wasn't in Better Auth yet
      if (signInError && (email === "demo@wayfarer.com" || email === "admin@wayfarer.com")) {
        const isAdmin = email === "admin@wayfarer.com";
        const name = isAdmin ? "Admin User" : "Demo User";
        const role = isAdmin ? "admin" : "user";

        const signUpFn = authClient.signUp.email as unknown as (params: {
          name: string;
          email: string;
          password: string;
          role: string;
        }) => Promise<{
          data: { user: { id: string; name: string; email: string; role: string } } | null;
          error: { message?: string } | null;
        }>;

        const { data: signUpData, error: signUpErr } = await signUpFn({
          name,
          email,
          password,
          role,
        });

        if (!signUpErr && signUpData) {
          const retryRes = await authClient.signIn.email({
            email,
            password,
            rememberMe: true,
          });
          data = retryRes.data;
          signInError = retryRes.error;
        }
      }

      if (signInError) {
        setError(signInError.message || "Invalid email or password");
        return;
      }

      if (data?.user) {
        const userRole = (data.user as { role?: string }).role || (data.user.email === "admin@wayfarer.com" ? "admin" : "user");
        await api.ensureExpressToken({ ...data.user, role: userRole });
        router.push(userRole === "admin" ? "/admin/users" : "/dashboard");
      } else {
        router.push("/");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError(null);

    try {
      let { data, error: signInError } = await authClient.signIn.email({
        email: demoEmail,
        password: demoPass,
        rememberMe: true,
      });

      // Auto-provision demo account if missing in Better Auth
      if (signInError) {
        const isAdmin = demoEmail === "admin@wayfarer.com";
        const name = isAdmin ? "Admin User" : "Demo User";
        const role = isAdmin ? "admin" : "user";

        const signUpFn = authClient.signUp.email as unknown as (params: {
          name: string;
          email: string;
          password: string;
          role: string;
        }) => Promise<{
          data: { user: { id: string; name: string; email: string; role: string } } | null;
          error: { message?: string } | null;
        }>;

        const { data: signUpData, error: signUpErr } = await signUpFn({
          name,
          email: demoEmail,
          password: demoPass,
          role,
        });

        if (!signUpErr && signUpData) {
          const retryRes = await authClient.signIn.email({
            email: demoEmail,
            password: demoPass,
            rememberMe: true,
          });
          data = retryRes.data;
          signInError = retryRes.error;
        }
      }

      if (signInError) {
        setError(signInError.message || "Demo login failed");
        return;
      }

      if (data?.user) {
        const userRole = (data.user as { role?: string }).role || (data.user.email === "admin@wayfarer.com" ? "admin" : "user");
        await api.ensureExpressToken({ ...data.user, role: userRole });
        router.push(userRole === "admin" ? "/admin/users" : "/dashboard");
      } else {
        router.push("/");
      }
    } catch {
      setError("Demo login failed due to an error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      {/* Visual Side-Panel (Desktop only) */}
      <div className="relative hidden w-1/2 lg:block">
        <img
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80"
          alt="Luxury Stays"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Gradients and overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-950/60 to-zinc-900/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent_50%)]" />

        {/* Branding Message & Testimonial */}
        <div className="absolute inset-x-12 bottom-20">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="h-4.5 w-4.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-lg font-medium text-white leading-relaxed">
              &ldquo;The service was absolutely impeccable, and the villa exceeded all expectations. A truly unforgettable escape curated by professionals.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">MV</div>
              <div>
                <p className="text-sm font-semibold text-white">Marcus Vance</p>
                <p className="text-xs text-white/60">Luxury Travel Editor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side-Panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Welcome Back</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Sign in to your account to manage stays and bookings.
            </p>
          </div>

          {/* Interactive Demo Credentials Card */}
          <div className="mb-6">
            <DemoCredentials
              onFillCredentials={handleFillCredentials}
              onQuickLogin={handleQuickLogin}
              loading={loading}
            />
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50/50 p-4 text-sm text-red-600 dark:border-red-950/20 dark:bg-red-950/20 dark:text-red-400 flex items-start gap-2.5">
              <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Email Address</label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <svg className="h-5 w-5 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 bg-white/50 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Password</label>
                <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  Forgot password?
                </a>
              </div>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <svg className="h-5 w-5 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-zinc-200 bg-white/50 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-350"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/signup"
              className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

