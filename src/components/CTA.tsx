"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 sm:py-28 bg-zinc-50/50 dark:bg-zinc-900/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* For Travelers */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-10 sm:p-14 dark:from-zinc-950 dark:to-zinc-900">
            <div className="absolute right-0 top-0 h-40 w-40 translate-x-8 -translate-y-8 rounded-full bg-indigo-500/10" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white sm:text-3xl">Looking for Your Next Adventure?</h3>
              <p className="mt-3 text-zinc-300 leading-relaxed max-w-md">
                Browse thousands of hand-picked properties worldwide and find the perfect home away from home.
              </p>
              <Link
                href="/explore"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-zinc-900 shadow-lg transition-all duration-200 hover:bg-zinc-100 hover:-translate-y-0.5"
              >
                Explore Properties
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* For Hosts */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-10 sm:p-14">
            <div className="absolute right-0 top-0 h-40 w-40 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white sm:text-3xl">Want to List Your Property?</h3>
              <p className="mt-3 text-indigo-100 leading-relaxed max-w-md">
                Join our community of hosts and showcase your property to travelers from around the globe.
              </p>
              <Link
                href="/addListing"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition-all duration-200 hover:bg-indigo-50 hover:-translate-y-0.5"
              >
                Start Listing
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
