export function BatikWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-0 opacity-[0.06] bg-cream-50 bg-[url('/images/batik-gajah.png')] bg-cover bg-center bg-no-repeat"
      style={{
        width: "100vw",
        height: "100lvh",
        transform: "translate3d(0, 0, 0)",
        WebkitTransform: "translate3d(0, 0, 0)",
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        isolation: "isolate",
      }}
    />
  );
}