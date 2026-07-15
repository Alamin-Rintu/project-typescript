"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { api } from "@/services/api";
import toast from "react-hot-toast";
import Link from "next/link";

const categories = ["Villa", "Cabin", "Apartment", "Resort"];

export default function AddListingPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  const ensureExpressToken = async (): Promise<boolean> => {
    const existingToken = localStorage.getItem("wayfarer_token");
    if (existingToken) return true;
    if (!session?.user?.email) return false;
    try {
      const password = session.user.id || "wayfarer-default-pass";
      const reg = await api.register(session.user.name || "Wayfarer User", session.user.email, password);
      localStorage.setItem("wayfarer_token", reg.token);
      return true;
    } catch {
      try {
        const log = await api.login(session.user.email, session.user.id || "wayfarer-default-pass");
        localStorage.setItem("wayfarer_token", log.token);
        return true;
      } catch { return false; }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!session?.user) {
      toast.error("Please sign in to create a listing");
      router.push("/signin");
      return;
    }
    setLoading(true);
    const hasToken = await ensureExpressToken();
    if (!hasToken) {
      toast.error("Authentication failed. Try signing in again.");
      setLoading(false);
      return;
    }
    const formData = new FormData(form);
    const payload = {
      title: formData.get("title") as string,
      shortDescription: formData.get("shortDescription") as string,
      fullDescription: (formData.get("fullDescription") as string) || "",
      category: formData.get("category") as string,
      price: Number(formData.get("price")),
      location: formData.get("location") as string,
      images: [(formData.get("imageUrl") as string) || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
      date: new Date().toISOString().split("T")[0],
    };
    try {
      const result = await api.createItem(payload);
      toast.success("Listing created successfully! 🎉");
      router.push("/items/" + result.itemId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create listing";
      toast.error(message);
      console.error("Create listing error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-zinc-500">Publishing your listing...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/30">
            <svg className="h-8 w-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">Sign in required</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">You need to be signed in to create a property listing.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signin" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500">Sign In</Link>
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-24 pb-16 px-4 sm:px-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm bg-white dark:bg-zinc-900/50 backdrop-blur-md">
        <div className="mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Create Listing</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Fill in the details to publish your property to the global network.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Property Title <span className="text-red-500">*</span></label>
              <input name="title" required placeholder="e.g. Luxury Beach Villa" className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder:text-zinc-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Category <span className="text-red-500">*</span></label>
              <select name="category" required className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100">
                <option value="">Select a category</option>
                {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Location <span className="text-red-500">*</span></label>
              <input name="location" required placeholder="e.g. Maldives" className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder:text-zinc-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Price Per Night ($) <span className="text-red-500">*</span></label>
              <input name="price" type="number" required min={1} placeholder="250" className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder:text-zinc-500" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Image URL</label>
              <input name="imageUrl" type="url" placeholder="https://images.unsplash.com/photo-..." className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder:text-zinc-500" />
              <p className="mt-1.5 text-xs text-zinc-400">Optional. A default image will be used if not provided.</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Short Description <span className="text-red-500">*</span></label>
              <textarea name="shortDescription" required rows={3} placeholder="A brief summary highlighting the unique qualities of your property..." className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder:text-zinc-500" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Description</label>
              <textarea name="fullDescription" rows={5} placeholder="Detailed description of your property, amenities, and what makes it special..." className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder:text-zinc-500" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <Link href="/items/manage" className="rounded-xl border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50">Cancel</Link>
            <div className="flex items-center gap-3">
              <p className="text-xs text-zinc-400 hidden sm:block">All fields marked with <span className="text-red-500">*</span> are required</p>
              <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Publishing...</>
                ) : (
                  <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> Publish Listing</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900/30">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">After publishing</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Your listing will appear on the Explore page and can be managed from your Manage Items dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
