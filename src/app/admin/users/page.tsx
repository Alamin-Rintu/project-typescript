"use client";

import { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/services/api";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [checkingRole, setCheckingRole] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getAllUsers(page, 20);
      setUsers(result.users);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!session?.user) {
      router.push("/signin");
      return;
    }

    // Sync Express JWT token first so API calls work
    const initAdmin = async () => {
      await api.ensureExpressToken(session.user);

      // Check if user is admin
      const sessionRole = (session.user as { role?: string }).role;
      if (sessionRole) {
        if (sessionRole !== "admin") {
          router.push("/dashboard");
          return;
        }
        fetchUsers();
        setCheckingRole(false);
        return;
      }

      // Fallback: check from API
      try {
        const profile = await api.getProfile();
        if (profile.user.role !== "admin") {
          router.push("/dashboard");
          return;
        }
        localStorage.setItem("wayfarer_role", profile.user.role);
        fetchUsers();
      } catch {
        const storedRole = localStorage.getItem("wayfarer_role");
        if (storedRole !== "admin") {
          router.push("/dashboard");
          return;
        }
        fetchUsers();
      } finally {
        setCheckingRole(false);
      }
    };
    initAdmin();
  }, [session, router, fetchUsers]);

  if (!session?.user || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-zinc-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboard" className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              ← Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Manage Users</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {total} registered {total === 1 ? "user" : "users"} on the platform
          </p>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Name</th>
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="text-center py-3.5 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Role</th>
                  <th className="text-right py-3.5 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-zinc-50 dark:border-zinc-800/50">
                      {[1, 2, 3, 4].map((j) => (
                        <td key={j} className="py-4 px-6">
                          <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" style={{ width: `${60 + j * 10}%` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u.id} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                            {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 hidden sm:table-cell text-zinc-500">{u.email}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}>
                          {u.role === "admin" && (
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                          )}
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-xs text-zinc-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }) : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="py-12 text-center text-sm text-zinc-400">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-zinc-400">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
