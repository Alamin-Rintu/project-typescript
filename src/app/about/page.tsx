"use client";

import Link from "next/link";

const stats = [
  { label: "Properties Listed", value: "89+" },
  { label: "Happy Travelers", value: "12K+" },
  { label: "Countries Covered", value: "45+" },
  { label: "Years in Business", value: "5+" },
];

const team = [
  { name: "Alexandra Reed", role: "CEO & Founder", avatar: "AR", bio: "Former travel journalist with a passion for connecting people with extraordinary places." },
  { name: "Marcus Chen", role: "CTO", avatar: "MC", bio: "Full-stack architect who believes technology should make travel seamless and joyful." },
  { name: "Sofia Patel", role: "Head of Operations", avatar: "SP", bio: "Operations expert ensuring every booking experience is smooth and hassle-free." },
  { name: "James O'Brien", role: "Community Manager", avatar: "JO", bio: "Building a global community of hosts and travelers who share a love for exploration." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="relative py-20 sm:py-28 bg-gradient-to-b from-zinc-900 to-zinc-800 dark:from-zinc-950 dark:to-zinc-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">Our Story</span>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Redefining Travel <br className="sm:hidden" />
            <span className="text-indigo-400">One Stay at a Time</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-zinc-300 leading-relaxed">
            Wayfarer was born from a simple belief: that where you stay should be as memorable as the destination itself. We curate extraordinary accommodations for travelers who seek more than just a place to sleep.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stat.value}</p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Our Mission</span>
            <h2 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">Making Travel Extraordinary</h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We believe that accommodation is the heart of any journey. That&apos;s why we personally verify every property, vet every host, and ensure every listing meets our rigorous quality standards. Our platform connects discerning travelers with property owners who share a passion for hospitality.
            </p>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              From luxury villas in the Maldives to cozy cabins in the Swiss Alps, we offer a curated selection of the world&apos;s finest accommodations. Each property is chosen for its unique character, exceptional quality, and the unforgettable experiences it offers.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" alt="Luxury villa" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Our Team</span>
          <h2 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">Meet the People Behind Wayfarer</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.name} className="rounded-2xl border border-zinc-200 bg-white p-6 text-center transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white">
                {member.avatar}
              </div>
              <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">{member.name}</h3>
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{member.role}</p>
              <p className="mt-3 text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-20">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-10 sm:p-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Start Your Journey?</h2>
          <p className="mt-4 text-indigo-100 max-w-lg mx-auto">Join thousands of travelers who trust Wayfarer for unforgettable stays around the world.</p>
          <Link href="/explore" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-indigo-700 shadow-lg transition-all hover:bg-indigo-50 hover:-translate-y-0.5">
            Explore Properties
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
