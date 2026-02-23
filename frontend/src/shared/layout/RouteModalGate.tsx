"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { UnauthorizedCard } from "@/shared/layout/UnauthorizedCard";

export default function RouteModalGate() {
  const pathname = usePathname();
  const router = useRouter();
  const showUnauthorized = pathname === "/unauthorized";

  if (!showUnauthorized) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-6" onClick={() => router.back()}>
      <div onClick={(e) => e.stopPropagation()}>
        <UnauthorizedCard />
      </div>
    </div>
  );
}


