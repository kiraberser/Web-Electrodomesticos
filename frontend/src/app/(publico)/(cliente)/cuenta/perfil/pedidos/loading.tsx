export default function PedidosLoading() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
            <div className="h-7 w-40 rounded-lg bg-gray-200 animate-pulse mb-6" />
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-100 p-4 animate-pulse space-y-3">
                    <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-32" />
                        <div className="h-4 bg-gray-200 rounded w-20" />
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-48" />
                    <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded-full w-20" />
                        <div className="h-6 bg-gray-200 rounded-full w-24" />
                    </div>
                </div>
            ))}
        </div>
    )
}
