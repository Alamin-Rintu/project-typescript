"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { api } from "@/services/api";
import type { Item } from "@/types";

export default function ManageItemsPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  useEffect(() => {
    if (!session?.user) {
      router.push("/signin");
      return;
    }
    fetchItems();
  }, [session, router]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const result = await api.getMyItems();
      setItems(result.items);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setDeleting(id);
    try {
      await api.deleteItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert("Failed to delete item");
    } finally {
      setDeleting(null);
    }
  };

  if (!session?.user) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">My Properties</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {items.length} {items.length === 1 ? "property" : "properties"} listed
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex rounded-lg border border-zinc-200 p-1 dark:border-zinc-800">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-md transition-all ${viewMode === "table" ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100" : "text-zinc-400 hover:text-zinc-600"}`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100" : "text-zinc-400 hover:text-zinc-600"}`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </button>
            </div>
            <Link
              href="/addListing"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add New
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-20 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-3 w-1/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="h-20 w-20 text-zinc-200 dark:text-zinc-700 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">No properties yet</h3>
            <p className="mt-2 text-sm text-zinc-500 mb-6">Start by adding your first property listing.</p>
            <Link href="/addListing" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-500">
              Add Your First Property
            </Link>
          </div>
        ) : viewMode === "table" ? (
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Property</th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Price</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rating</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <Link href={`/items/${item._id}`} className="flex items-center gap-3">
                        <img
                          src={item.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200"}
                          alt={item.title}
                          className="h-12 w-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 transition-colors">{item.title}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">{item.location}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-medium text-zinc-900 dark:text-zinc-100">${item.price}</td>
                    <td className="py-4 px-4 text-right text-zinc-600 dark:text-zinc-400">{item.rating}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/items/${item._id}`}
                          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deleting === item._id}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400"
                        >
                          {deleting === item._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item._id} className="rounded-2xl border border-zinc-200 bg-white overflow-hidden transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50">
                <Link href={`/items/${item._id}`}>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600"}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{item.category}</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">${item.price}</span>
                  </div>
                  <Link href={`/items/${item._id}`}>
                    <h3 className="mt-1 text-sm font-semibold text-zinc-900 hover:text-indigo-600 transition-colors dark:text-zinc-100">{item.title}</h3>
                  </Link>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deleting === item._id}
                      className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition-all hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400"
                    >
                      {deleting === item._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
