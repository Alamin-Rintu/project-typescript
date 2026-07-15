"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Get in Touch</span>
          <h1 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl dark:text-zinc-50">We&apos;d Love to Hear From You</h1>
          <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Have a question, feedback, or want to partner with us? Our team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            {[
              {
                title: "Email Us",
                content: "hello@wayfarer.com",
                sub: "We reply within 24 hours",
                icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
              },
              {
                title: "Call Us",
                content: "+1 (555) 123-4567",
                sub: "Mon-Fri 9am-6pm EST",
                icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z",
              },
              {
                title: "Visit Us",
                content: "123 Travel Street",
                sub: "Adventure City, AC 10001",
                icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
              },
            ].map((info) => (
              <div key={info.title} className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={info.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{info.title}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{info.content}</p>
                    <p className="text-xs text-zinc-400">{info.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
                  <input type="text" required className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
                  <input type="email" required className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300" placeholder="john@example.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Subject</label>
                  <input type="text" required className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300" placeholder="How can we help?" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Message</label>
                  <textarea rows={5} required className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300" placeholder="Tell us more about your inquiry..." />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-xs text-zinc-400">We&apos;ll get back to you within 24 hours.</p>
                <button type="submit" className="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500">
                  {submitted ? "Message Sent! ✓" : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
