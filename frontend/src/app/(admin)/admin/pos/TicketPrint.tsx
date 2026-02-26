'use client'

import { forwardRef } from 'react'
import dynamic from 'next/dynamic'

const Barcode = dynamic(() => import('react-barcode'), { ssr: false })

export interface TicketItem {
    nombre: string
    cantidad: number
    precio_unitario: number
    subtotal: number
}

export interface TicketData {
    items: TicketItem[]
    total: number
    ids: number[]
    fecha: Date
    pago?: number
    cambio?: number
}

const TicketPrint = forwardRef<HTMLDivElement, { data: TicketData }>(({ data }, ref) => {
    const subtotalSinIva = data.total / 1.16
    const ivaAmount = data.total - subtotalSinIva
    const folio = data.ids[0] ?? 0

    return (
        <div ref={ref} style={{ width: '220px', fontFamily: 'Courier New, monospace', fontSize: '11px', padding: '8px', color: '#000', background: '#fff' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '8px', borderBottom: '1px dashed #000', paddingBottom: '6px' }}>
                <p style={{ fontWeight: 'bold', fontSize: '13px', margin: 0 }}>REFACCIONARIA VEGA</p>
                <p style={{ margin: '2px 0 0' }}>Martínez de la Torre, Ver.</p>
                <p style={{ margin: '2px 0 0' }}>Tel: (232) 324-XXXX</p>
                <p style={{ margin: '2px 0 0' }}>www.refaccionariavega.com</p>
            </div>

            {/* Date / Time / Folio */}
            <div style={{ marginBottom: '6px', borderBottom: '1px dashed #000', paddingBottom: '6px' }}>
                <p style={{ margin: '1px 0' }}>Fecha: {data.fecha.toLocaleDateString('es-MX')}</p>
                <p style={{ margin: '1px 0' }}>Hora:&nbsp;&nbsp;{data.fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</p>
                <p style={{ margin: '1px 0' }}>Folio: #{folio}</p>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '6px', borderBottom: '1px dashed #000', paddingBottom: '6px' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 4px' }}>ARTÍCULOS</p>
                {data.items.map((item, i) => (
                    <div key={i} style={{ marginBottom: '4px' }}>
                        <p style={{ margin: 0, wordBreak: 'break-word' }}>{item.nombre}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.cantidad} x ${item.precio_unitario.toFixed(2)}</span>
                            <span>${item.subtotal.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div style={{ marginBottom: '8px', borderBottom: '1px dashed #000', paddingBottom: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal:</span>
                    <span>${subtotalSinIva.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>IVA (16%):</span>
                    <span>${ivaAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '4px' }}>
                    <span>TOTAL:</span>
                    <span>${data.total.toFixed(2)}</span>
                </div>
                {data.pago != null && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                            <span>Pago:</span>
                            <span>${data.pago.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            <span>Cambio:</span>
                            <span>${(data.cambio ?? 0).toFixed(2)}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Barcode */}
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <Barcode
                    value={String(folio).padStart(8, '0')}
                    format="CODE128"
                    width={1.2}
                    height={35}
                    fontSize={10}
                    displayValue
                />
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', borderTop: '1px dashed #000', paddingTop: '6px' }}>
                <p style={{ margin: '1px 0' }}>Horario: Lun–Sáb 8am–6pm</p>
                <p style={{ margin: '1px 0' }}>¡Gracias por su compra!</p>
                <p style={{ margin: '1px 0' }}>Precios incluyen IVA</p>
            </div>
        </div>
    )
})
TicketPrint.displayName = 'TicketPrint'
export default TicketPrint
