"use client";

import dynamic from "next/dynamic";

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-slate-200/60" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-64 rounded-xl bg-slate-200/60" />
        <div className="h-64 rounded-xl bg-slate-200/60" />
      </div>
    </div>
  );
}

const OverviewSection = dynamic(
  () => import("@/features/admin/sections/OverviewSection").then((m) => ({ default: m.OverviewSection })),
  { loading: () => <DashboardSkeleton /> }
);

export default function DashboardPage() {
  return <OverviewSection />;
}
