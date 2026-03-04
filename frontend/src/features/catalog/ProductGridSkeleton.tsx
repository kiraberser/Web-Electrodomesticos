// Fallback for <Suspense> while ProductsSection fetches from API
export default function ProductGridSkeleton() {
  return (
    <div className="bg-[#f8fafc]">
      <section className="container mx-auto grid grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar skeleton */}
        <div className="space-y-3 pt-1">
          <div className="h-5 w-20 rounded-md bg-gray-200 animate-pulse" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 rounded-full bg-gray-200 animate-pulse" />
          ))}
          <div className="h-5 w-24 rounded-md bg-gray-200 animate-pulse mt-4" />
          {[1, 2].map((i) => (
            <div key={i} className="h-8 rounded-full bg-gray-200 animate-pulse" />
          ))}
          <div className="h-5 w-16 rounded-md bg-gray-200 animate-pulse mt-4" />
          <div className="h-2 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-8 rounded-md bg-gray-200 animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="h-5 w-40 rounded-md bg-gray-200 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="rounded-xl bg-white border border-gray-100 overflow-hidden shadow-sm"
              >
                <div className="h-44 bg-gray-100 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-1/3 rounded bg-gray-200 animate-pulse" />
                  <div className="h-8 w-full rounded-lg bg-gray-200 animate-pulse mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
