"use client";

import Link from "next/link";

const featured = {
  title: "10 Most Beautiful Beach Destinations for 2026",
  excerpt: "Discover the world's most stunning coastal paradises, from the turquoise waters of the Maldives to the dramatic cliffs of the Amalfi Coast. Our travel experts have curated the definitive list of beach destinations you need to visit this year.",
  image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
  date: "Jun 12, 2026",
  author: "Maria Torres",
  category: "Travel Tips",
  readTime: "8 min read",
};

const posts = [
  {
    title: "The Ultimate Guide to Luxury Villa Rentals",
    excerpt: "Everything you need to know about booking the perfect luxury villa for your next getaway, from budgeting to amenities.",
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
  {
    title: "Sustainable Travel: Eco-Friendly Stays",
    excerpt: "How to minimize your environmental footprint while enjoying luxurious accommodations around the world.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    date: "May 2, 2026",
    author: "Emma Wilson",
    category: "Sustainability",
  },
  {
    title: "Hidden Gems: Underrated European Destinations",
    excerpt: "Skip the crowds and discover Europe's best-kept secrets. These underrated destinations offer authentic experiences.",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
    date: "Apr 20, 2026",
    author: "Lucas Fischer",
    category: "Destinations",
  },
  {
    title: "Family Travel: Best Resorts for Kids",
    excerpt: "Planning a family vacation? These resorts offer incredible amenities for children and relaxation for parents.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    date: "Apr 8, 2026",
    author: "Maria Torres",
    category: "Travel Tips",
  },
  {
    title: "Culinary Travel: Best Food Destinations",
    excerpt: "Embark on a gastronomic journey through the world's most exciting food destinations and culinary traditions.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    date: "Mar 25, 2026",
    author: "James Nakamura",
    category: "Food & Travel",
  },
];

const categories = ["All", "Travel Tips", "Guides", "Destinations", "Lifestyle", "Sustainability", "Food & Travel"];

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Our Journal</span>
          <h1 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl dark:text-zinc-50">Blog & Articles</h1>
          <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Travel inspiration, guides, and stories from our community of explorers.
          </p>
        </div>

        {/* Featured Post */}
        <Link href="/blog" className="group block mb-12">
          <div className="relative overflow-hidden rounded-3xl aspect-[21/9] min-h-[300px]">
            <img src={featured.image} alt={featured.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
              <span className="inline-block rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold text-white mb-3">
                {featured.category}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white max-w-2xl group-hover:text-indigo-200 transition-colors">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm text-zinc-300 max-w-xl line-clamp-2">{featured.excerpt}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-zinc-400">
                <span>By {featured.author}</span>
                <span>{featured.date}</span>
                <span>{featured.readTime}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                cat === "All"
                  ? "bg-indigo-600 text-white"
                  : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.title} href="/blog" className="group block">
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900/80">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                  <p className="mt-2 text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">{post.excerpt}</p>
                  <p className="mt-4 text-xs text-zinc-400">By {post.author}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
