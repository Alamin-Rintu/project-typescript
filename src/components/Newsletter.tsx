"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 px-8 py-16 sm:px-16 sm:py-20">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white" />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Stay in the Loop
            </h2>
            <p className="mt-4 text-base text-indigo-100 leading-relaxed">
              Subscribe to our newsletter for exclusive deals, travel inspiration, and new property alerts delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder:text-indigo-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button
                type="submit"
                className="rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition-all duration-200 hover:bg-indigo-50 hover:shadow-xl"
              >
                {subscribed ? "Subscribed! 🎉" : "Subscribe"}
              </button>
            </form>
            <p className="mt-4 text-xs text-indigo-200">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
