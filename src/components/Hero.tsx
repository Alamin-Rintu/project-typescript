"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Link from "next/link";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
    badge: "Premium Holiday Homes",
    title: "Discover Extraordinary\nStays Worldwide",
    subtitle: "From luxury villas to mountain cabins, find your perfect escape with hand-picked accommodations.",
  },
  {
    image: "https://images.unsplash.com/photo-1582268611958-ebfd1619efcf?w=1920&q=80",
    badge: "Curated Experiences",
    title: "Live Like a Local\nAnywhere You Go",
    subtitle: "Immerse yourself in authentic travel experiences with our curated collection of unique properties.",
  },
  {
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=80",
    badge: "Book with Confidence",
    title: "Your Dream Getaway\nIs Just a Click Away",
    subtitle: "Secure booking, verified properties, and 24/7 support for a stress-free travel experience.",
  },
];

export default function Hero() {
  return (
    <section className="relative h-screen max-h-[700px] min-h-[600px] w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        speed={1200}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-full w-full"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
              {/* Multiple gradient layers for depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              
              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                  <div className="max-w-3xl">
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                      {slide.badge}
                    </span>
                    <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl lg:leading-tight whitespace-pre-line">
                      {slide.title}
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg lg:text-xl">
                      {slide.subtitle}
                    </p>
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                      <Link
                        href="/explore"
                        className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-zinc-900 shadow-2xl transition-all duration-300 hover:bg-zinc-100 hover:-translate-y-0.5 hover:shadow-3xl sm:text-base"
                      >
                        Explore Stays
                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                      <Link
                        href="/about"
                        className="group inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 sm:text-base"
                      >
                        Learn More
                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-white/60">Scroll</span>
        <div className="h-10 w-6 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
          <div className="h-2 w-1.5 rounded-full bg-white/70 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
