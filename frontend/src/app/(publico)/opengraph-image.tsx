import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Refaccionaria Vega — Refacciones y Electrodomésticos en Martínez de la Torre'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A3981',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Accent bar */}
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

        {/* Logo box — replica del logotipo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0D1166',
            borderRadius: '16px',
            padding: '24px 56px',
            marginBottom: '36px',
          }}
        >
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '10px',
              fontFamily: 'Arial Black, sans-serif',
            }}
          >
            VEGA
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 34,
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.4,
          }}
        >
          Refacciones, Reparaciones e Instalaciones
        </div>

        {/* Location */}
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.55)',
            marginTop: '20px',
          }}
        >
          Martínez de la Torre, Veracruz · Envío a toda la república
        </div>

        {/* Bottom accent */}
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
