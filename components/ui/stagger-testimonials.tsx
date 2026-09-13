"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial:
      "The rattan chair and table set for our cafe has been outdoors for over a year. Outstanding craftsmanship and durability!",
    by: "Dian Kusuma, Cafe Owner",
    imgSrc:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    tempId: 1,
    testimonial:
      "Gajah Mada perfectly executed my custom rattan weave patterns for a client project. Precision and attention to detail are top-notch.",
    by: "Michael Tanuwijaya, Interior Designer",
    imgSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    tempId: 2,
    testimonial:
      "Shipped all the way to Bali with zero damage. My villa guests constantly ask where we got these beautiful rattan pieces.",
    by: "Ratna Wijayanti, Villa Owner",
    imgSrc:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    tempId: 3,
    testimonial:
      "The dining table became the centerpiece of our latest residential design. The natural finish matches our reference flawlessly.",
    by: "Farah Nabila, Architect",
    imgSrc:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
  {
    tempId: 4,
    testimonial:
      "Remarkable export quality! The furniture arrived securely packaged and exceeded our expectations for our boutique hotel.",
    by: "David Miller, Hotel Manager",
    imgSrc:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
];

interface TestimonialCardProps {
  position: number;
  testimonial: (typeof testimonials)[0];
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
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out select-none",
        isCenter
          ? "z-10 bg-terracotta-600 text-cream-50 border-terracotta-700"
          : "z-0 bg-white text-clay-950 border-clay-200 hover:border-brass-400"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? "0px 8px 0px 4px rgba(0,0,0,0.15)"
          : "0px 0px 0px 0px transparent",
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-clay-200"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={testimonial.by}
        className="mb-4 h-14 w-12 rounded-md bg-muted object-cover object-top"
        style={{
          boxShadow: "3px 3px 0px rgba(0,0,0,0.2)",
        }}
      />
      <h3
        className={cn(
          "text-base sm:text-lg font-medium leading-snug",
          isCenter ? "text-cream-50" : "text-clay-900"
        )}
      >
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>
      <p
        className={cn(
          "absolute bottom-8 left-8 right-8 mt-2 text-sm italic font-light",
          isCenter ? "text-cream-100/80" : "text-clay-600"
        )}
      >
        — {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  // Ref & State untuk menangani Swipe / Drag
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

  // Touch handlers (HP)
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = startXRef.current - endX;

    // Threshold swipe min 50px
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleMove(1); // Swipe kiri -> kartu kanan masuk
      } else {
        handleMove(-1); // Swipe kanan -> kartu kiri masuk
      }
    }
    startXRef.current = null;
  };

  // Mouse handlers (Desktop Drag)
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
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-cream-100/50 py-12 touch-pan-y select-none"
      style={{ height: 600 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {testimonialsList.map((testimonial, index) => {
        const position =
          testimonialsList.length % 2
            ? index - (testimonialsList.length + 1) / 2
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