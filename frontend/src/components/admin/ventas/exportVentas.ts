import type { Venta } from "@/api/ventas"

/**
 * Exporta las ventas a CSV
 */
export const exportToCSV = (ventas: Venta[], filename: string = 'ventas.csv') => {
    // Encabezados
    const headers = [
        'ID',
        'Tipo',
        'Fecha',
        'Producto/Servicio',
        'Marca',
        'Cantidad',
        'Precio Unitario',
        'Total',
        'Usuario',
        'Técnico',
        'Estado Pago',
        'Garantía (días)',
        'Observaciones',
        'Motivo Devolución',
    ]

    // Convertir ventas a filas CSV
    const rows = ventas.map((venta) => {
        const fecha = venta.tipo === 'devolucion' 
            ? (venta as any).fecha_devolucion 
            : (venta as any).fecha_venta

        if (venta.tipo === 'refaccion') {
            return [
                venta.id,
                'Refacción',
                fecha,
                (venta as any).refaccion_nombre || '',
                (venta as any).marca_nombre || '',
                (venta as any).cantidad || '',
                (venta as any).precio_unitario || '',
                venta.total,
                (venta as any).usuario_username || '',
                '',
                '',
                '',
                '',
                '',
            ]
        } else if (venta.tipo === 'servicio') {
            return [
                venta.id,
                'Servicio',
                fecha,
                (venta as any).servicio_aparato || `Servicio #${(venta as any).servicio}`,
                '',
                '',
                '',
                venta.total,
                '',
                (venta as any).tecnico || '',
                (venta as any).estado_pago || '',
                (venta as any).garantia_dias || '',
                (venta as any).observaciones || '',
                '',
            ]
        } else {
            // devolucion
            return [
                venta.id,
                'Devolución',
                fecha,
                (venta as any).refaccion_nombre || '',
                (venta as any).marca_nombre || '',
                (venta as any).cantidad || '',
                (venta as any).precio_unitario || '',
                venta.total,
                '',
                '',
                '',
                '',
                '',
                (venta as any).motivo || '',
            ]
        }
    })

    // Crear contenido CSV
    const csvContent = [
        headers.join(','),
        ...rows.map(row => 
            row.map(cell => {
                // Escapar comillas y envolver en comillas si contiene comas
                const cellStr = String(cell || '')
                if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                    return `"${cellStr.replace(/"/g, '""')}"`
                }
                return cellStr
            }).join(',')
        )
    ].join('\n')

    // Crear blob y descargar
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

/**
 * Exporta las ventas a Excel (formato CSV con extensión .xlsx simulada)
 * Nota: Para verdadero Excel necesitarías una librería como xlsx
 */
export const exportToExcel = (ventas: Venta[], filename: string = 'ventas.xlsx') => {
    // Por ahora, exportamos como CSV pero con extensión .xlsx
    // Para verdadero Excel, necesitarías instalar: npm install xlsx
    exportToCSV(ventas, filename.replace('.xlsx', '.csv'))
}

/**
 * Exporta todas las ventas (necesita cargar todas las páginas)
 */
export const exportAllVentas = async (
    getAllVentasFn: (page: number, tipo?: string, search?: string) => Promise<any>,
    tipoFilter?: string,
    search?: string
) => {
    try {
        // Cargar primera página para obtener el total
        const firstPage = await getAllVentasFn(1, tipoFilter, search)
        const totalPages = Math.ceil(firstPage.count / 20)
        
        // Cargar todas las páginas
        const allVentas: Venta[] = [...firstPage.results]
        
        for (let page = 2; page <= totalPages; page++) {
            const pageData = await getAllVentasFn(page, tipoFilter, search)
            allVentas.push(...pageData.results)
        }
        
        return allVentas
    } catch (error) {
        console.error('Error al exportar todas las ventas:', error)
        throw error
    }
}

