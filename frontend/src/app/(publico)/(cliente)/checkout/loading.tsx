export default function CheckoutLoading() {
    return (
        <main className="min-h-screen bg-[#f8fafc]">
            <div className="container mx-auto max-w-2xl px-4 py-8">
                <div className="mb-8 text-center">
                    <div className="h-7 w-48 bg-gray-200 rounded-full mx-auto animate-pulse" />
                    <div className="h-4 w-64 bg-gray-100 rounded-full mx-auto mt-2 animate-pulse" />
                </div>
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
                            {n < 3 && <div className="h-0.5 w-20 bg-gray-200 animate-pulse" />}
                        </div>
                    ))}
                </div>
                <div className="space-y-4">
                    <div className="h-20 rounded-2xl bg-white border border-gray-100 animate-pulse" />
                    <div className="h-56 rounded-2xl bg-white border border-gray-100 animate-pulse" />
                    <div className="h-20 rounded-2xl bg-white border border-gray-100 animate-pulse" />
                    <div className="h-12 rounded-xl bg-orange-100 animate-pulse" />
                </div>
            </div>
        </main>
    )
}
