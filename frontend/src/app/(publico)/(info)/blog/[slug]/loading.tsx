export default function BlogPostLoading() {
    return (
        <div className="max-w-4xl mx-auto p-4 min-h-screen animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-4" />
            <div className="flex gap-4 mb-6">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
            <div className="h-64 bg-gray-200 rounded-xl mb-6" />
            <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={`h-4 bg-gray-200 rounded ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
                ))}
            </div>
        </div>
    )
}
