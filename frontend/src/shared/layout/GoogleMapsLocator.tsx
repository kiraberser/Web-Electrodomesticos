'use client'

import Script from 'next/script'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmpx-api-loader': any
      'gmpx-store-locator': any
    }
  }
}

const CONFIGURATION = {
  locations: [
    {
      title: 'Refaccionaria VEGA',
      address1: 'MAXIMINO AVILA CAMACHO Y PIPILA NO. 800 COL. CENTRO C.P.93600 MARTINEZ DE LA TORRE, VER',
      address2: 'Martínez de la Torre, Ver., Mexico',
      coords: { lat: 20.0649079, lng: -97.0494986 },
      placeId: 'ChIJTXCNhXL92oURCq0jgTq27XE',
    },
  ],
  mapOptions: {
    center: { lat: 20.0649079, lng: -97.0494986 },
    fullscreenControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    zoom: 15,
    zoomControl: true,
    maxZoom: 17,
    mapId: '',
  },
  mapsApiKey: 'YOUR_API_KEY_HERE',
  capabilities: {
    input: false,
    autocomplete: false,
    directions: false,
    distanceMatrix: false,
    details: false,
    actions: false,
  },
}

export default function GoogleMapsLocator() {
  function handleScriptLoad() {
    customElements.whenDefined('gmpx-store-locator').then(() => {
      const locator = document.querySelector('gmpx-store-locator') as any
      locator?.configureFromQuickBuilder(CONFIGURATION)
    })
  }

  return (
    <div style={{ width: '100%', height: '380px' }}>
      <Script
        src="https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      <gmpx-api-loader
        key="YOUR_API_KEY_HERE"
        solution-channel="GMP_QB_locatorplus_v11_c"
      />
      <gmpx-store-locator
        map-id="DEMO_MAP_ID"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
