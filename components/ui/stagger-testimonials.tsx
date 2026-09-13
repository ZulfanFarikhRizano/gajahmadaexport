"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const SQRT_5000 = Math.sqrt(5000);

export interface TestimonialItem {
  id?: string;
  testimonial: string;
  by: string;
  imgSrc: string;
}

// Data Testimonial Hardcode Default (Fallback)
const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    testimonial:
      "The rattan chair and table set for our café in Lyon has been outdoors for over a year. Outstanding craftsmanship and durability!",
    by: "Claire Dubois, Bistro Owner",
    imgSrc:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    testimonial:
      "Gajah Mada perfectly executed my custom rattan weave patterns for a client project in Milan. Precision and attention to detail are top-notch.",
    by: "Julian Vance, Interior Designer",
    imgSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    testimonial:
      "Shipped all the way to Santorini with zero damage. My villa guests constantly ask where we got these beautiful rattan pieces.",
    by: "Sophie Laurent, Resort Manager",
    imgSrc:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    testimonial:
      "The dining table became the centerpiece of our latest residential project in Munich. The natural finish matches our reference flawlessly.",
    by: "Emma Lindqvist, Architect",
    imgSrc:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
  {
    testimonial:
      "Remarkable export quality! The furniture arrived securely packaged and exceeded our expectations for our boutique hotel chain.",
    by: "Lukas Weber, Procurement Lead",
    imgSrc:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
];

interface TestimonialCardProps {
  position: number;
  testimonial: TestimonialItem;
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize,
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-6 sm:p-7 transition-all duration-500 ease-in-out select-none flex flex-col justify-between overflow-hidden",
        isCenter
          ? "z-10 bg-[#b3593b] text-cream-50 border-terracotta-700 shadow-xl"
          : "z-0 bg-white text-clay-950 border-clay-200 hover:border-brass-400 opacity-90"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.45) * position}px)
          translateY(${isCenter ? -30 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? "0px 12px 24px -4px rgba(0,0,0,0.25)"
          : "0px 0px 0px 0px transparent",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] z-0"
        style={{
          backgroundImage: "url('/images/batik-gajah.png')",
          backgroundSize: "180px 180px",
          backgroundRepeat: "repeat",
        }}
      />

      <span
        className="absolute block origin-top-right rotate-45 bg-clay-200/50 z-10"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
        }}
      />

      <div className="relative z-10 flex flex-col items-start gap-3">
        <img
          src={testimonial.imgSrc || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
          alt={testimonial.by}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-muted object-cover object-top border-2 border-white/40 shadow-sm"
        />

        <h3
          className={cn(
            "text-xs sm:text-sm font-medium leading-relaxed italic line-clamp-5",
            isCenter ? "text-cream-50" : "text-clay-800"
          )}
        >
          &ldquo;{testimonial.testimonial}&rdquo;
        </h3>
      </div>

      <div className="relative z-10 pt-3 border-t border-white/20 mt-2">
        <p
          className={cn(
            "text-xs sm:text-sm font-semibold tracking-wide",
            isCenter ? "text-cream-100" : "text-clay-950"
          )}
        >
          — {testimonial.by}
        </p>
      </div>
    </div>
  );
};

export interface StaggerTestimonialsProps {
  items?: TestimonialItem[];
}

export const StaggerTestimonials: React.FC<StaggerTestimonialsProps> = ({ items }) => {
  const [cardSize, setCardSize] = useState(365);
  
  // Fungsi Helper untuk menyiapkan format array state
  const prepareData = (sourceArray: TestimonialItem[]) => {
    return sourceArray.map((item, idx) => ({
      ...item,
      tempId: idx,
      imgSrc: item.imgSrc || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    }));
  };

  // Gunakan data items jika ada & tidak kosong, jika kosong otomatis pakai hardcode
  const initialData = prepareData(items && items.length > 0 ? items : DEFAULT_TESTIMONIALS);
  const [testimonialsList, setTestimonialsList] = useState(initialData);

  // Sync state jika data props berubah dari server/Supabase
  useEffect(() => {
    const activeItems = items && items.length > 0 ? items : DEFAULT_TESTIMONIALS;
    setTestimonialsList(prepareData(activeItems));
  }, [items]);

  const startXRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const handleMove = (steps: number) => {
    if (steps === 0) return;
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = startXRef.current - endX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleMove(1);
      } else {
        handleMove(-1);
      }
    }
    startXRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || startXRef.current === null) return;
    const diffX = startXRef.current - e.clientX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleMove(1);
      } else {
        handleMove(-1);
      }
    }
    startXRef.current = null;
    isDraggingRef.current = false;
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 300);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden py-8 touch-pan-y select-none"
      style={{ height: 540 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {testimonialsList.map((testimonial, index) => {
        const position =
          testimonialsList.length % 2
            ? index - (testimonialsList.length - 1) / 2
            : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
    </div>
  );
};

export function TestimonialsSection({ items }: { items?: TestimonialItem[] }) {
  return (
    <section className="relative bg-cream-50 py-16 overflow-hidden border-t border-b border-clay-200/60">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] z-0"
        style={{
          backgroundImage: "url('/images/batik-gajah.png')",
          backgroundSize: "280px 280px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 mb-2">
        <p className="text-center text-xs tracking-[0.3em] uppercase text-[#b3593b] font-bold mb-2">
          Testimonials
        </p>
        <h2 className="text-center font-display text-3xl md:text-4xl font-medium text-clay-950 tracking-tight">
          Trusted by Global Clients
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-xs sm:text-sm text-clay-600">
          Stories from international designers and hospitality partners who brought home Gajah Mada&apos;s handcrafted rattan.
        </p>
      </div>

      <div className="relative z-10">
        <StaggerTestimonials items={items} />
      </div>
    </section>
  );
}