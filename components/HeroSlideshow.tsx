"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HeroSlide = {
  src: string;
  alt: string;
};

export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || slides.length < 2) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches) return;

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, [isPaused, slides.length]);

  function showSlide(index: number) {
    setActiveSlide((index + slides.length) % slides.length);
  }

  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <Image
            alt=""
            className={`object-cover transition-opacity duration-700 ${
              index === activeSlide ? "opacity-35" : "opacity-0"
            }`}
            fill
            key={slide.src}
            priority={index === 0}
            sizes="100vw"
            src={slide.src}
            unoptimized={slide.src.startsWith("http")}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#102c28]/65 via-[#102c28]/25 to-[#102c28]/40" />
      </div>

      <div
        aria-label="Featured vehicles"
        className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-2 backdrop-blur-sm"
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
        }}
        onFocusCapture={() => setIsPaused(true)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="group"
      >
        <button
          aria-label="Previous hero slide"
          className="rounded-full p-1 text-white transition hover:bg-white/15"
          onClick={() => showSlide(activeSlide - 1)}
          type="button"
        >
          <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
            <path d="m15 18-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
        {slides.map((slide, index) => (
          <button
            aria-current={index === activeSlide ? "true" : undefined}
            aria-label={`Show slide ${index + 1}: ${slide.alt}`}
            className={`h-2.5 rounded-full transition-all ${
              index === activeSlide ? "w-6 bg-white" : "w-2.5 bg-white/55 hover:bg-white/80"
            }`}
            key={slide.src}
            onClick={() => showSlide(index)}
            type="button"
          />
        ))}
        <button
          aria-label="Next hero slide"
          className="rounded-full p-1 text-white transition hover:bg-white/15"
          onClick={() => showSlide(activeSlide + 1)}
          type="button"
        >
          <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
            <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </>
  );
}
