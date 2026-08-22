"use client";

import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  ReviewStars,
} from "@/components/blocks/animated-cards-stack";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Dian Kusuma",
    role: "Pemilik Kafe, Bandung",
    rating: 5,
    quote:
      "Set bangku dan meja rotan untuk kafe kami dipesan langsung dari Gajah Mada — anyamannya rapi, kokoh dipakai outdoor tiap hari, dan tetap cantik setelah setahun lebih.",
  },
  {
    id: "t2",
    name: "Michael Tanuwijaya",
    role: "Interior Designer, Jakarta",
    rating: 4.5,
    quote:
      "Saya sering minta ukuran & motif anyaman custom untuk klien. Gajah Mada selalu bisa mengikuti detail yang saya minta, hasil akhirnya presisi.",
  },
  {
    id: "t3",
    name: "Ratna Wijayanti",
    role: "Pemilik Vila, Ubud",
    rating: 5,
    quote:
      "Kursi tamu set-nya dikirim dari Cirebon sampai Bali, dikemas sangat rapi — tidak ada satu pun bagian yang cacat waktu tiba. Tamu vila selalu tanya di mana belinya.",
  },
  {
    id: "t4",
    name: "Farah Nabila",
    role: "Arsitek, Surabaya",
    rating: 4.5,
    quote:
      "Meja makan rotannya jadi centerpiece ruang makan proyek saya. Finishing natural-nya persis sesuai referensi warna yang saya kirim.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
}

export function TestimonialsSection() {
  return (
    <section className="relative bg-cream-100 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "url('/images/batik-pattern.png')",
          backgroundSize: "420px 420px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="container relative mx-auto px-4">
        <p className="text-center text-xs tracking-[0.3em] uppercase text-brass-500 mb-2">
          Kata Mereka
        </p>
        <h2 className="text-center font-display text-3xl md:text-4xl font-medium text-clay-950">
          Dipercaya Pecinta Rotan
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-clay-600 mb-8">
          Cerita dari klien yang sudah membawa pulang bangku, meja, dan koleksi rotan Gajah Mada.
        </p>

        <ContainerScroll className="min-h-[220vh]">
          <div className="sticky top-28 flex w-full items-center justify-center">
            <CardsContainer className="h-[420px] w-[310px] sm:w-[380px]">
              {TESTIMONIALS.map((t, index) => (
                <CardTransformed
                  key={t.id}
                  arrayLength={TESTIMONIALS.length}
                  index={index}
                  variant="light"
                  className="w-full bg-white/95 border border-clay-950/10 shadow-2xl rounded-3xl p-6 sm:p-8 flex flex-col justify-between"
                >
                  <div className="flex flex-col items-center gap-4 text-center">
                    <ReviewStars rating={t.rating} />
                    <blockquote className="font-display italic text-sm sm:text-base leading-relaxed text-clay-800">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-clay-950/10">
                    <Avatar className="h-10 w-10 border border-clay-950/10">
                      <AvatarFallback className="bg-brass-200 font-display text-clay-950 text-xs">
                        {initials(t.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <span className="block text-sm font-semibold text-clay-950">
                        {t.name}
                      </span>
                      <span className="block text-xs text-clay-600">{t.role}</span>
                    </div>
                  </div>
                </CardTransformed>
              ))}
            </CardsContainer>
          </div>
        </ContainerScroll>
      </div>
    </section>
  );
}