"use client";

import dynamic from "next/dynamic";

const OverviewSection = dynamic(
  () => import("@/components/admin/sections/OverviewSection").then((m) => ({ default: m.OverviewSection })),
);

export default function DashboardPage() {
  return <OverviewSection />;
}
