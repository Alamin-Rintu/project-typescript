"use client";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Solo Traveler",
    avatar: "SM",
    content: "Wayfarer made finding the perfect villa effortless. The property exceeded our expectations - stunning views, impeccable service. Already planning our next trip!",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Digital Nomad",
    avatar: "JR",
    content: "I've used many booking platforms, but Wayfarer stands out. The curated selection saved me hours of research. The mountain cabin was absolutely magical.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "Family Traveler",
    avatar: "EC",
    content: "Finding family-friendly accommodations used to be a hassle. Wayfarer's detailed listings and reviews helped us find the perfect resort for our family vacation.",
    rating: 4,
  },
  {
    name: "Marcus Williams",
    role: "Business Traveler",
    avatar: "MW",
    content: "The city apartments are perfect for business trips. Prime locations, fast WiFi, and all the amenities I need. Highly recommended for professionals.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            Testimonials
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            What Our Travelers Say
          </h2>
          <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Real experiences from real travelers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < t.rating ? "text-amber-400" : "text-zinc-200 dark:text-zinc-700"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed dark:text-zinc-400">&ldquo;{t.content}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t.name}</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
