export default function GalleryLoading() {
  return (
    <main className="min-h-screen bg-cream-50 pt-16 pb-24">
      <div className="mx-auto max-w-3xl px-6 text-center pt-12 mb-8">
        <div className="mx-auto h-8 w-48 bg-clay-200/60 rounded-lg animate-pulse" />
        <div className="mx-auto mt-3 h-4 w-80 bg-clay-200/60 rounded-lg animate-pulse" />
      </div>

      <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square bg-clay-200/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    </main>
  );
}