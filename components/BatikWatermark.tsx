export function BatikWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/batik-gajah.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-[0.04]"
      />
      {/* fade halus di atas & bawah supaya batas dengan section lain tetap lembut */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-50 via-transparent to-cream-50" />
    </div>
  );
}