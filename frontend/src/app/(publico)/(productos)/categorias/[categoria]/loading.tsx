export default function CategoryLoading() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="h-8 w-48 rounded-lg bg-gray-200 animate-pulse mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-gray-100 animate-pulse">
                        <div className="h-40 bg-gray-200" />
                        <div className="p-3 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                            <div className="h-5 bg-gray-200 rounded w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
