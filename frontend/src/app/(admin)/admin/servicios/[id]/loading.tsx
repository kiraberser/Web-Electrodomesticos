export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0F172A]">
            {/* Header skeleton */}
            <div className="border-b border-white/10">
                <div className="container mx-auto px-4 py-5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-24 rounded-md bg-white/10 animate-pulse" />
                            <div className="w-px h-8 bg-white/10 hidden sm:block" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/10 animate-pulse" />
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-40 rounded bg-white/10 animate-pulse" />
                                        <div className="h-5 w-20 rounded-full bg-white/10 animate-pulse" />
                                    </div>
                                    <div className="h-3 w-48 rounded bg-white/10 animate-pulse" />
                                </div>
                            </div>
                        </div>
                        <div className="h-9 w-36 rounded-lg bg-white/10 animate-pulse hidden sm:block" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-6xl mx-auto space-y-5">
                    {/* Timeline */}
                    <div className="h-16 rounded-xl border border-white/10 bg-white/5 animate-pulse" />

                    {/* Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* Left col */}
                        <div className="lg:col-span-2 space-y-5">
                            {/* Basic info */}
                            <div className="rounded-xl border border-white/10 overflow-hidden">
                                <div className="h-12 bg-white/5 animate-pulse border-b border-white/10" />
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-white/5 last:border-0">
                                        <div className="w-4 h-4 rounded bg-white/10 animate-pulse shrink-0" />
                                        <div className="w-28 h-3 rounded bg-white/10 animate-pulse" />
                                        <div className="flex-1 h-3 rounded bg-white/10 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                            {/* Observations */}
                            <div className="rounded-xl border border-white/10 overflow-hidden">
                                <div className="h-12 bg-white/5 animate-pulse border-b border-white/10" />
                                <div className="px-5 py-4 space-y-2">
                                    <div className="h-3 rounded bg-white/10 animate-pulse" />
                                    <div className="h-3 rounded bg-white/10 animate-pulse w-4/5" />
                                    <div className="h-3 rounded bg-white/10 animate-pulse w-3/5" />
                                </div>
                            </div>
                        </div>

                        {/* Right col */}
                        <div className="space-y-5">
                            {/* Cost */}
                            <div className="rounded-xl border border-white/10 overflow-hidden">
                                <div className="h-12 bg-white/5 animate-pulse border-b border-white/10" />
                                <div className="px-5 py-4 space-y-3">
                                    {[...Array(2)].map((_, i) => (
                                        <div key={i} className="flex justify-between">
                                            <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
                                            <div className="h-3 w-16 rounded bg-white/10 animate-pulse" />
                                        </div>
                                    ))}
                                    <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                                        <div className="h-3 w-10 rounded bg-white/10 animate-pulse" />
                                        <div className="h-7 w-24 rounded bg-white/10 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                            {/* Delivery */}
                            <div className="rounded-xl border border-white/10 overflow-hidden">
                                <div className="h-12 bg-white/5 animate-pulse border-b border-white/10" />
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-white/5 last:border-0">
                                        <div className="w-4 h-4 rounded bg-white/10 animate-pulse shrink-0" />
                                        <div className="w-24 h-3 rounded bg-white/10 animate-pulse" />
                                        <div className="flex-1 h-3 rounded bg-white/10 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                            {/* Actions */}
                            <div className="rounded-xl border border-white/10 overflow-hidden">
                                <div className="h-12 bg-white/5 animate-pulse border-b border-white/10" />
                                <div className="p-3 space-y-1">
                                    {[...Array(2)].map((_, i) => (
                                        <div key={i} className="h-10 rounded-lg bg-white/10 animate-pulse" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
