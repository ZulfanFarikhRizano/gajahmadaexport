"use client";

import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

export function TestimonialsSection() {
  return (
    <section className="relative bg-cream-100 py-16 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "url('/images/batik-pattern.png')",
          backgroundSize: "420px 420px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="container relative mx-auto px-4 mb-4">
        <p className="text-center text-xs tracking-[0.3em] uppercase text-brass-500 mb-2">
          Testimonials
        </p>
        <h2 className="text-center font-display text-3xl md:text-4xl font-medium text-clay-950">
          Trusted by Rattan Enthusiasts
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-clay-600">
          Stories from clients who brought home Gajah Mada&apos;s handcrafted rattan collection.
        </p>
      </div>

      <StaggerTestimonials />
    </section>
  );
}