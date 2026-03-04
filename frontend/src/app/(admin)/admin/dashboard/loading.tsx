export default function DashboardLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header */}
            <div className="space-y-1.5">
                <div className="h-5 w-32 rounded bg-slate-200/60" />
                <div className="h-3 w-48 rounded bg-slate-200/60" />
            </div>
            {/* KPI row 1 */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-28 rounded-xl bg-slate-200/60" />
                ))}
            </div>
            {/* KPI row 2 */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-28 rounded-xl bg-slate-200/60" />
                ))}
            </div>
            {/* Charts */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="h-72 rounded-xl bg-slate-200/60 xl:col-span-2" />
                <div className="h-72 rounded-xl bg-slate-200/60" />
            </div>
            {/* Lists */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="h-64 rounded-xl bg-slate-200/60 xl:col-span-2" />
                <div className="h-64 rounded-xl bg-slate-200/60" />
            </div>
        </div>
    )
}
