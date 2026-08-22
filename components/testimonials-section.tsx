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
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2);
}

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-cream-100 px-6 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "url('/images/batik-pattern.png')",
          backgroundSize: "420px 420px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative">
        <p className="text-center text-xs tracking-[0.3em] uppercase text-brass-500 mb-2">
          Kata Mereka
        </p>
        <h2 className="text-center font-display text-3xl md:text-4xl font-medium text-clay-950">
          Dipercaya Pecinta Rotan
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-clay-600">
          Cerita dari klien yang sudah membawa pulang bangku, meja, dan koleksi rotan Gajah Mada.
        </p>

        <ContainerScroll className="container h-[300vh]">
          <div className="sticky left-0 top-0 flex h-svh w-full items-center py-12">
            <CardsContainer className="mx-auto size-full h-[440px] w-[300px] sm:h-[460px] sm:w-[380px]">
              {TESTIMONIALS.map((t, index) => (
                <CardTransformed
                  arrayLength={TESTIMONIALS.length}
                  key={t.id}
                  index={index + 2}
                  className="border-clay-950/10 bg-white/95 shadow-xl"
                  role="article"
                  aria-labelledby={`testimonial-${t.id}-name`}
                >
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <ReviewStars rating={t.rating} className="text-terracotta-600" />
                    <blockquote className="mx-auto w-5/6 font-display italic text-base leading-relaxed text-clay-800">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="!size-12 border border-clay-950/10">
                      <AvatarFallback className="bg-brass-200 font-display text-clay-950">
                        {initials(t.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <span id={`testimonial-${t.id}-name`} className="block text-sm font-semibold text-clay-950">
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