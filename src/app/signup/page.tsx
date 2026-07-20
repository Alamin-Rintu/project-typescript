"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user");
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address.";
    }

    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Must contain at least one uppercase letter.";
    } else if (!/\d/.test(password)) {
      errors.password = "Must contain at least one number.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const signUpEmail = authClient.signUp.email as unknown as (params: {
        name: string;
        email: string;
        password: string;
        role: "user" | "admin";
      }) => Promise<{
        data: { user: { id: string; name: string; email: string; role: string } } | null;
        error: { message?: string } | null;
      }>;

      const { data, error } = await signUpEmail({
        name,
        email,
        password,
        role: selectedRole,
      });

      if (error) {
        setSubmitError(error.message || "Signup failed.");
        return;
      }

      if (data) {
        router.push(selectedRole === "admin" ? "/items/manage" : "/explore");
      }
    } catch {
      setSubmitError("An unexpected error occurred during signup.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      {/* Visual Side-Panel (Desktop only) */}
      <div className="relative hidden w-1/2 lg:block">
        <img
          src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80"
          alt="Boutique Hosting"
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
              &ldquo;Listing our boutique cabins on Wayfarer doubled our booking rates in under two months. The automated host features and profile dashboard are premier.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">CM</div>
              <div>
                <p className="text-sm font-semibold text-white">Claire Moreau</p>
                <p className="text-xs text-white/60">Alpine Retreat Host</p>
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
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Create Account</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Join our marketplace to search stays or host properties.
            </p>
          </div>

          {/* Quick Demo Access Hint */}
          <div className="mb-6 rounded-xl border border-indigo-200/80 bg-indigo-50/60 p-3.5 text-xs text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-950/30 dark:text-indigo-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-[10px]">
                🔑
              </span>
              <span>Looking to test without creating an account? Use <strong>Demo Credentials</strong>.</span>
            </div>
            <Link
              href="/signin"
              className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 font-bold text-white shadow-xs hover:bg-indigo-500 transition-colors"
            >
              Demo Login
            </Link>
          </div>

          {submitError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50/50 p-4 text-sm text-red-600 dark:border-red-950/20 dark:bg-red-950/20 dark:text-red-400 flex items-start gap-2.5">
              <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{submitError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Full Name</label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <svg className="h-5 w-5 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (validationErrors.name) setValidationErrors(prev => ({ ...prev, name: "" }));
                  }}
                  required
                  placeholder="John Doe"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white/50 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-zinc-900/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 transition-all ${
                    validationErrors.name ? "border-red-500 dark:border-red-900/50" : "border-zinc-200 dark:border-zinc-800"
                  }`}
                />
              </div>
              {validationErrors.name && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{validationErrors.name}</p>
              )}
            </div>

            {/* Email */}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: "" }));
                  }}
                  required
                  placeholder="name@example.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white/50 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-zinc-900/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 transition-all ${
                    validationErrors.email ? "border-red-500 dark:border-red-900/50" : "border-zinc-200 dark:border-zinc-800"
                  }`}
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{validationErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Password</label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <svg className="h-5 w-5 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: "" }));
                  }}
                  required
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-white/50 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-zinc-900/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 transition-all ${
                    validationErrors.password ? "border-red-500 dark:border-red-900/50" : "border-zinc-200 dark:border-zinc-800"
                  }`}
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
              <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                Min 8 characters, one uppercase, one number.
              </p>
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{validationErrors.password}</p>
              )}
            </div>

            {/* Segmented Control Account Type */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Account Type</label>
              <div className="relative grid grid-cols-2 gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
                <button
                  type="button"
                  onClick={() => setSelectedRole("user")}
                  className={`relative rounded-lg py-2.5 text-sm font-semibold tracking-wide transition-all ${
                    selectedRole === "user"
                      ? "bg-white text-indigo-600 shadow-md dark:bg-zinc-700 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  Explorer (Stay)
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("admin")}
                  className={`relative rounded-lg py-2.5 text-sm font-semibold tracking-wide transition-all ${
                    selectedRole === "admin"
                      ? "bg-white text-indigo-600 shadow-md dark:bg-zinc-700 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  Boutique Host
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
