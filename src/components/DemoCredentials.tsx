"use client";

import { useState } from "react";

interface DemoCredentialsProps {
  onFillCredentials?: (email: string, pass: string) => void;
  onQuickLogin?: (email: string, pass: string) => void;
  loading?: boolean;
}

export default function DemoCredentials({
  onFillCredentials,
  onQuickLogin,
  loading = false,
}: DemoCredentialsProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const accounts = [
    {
      roleTitle: "Explorer (User)",
      roleBadge: "Standard User",
      badgeColor: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
      email: "demo@wayfarer.com",
      password: "Demo@123",
      description: "Search stays, book reservations, submit reviews & view personal dashboard.",
      icon: (
        <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
    {
      roleTitle: "Boutique Host (Admin)",
      roleBadge: "Administrator",
      badgeColor: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      email: "admin@wayfarer.com",
      password: "Admin@123",
      description: "Access Admin portal, manage users, modify booking statuses & view analytics.",
      icon: (
        <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-5 dark:border-zinc-800/80 dark:bg-zinc-900/40 backdrop-blur-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0121 8.25z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Demo Credentials</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Click to auto-fill or sign in immediately</p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          Ready to test
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {accounts.map((acc, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-white p-3.5 shadow-sm transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:border-zinc-700"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {acc.icon}
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {acc.roleTitle}
                  </span>
                </div>
                <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${acc.badgeColor}`}>
                  {acc.roleBadge}
                </span>
              </div>

              {/* Email & Password Rows */}
              <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-mono bg-zinc-50 dark:bg-zinc-900/80 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800/60 mb-3">
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate selection:bg-indigo-500 selection:text-white">
                    <strong className="text-zinc-400 font-sans font-normal">Email: </strong>
                    {acc.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(acc.email, `email-${idx}`)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 transition-colors"
                    title="Copy Email"
                  >
                    {copiedKey === `email-${idx}` ? (
                      <span className="text-[10px] text-emerald-500 font-sans font-bold">Copied!</span>
                    ) : (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v2.25A2.25 2.25 0 0113.5 21.75h-7.5A2.25 2.25 0 013.75 19.5v-7.5A2.25 2.25 0 016 9.75h2.25m4.5 0h7.5A2.25 2.25 0 0122.5 12v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-7.5z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-1">
                  <span className="truncate">
                    <strong className="text-zinc-400 font-sans font-normal">Pass: </strong>
                    {acc.password}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(acc.password, `pass-${idx}`)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 transition-colors"
                    title="Copy Password"
                  >
                    {copiedKey === `pass-${idx}` ? (
                      <span className="text-[10px] text-emerald-500 font-sans font-bold">Copied!</span>
                    ) : (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v2.25A2.25 2.25 0 0113.5 21.75h-7.5A2.25 2.25 0 013.75 19.5v-7.5A2.25 2.25 0 016 9.75h2.25m4.5 0h7.5A2.25 2.25 0 0122.5 12v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-7.5z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 pt-1">
              {onFillCredentials && (
                <button
                  type="button"
                  onClick={() => onFillCredentials(acc.email, acc.password)}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-zinc-200 bg-white py-1.5 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  Auto Fill
                </button>
              )}
              {onQuickLogin && (
                <button
                  type="button"
                  onClick={() => onQuickLogin(acc.email, acc.password)}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-zinc-900 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  Login
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
