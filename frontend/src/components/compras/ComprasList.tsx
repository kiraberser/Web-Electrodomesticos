"use client"

import { useState, useEffect } from "react"
import CompraCard from "./CompraCard"
import type { Pedido } from "@/api/pedidos"
import { Package } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/forms/Button"

interface ComprasListProps {
    compras: Pedido[]
}

export default function ComprasList({ compras }: ComprasListProps) {
    const [localCompras, setLocalCompras] = useState(compras)

    useEffect(() => {
        setLocalCompras(compras)
    }, [compras])

    if (localCompras.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No tienes compras registradas
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                        Cuando realices una compra y completes el pago, aparecerá aquí tu historial de compras.
                    </p>
                    <Link href="/categorias">
                        <Button className="bg-[#0A3981] hover:bg-[#1F509A] text-white">
                            Explorar productos
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {localCompras.map((compra) => (
                <CompraCard key={compra.id} compra={compra} />
            ))}
        </div>
    )
}

