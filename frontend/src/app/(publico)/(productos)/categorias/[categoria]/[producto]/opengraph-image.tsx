import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Refaccionaria Vega — Refacción'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const ESTADO_LABEL: Record<string, string> = {
  NVO: 'Nuevo',
  UBS: 'Usado',
  REC: 'Reacondicionado',
}

export default async function Image({
  params,
}: {
  params: Promise<{ producto: string }>
}) {
  const { producto } = await params
  const nombre = decodeURIComponent(producto)

  // Fetch público — sin auth, no usa cookies()
  let refaccion: {
    nombre: string
    marca: string
    precio: number
    imagen?: string
    estado: string
    codigo_parte: string
  } | null = null

  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_API}/productos/refacciones/?search=${encodeURIComponent(nombre)}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (res.ok) {
      const data = await res.json()
      const list = data.results ?? data
      refaccion = Array.isArray(list)
        ? (list.find((r: { nombre: string }) => r.nombre === nombre) ?? list[0] ?? null)
        : null
    }
  } catch {
    // fallback al diseño genérico
  }

  const precio = refaccion ? Number(refaccion.precio).toLocaleString('es-MX') : null
  const estadoLabel = refaccion ? (ESTADO_LABEL[refaccion.estado] ?? refaccion.estado) : null

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A3981',
          width: '100%',
          height: '100%',
          display: 'flex',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: '#E38E49',
          }}
        />

        {/* Product image panel */}
        {refaccion?.imagen ? (
          <div
            style={{
              width: '480px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.06)',
              padding: '40px',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={refaccion.imagen}
              alt={refaccion.nombre}
              style={{
                maxWidth: '400px',
                maxHeight: '460px',
                objectFit: 'contain',
                borderRadius: '12px',
              }}
            />
          </div>
        ) : (
          // Sin imagen: panel con ícono genérico
          <div
            style={{
              width: '480px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.04)',
              fontSize: '120px',
            }}
          >
            🔧
          </div>
        )}

        {/* Right: info panel */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '48px 52px 48px 44px',
            gap: '0px',
          }}
        >
          {/* Marca */}
          {refaccion?.marca && (
            <div
              style={{
                fontSize: '26px',
                color: '#E38E49',
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              {refaccion.marca}
            </div>
          )}

          {/* Nombre */}
          <div
            style={{
              fontSize: refaccion ? '42px' : '56px',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.2,
              marginBottom: '28px',
            }}
          >
            {refaccion?.nombre ?? nombre}
          </div>

          {/* Precio */}
          {precio && (
            <div
              style={{
                fontSize: '52px',
                fontWeight: 800,
                color: '#E38E49',
                marginBottom: '20px',
              }}
            >
              ${precio} <span style={{ fontSize: '28px', fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>MXN</span>
            </div>
          )}

          {/* Estado badge */}
          {estadoLabel && (
            <div
              style={{
                display: 'flex',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  background: refaccion?.estado === 'NVO' ? '#16A34A' : 'rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                  fontSize: '22px',
                  fontWeight: 600,
                  padding: '6px 20px',
                  borderRadius: '999px',
                }}
              >
                {estadoLabel}
              </div>
            </div>
          )}

          {/* Branding */}
          <div
            style={{
              marginTop: 'auto',
              fontSize: '22px',
              color: 'rgba(255,255,255,0.45)',
              borderTop: '1px solid rgba(255,255,255,0.12)',
              paddingTop: '20px',
            }}
          >
            Refaccionaria Vega · Martínez de la Torre
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: '#E38E49',
            opacity: 0.5,
          }}
        />
      </div>
    ),
    { ...size },
  )
}
