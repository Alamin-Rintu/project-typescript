"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How do I book a property?",
    a: "Simply browse our listings, select your desired property, and click 'Book Now'. You'll be guided through the reservation process. For detailed inquiries, you can contact the host directly through our messaging system.",
  },
  {
    q: "Is my payment secure?",
    a: "Absolutely. We use enterprise-grade encryption and secure payment processors. Your financial information is never stored on our servers. All transactions are protected by our buyer guarantee policy.",
  },
  {
    q: "Can I cancel my booking?",
    a: "Cancellation policies vary by property and are clearly stated on each listing page. Many hosts offer free cancellation within 48 hours of booking. We recommend reviewing the cancellation policy before confirming your reservation.",
  },
  {
    q: "How are properties verified?",
    a: "Each property undergoes a thorough verification process including photo verification, quality checks, and host background screening. We regularly review listings to maintain our quality standards.",
  },
  {
    q: "What if I have issues during my stay?",
    a: "Our 24/7 support team is always available to assist you. Whether it's a maintenance issue or a question about the property, we're just a message or phone call away.",
  },
  {
    q: "How do I become a host?",
    a: "Creating a listing is free and easy. Sign up for an account, click 'Add Item', and follow the simple setup process. Our team will review your listing and help you get started.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">
            Everything you need to know about Wayfarer.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-zinc-200 bg-white overflow-hidden transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pr-4">
                  {faq.q}
                </span>
                <svg
                  className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-6 pb-5 text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
