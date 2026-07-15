"use client";

import Link from "next/link";

const posts = [
  {
    title: "10 Most Beautiful Beach Destinations for 2026",
    excerpt: "Discover the world's most stunning coastal paradises, from the Maldives to the Amalfi Coast.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    date: "Jun 12, 2026",
    author: "Maria Torres",
    category: "Travel Tips",
  },
  {
    title: "The Ultimate Guide to Luxury Villa Rentals",
    excerpt: "Everything you need to know about booking the perfect luxury villa for your next getaway.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    date: "May 28, 2026",
    author: "David Kim",
    category: "Guides",
  },
  {
    title: "Digital Nomad: Best Cities for Remote Work",
    excerpt: "Top cities around the world with the best infrastructure for remote workers and digital nomads.",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80",
    date: "May 15, 2026",
    author: "Sarah Chen",
    category: "Lifestyle",
  },
];

export default function LatestBlogs() {
  return (
    <section className="py-20 sm:py-28 bg-zinc-50/50 dark:bg-zinc-900/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              Journal
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Latest from the Blog
            </h2>
            <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400 max-w-2xl">
              Travel inspiration, guides, and tips from our community.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            View All Posts
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.title} href="/blog" className="group block">
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900/80">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mb-3">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                      {post.category}
                    </span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors line-clamp-2 dark:text-zinc-100 dark:group-hover:text-indigo-400">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">By {post.author}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
