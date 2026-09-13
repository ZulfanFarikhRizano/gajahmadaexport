export function BatikWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.06] bg-cream-50 bg-[url('/images/batik-gajah.png')] bg-cover bg-center bg-no-repeat"
    />
  );
}