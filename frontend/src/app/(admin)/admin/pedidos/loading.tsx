export default function PedidosAdminLoading() {
    return (
        <div className="p-6 space-y-6 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="h-8 w-32 bg-slate-200/60 rounded-lg" />
                <div className="h-9 w-44 bg-slate-200/60 rounded-lg" />
            </div>
            <div className="rounded-xl border border-slate-200/60 overflow-hidden">
                <div className="h-12 bg-slate-200/60" />
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex gap-4 px-4 py-3 border-t border-slate-200/40">
                        <div className="h-4 bg-slate-200/60 rounded w-1/6" />
                        <div className="h-4 bg-slate-200/60 rounded w-1/4" />
                        <div className="h-4 bg-slate-200/60 rounded w-1/5" />
                        <div className="h-4 bg-slate-200/60 rounded w-1/6" />
                        <div className="h-5 bg-slate-200/60 rounded-full w-20" />
                    </div>
                ))}
            </div>
        </div>
    )
}
