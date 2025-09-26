"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export function UnauthorizedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-label="Acceso no autorizado"
    >
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15">
        <ShieldAlert className="h-7 w-7 text-red-500" />
      </div>
      <h1 className="text-xl font-bold text-gray-900">Acceso no autorizado</h1>
      <p className="mt-2 text-sm text-gray-600">
        No tienes permisos para ver esta sección. Inicia sesión con una cuenta de administrador o vuelve al inicio.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-200">
          Ir al inicio
        </Link>
        <Link href="/cuenta" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
          Iniciar sesión
        </Link>
      </div>
    </motion.div>
  );
}


