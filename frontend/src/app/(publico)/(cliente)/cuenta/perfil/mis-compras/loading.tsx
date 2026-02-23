export default function ComprasLoading() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
            <div className="h-7 w-44 rounded-lg bg-gray-200 animate-pulse mb-6" />
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-100 p-4 animate-pulse space-y-3">
                    <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-36" />
                        <div className="h-4 bg-gray-200 rounded w-24" />
                    </div>
                    <div className="flex gap-3 mt-2">
                        <div className="h-14 w-14 bg-gray-200 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
