"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const slides = [
  {
    image: "/villa1.jpg",
    title: "Luxury Villas",
    description:
      "Experience premium comfort with our hand-picked luxury villas.",
  },
  {
    image: "/villa2.jpg",
    title: "Boutique Stays",
    description:
      "Discover unique boutique accommodations for unforgettable vacations.",
  },
  {
    image: "/villa3.jpg",
    title: "Book Your Dream Stay",
    description:
      "Find the perfect destination and enjoy a hassle-free booking experience.",
  },
];

export default function Banner() {
  return (
    <section className="relative w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-[520px] sm:h-[620px] lg:h-[760px]
          [&_.swiper-button-next]:hidden
          [&_.swiper-button-prev]:hidden
          md:[&_.swiper-button-next]:flex
          md:[&_.swiper-button-prev]:flex
          [&_.swiper-button-next]:text-white
          [&_.swiper-button-prev]:text-white
          [&_.swiper-button-next]:after:text-3xl
          [&_.swiper-button-prev]:after:text-3xl
          [&_.swiper-pagination-bullet]:h-2
          [&_.swiper-pagination-bullet]:w-2
          [&_.swiper-pagination-bullet]:bg-white
          [&_.swiper-pagination-bullet]:opacity-60
          [&_.swiper-pagination-bullet-active]:w-8
          [&_.swiper-pagination-bullet-active]:rounded-full
          [&_.swiper-pagination-bullet-active]:opacity-100"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.title}>
            <div className="relative h-[520px] w-full sm:h-[620px] lg:h-[760px]">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              <div className="relative z-10 flex h-full items-center">
                <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
                  <div className="max-w-3xl">
                    <span className="mb-5 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md sm:text-sm">
                      Premium Holiday Homes
                    </span>

                    <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white drop-shadow-2xl sm:text-6xl lg:text-7xl">
                      {slide.title}
                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg lg:text-xl">
                      {slide.description}
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                      <button className="rounded-full bg-white px-8 py-4 text-sm font-bold text-black shadow-2xl transition hover:-translate-y-0.5 hover:bg-gray-100 sm:text-base">
                        Explore Villas
                      </button>

                      <button className="rounded-full border border-white/40 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20 sm:text-base">
                        View Destinations
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}