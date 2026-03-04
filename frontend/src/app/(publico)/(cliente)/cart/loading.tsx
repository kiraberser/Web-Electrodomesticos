export default function CartLoading() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-5 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                <div className="h-28 w-28 shrink-0 rounded-xl bg-gray-100 animate-pulse" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
                  <div className="h-3 w-1/4 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-1/3 rounded bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm space-y-4 h-fit">
            <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-px bg-gray-100" />
            <div className="h-7 w-28 rounded bg-gray-200 animate-pulse" />
            <div className="h-11 w-full rounded-lg bg-gray-200 animate-pulse" />
          </div>
        </div>
      </section>
    </main>
  )
}
