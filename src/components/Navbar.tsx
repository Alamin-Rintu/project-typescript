"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";


const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Our Story", href: "/about" },

];

const privateLinks = [
  { label: "Add Listing", href: "/addListing" },
  { label: "Dashboard", href: "/dashboard" },
];

const adminLinks = [
  { label: "Manage Users", href: "/admin/users" },
];

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Dynamic route determination based on authentication state
  const userRole = (user as { role?: string })?.role || (typeof window !== "undefined" ? localStorage.getItem("wayfarer_role") : null);
  const isAdmin = userRole === "admin";
  const activeNavLinks = user
    ? isAdmin
      ? [...publicLinks, ...privateLinks, ...adminLinks]
      : [...publicLinks, ...privateLinks]
    : publicLinks;

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      setMobileOpen(false);
    });
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isHomepage = pathname === "/";
  const useLightText = isHomepage && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-sm border-b border-zinc-200/50 dark:border-zinc-800/50"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Brand Logo - Wayfarer Aesthetic */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-indigo-500/25">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className={`text-md font-bold tracking-tight ${useLightText ? "text-white" : "text-zinc-900 dark:text-zinc-50"} leading-none`}>
              Wayfarer
            </span>
            <span className={`text-[10px] ${useLightText ? "text-white/60" : "text-zinc-400"} font-medium tracking-wider uppercase mt-0.5 hidden sm:block`}>
              Boutique Market
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {activeNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  useLightText
                    ? isActive
                      ? "text-white font-semibold"
                      : "text-white/80 hover:text-white"
                    : isActive
                      ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {isActive && (
                  <span className={`absolute inset-x-4 bottom-0 h-0.5 rounded-full ${
                    useLightText ? "bg-white" : "bg-indigo-600 dark:bg-indigo-400"
                  }`} />
                )}
                {!isActive && (
                  <span className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200 hover:opacity-100">
                    <span className={`absolute inset-1 rounded-md ${
                      useLightText ? "bg-white/10" : "bg-zinc-100 dark:bg-zinc-800"
                    }`} />
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[11px] font-bold text-white shadow-md ring-2 ring-indigo-500/20">
                  {user.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "EX"}
                </div>
                <div className="flex flex-col">
                  <span className={`text-[10px] ${useLightText ? "text-white/60" : "text-zinc-500 dark:text-zinc-400"} font-semibold uppercase tracking-wider leading-none`}>
                    Welcome
                  </span>
                  <span className={`text-sm font-bold ${useLightText ? "text-white" : "text-zinc-950 dark:text-zinc-50"} leading-none mt-0.5`}>
                    {user.name?.split(" ")[0] || "Explorer"}
                  </span>
                </div>
              </div>
              {isAdmin && (
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[9px] font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                  ADMIN
                </span>
              )}
              <button
                onClick={handleSignOut}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  useLightText
                    ? "border-white/20 bg-white/10 text-white hover:bg-white/20 hover:scale-102"
                    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 hover:scale-102"
                }`}
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  useLightText
                    ? "text-white/95 hover:bg-white/10 hover:text-white"
                    : "text-zinc-750 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-100"
              >
                <span className="relative z-10">Get Started</span>
                <svg
                  className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity duration-300 hover:opacity-100" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 md:hidden ${
            useLightText
              ? "text-white hover:bg-white/10"
              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <span className="sr-only">Toggle Menu</span>
          <div className="flex flex-col items-center justify-center gap-1.5">
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu Backdrop Overlay */}
      <div
        className={`fixed inset-0 top-0 z-40 transition-all duration-300 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/40" />
      </div>

      {/* Mobile Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 transform border-l border-zinc-200 bg-white shadow-2xl transition-all duration-300 ease-out dark:border-zinc-800 dark:bg-zinc-950 md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            Wayfarer Directory
          </span>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Links List */}
        <div className="flex flex-col gap-1 px-4 pt-4">
          {activeNavLinks.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                }`}
                style={{
                  animation: mobileOpen
                    ? `slideIn 0.3s ease-out ${index * 0.05 + 0.1}s both`
                    : "none",
                }}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isActive
                      ? "bg-indigo-600 dark:bg-indigo-400"
                      : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Auth Actions Area */}
        <div className="mt-6 border-t border-zinc-100 px-6 pt-6 dark:border-zinc-800">
          {user ? (
            <div className="flex flex-col gap-3">
              <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                Signed in as{" "}
                <p className="font-semibold text-zinc-950 dark:text-zinc-50 truncate">
                  {user.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center justify-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                className="flex w-full items-center justify-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:opacity-90"
              >
                Get Started
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Keyframe Injection for entry animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
}