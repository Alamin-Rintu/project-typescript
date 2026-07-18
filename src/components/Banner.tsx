"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";
import "swiper/css/effect-fade";

const slides = [
  {
    image: "/villa1.jpg",
    badge: "🌟 Premium Holiday Homes",
    title: "Luxury Beachfront Villas",
    description: "Experience premium comfort with our hand-picked luxury beachfront villas, featuring infinity pools and panoramic ocean views.",
    category: "Villa",
    actionLink: "/explore?category=Villa",
  },
  {
    image: "/villa2.jpg",
    badge: "🌲 Natural Escapes",
    title: "Charming Alpine Cabins",
    description: "Discover unique boutique log cabins nestled in pine forests, offering stone fireplaces and private hot tubs.",
    category: "Cabin",
    actionLink: "/explore?category=Cabin",
  },
  {
    image: "/villa3.jpg",
    badge: "🏖️ Unforgettable Journeys",
    title: "Book Your Dream Stay",
    description: "Find the perfect destination and enjoy a seamless booking experience across curated high-end resorts and apartments.",
    category: "",
    actionLink: "/explore",
  },
];

export default function Banner() {
  const router = useRouter();
  const swiperRef = useRef<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Search panel state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [guests, setGuests] = useState("2");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (search.trim()) query.set("search", search.trim());
    if (category) query.set("category", category);
    if (guests) query.set("guests", guests);
    router.push(`/explore?${query.toString()}`);
  };

  return (
    <section className="relative w-full h-[650px] sm:h-[750px] lg:h-[850px] overflow-hidden bg-zinc-950">
      <style>{`
        @keyframes bannerFadeInUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .banner-animate-badge { opacity: 0; transform: translateY(28px); }
        .banner-animate-title { opacity: 0; transform: translateY(28px); }
        .banner-animate-desc { opacity: 0; transform: translateY(28px); }
        .banner-animate-buttons { opacity: 0; transform: translateY(28px); }

        .swiper-slide-active .banner-animate-badge {
          animation: bannerFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
        }
        .swiper-slide-active .banner-animate-title {
          animation: bannerFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
        }
        .swiper-slide-active .banner-animate-desc {
          animation: bannerFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.45s forwards;
        }
        .swiper-slide-active .banner-animate-buttons {
          animation: bannerFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
        }
        
        /* Custom Swiper slide active transitions */
        .swiper-slide-active .banner-slide-image {
          transform: scale(1.05);
          transition: transform 6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>

      {/* Swiper Slider */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        speed={1200}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        loop
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.title} className="relative h-full w-full overflow-hidden">
            <div className="absolute inset-0 w-full h-full banner-slide-image transform scale-100 transition-transform duration-[6000ms]">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>

            {/* Overlays for contrast and premium depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-zinc-950/30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_60%)]" />

            {/* Content Container */}
            <div className="relative z-10 flex h-full items-center">
              <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12 pb-24 md:pb-12">
                <div className="max-w-3xl">
                  {/* Badge */}
                  <span className="banner-animate-badge mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-250 backdrop-blur-md">
                    {slide.badge}
                  </span>

                  {/* Title */}
                  <h1 className="banner-animate-title text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] drop-shadow-lg">
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p className="banner-animate-desc mt-6 text-base sm:text-lg lg:text-xl text-zinc-300/90 leading-relaxed max-w-2xl">
                    {slide.description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="banner-animate-buttons mt-8 flex flex-wrap gap-4">
                    <Link
                      href={slide.actionLink}
                      className="group inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-bold text-zinc-900 shadow-2xl transition-all duration-300 hover:bg-zinc-100 hover:-translate-y-0.5 hover:shadow-indigo-500/10"
                    >
                      Explore Collection
                      <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>

                    <Link
                      href="/about"
                      className="group inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5"
                    >
                      Learn More
                      <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Slider Navigation Controls (Floating arrows) */}
      <div className="hidden md:block">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-6 top-[40%] sm:top-[45%] -translate-y-1/2 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md shadow-2xl transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:scale-105 active:scale-95 group"
          aria-label="Previous slide"
        >
          <svg className="h-6 w-6 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-6 top-[40%] sm:top-[45%] -translate-y-1/2 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md shadow-2xl transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:scale-105 active:scale-95 group"
          aria-label="Next slide"
        >
          <svg className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Custom Slider Stats Indicator */}
      <div className="absolute right-12 top-[40%] sm:top-[45%] -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-3">
        <div className="h-[2px] w-8 bg-white/20 relative overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${((activeIndex + 1) / slides.length) * 100}%` }}
          />
        </div>
        <div className="text-white/60 font-mono text-xs tracking-wider flex items-center gap-1">
          <span className="text-white font-bold">{String(activeIndex + 1).padStart(2, "0")}</span>
          <span>/</span>
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Floating Booking Search Bar (Integrated at the bottom center) */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 w-full max-w-6xl px-4 md:px-6">
        <form
          onSubmit={handleSearchSubmit}
          className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)] rounded-2xl md:rounded-full p-4 md:p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-2 dark:bg-zinc-950/45 dark:border-zinc-800/80"
        >
          {/* Destination */}
          <div className="flex-1 px-4 py-1.5 flex flex-col justify-center">
            <label className="text-[10px] md:text-xs font-semibold text-zinc-350 tracking-wider uppercase">Destination</label>
            <div className="relative mt-1 flex items-center">
              <svg className="absolute left-0 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Where to? (e.g. Maldives)"
                className="w-full bg-transparent pl-6 pr-2 text-sm text-white placeholder-zinc-400 font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-10 w-[1px] bg-white/10 dark:bg-zinc-800" />

          {/* Category */}
          <div className="flex-1 px-4 py-1.5 flex flex-col justify-center">
            <label className="text-[10px] md:text-xs font-semibold text-zinc-355 tracking-wider uppercase">Type of Stay</label>
            <div className="relative mt-1 flex items-center">
              <svg className="absolute left-0 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75" />
              </svg>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent pl-6 pr-4 text-sm text-white placeholder-zinc-400 font-medium focus:outline-none appearance-none cursor-pointer [&>option]:bg-zinc-900 [&>option]:text-white border-0"
              >
                <option value="">Any Category</option>
                <option value="Villa">Villa</option>
                <option value="Cabin">Cabin</option>
                <option value="Apartment">Apartment</option>
                <option value="Resort">Resort</option>
              </select>
              <svg className="absolute right-0 h-3.5 w-3.5 text-zinc-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-10 w-[1px] bg-white/10 dark:bg-zinc-800" />

          {/* Guests */}
          <div className="flex-1 px-4 py-1.5 flex flex-col justify-center">
            <label className="text-[10px] md:text-xs font-semibold text-zinc-355 tracking-wider uppercase">Guests</label>
            <div className="relative mt-1 flex items-center">
              <svg className="absolute left-0 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <input
                type="number"
                min={1}
                max={20}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                placeholder="2 Guests"
                className="w-full bg-transparent pl-6 pr-2 text-sm text-white placeholder-zinc-400 font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="md:h-12 rounded-xl md:rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 py-4 md:py-0 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-102 hover:shadow-indigo-600/40 active:scale-98"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <span className="md:hidden lg:inline">Search</span>
          </button>
        </form>
      </div>
    </section>
  );
}