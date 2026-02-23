"use client"

import { useState, useEffect } from "react"
import PedidoCard from "./PedidoCard"
import type { Pedido } from "@/features/orders/api"
import { Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/shared/ui/forms/Button"

interface PedidosListProps {
    pedidos: Pedido[]
}

export default function PedidosList({ pedidos }: PedidosListProps) {
    const [localPedidos, setLocalPedidos] = useState(pedidos)

    useEffect(() => {
        setLocalPedidos(pedidos)
    }, [pedidos])

    if (localPedidos.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No tienes pedidos registrados
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                        Cuando realices un pedido, aparecerá aquí con toda su información y estado.
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
            {localPedidos.map((pedido, index) => (
                <PedidoCard 
                    key={pedido.id} 
                    pedido={pedido} 
                    isRecent={index === 0}
                />
            ))}
        </div>
    )
}

