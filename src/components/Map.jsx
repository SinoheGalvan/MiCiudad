import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { places } from '../data/places'
import FilterBar from './FilterBar'

const CATEGORY_CONFIG = {
  Restaurante: { color: '#E76F51' },
  Museo:       { color: '#457B9D' },
  Café:        { color: '#795548' },
  Artesanías:  { color: '#F4A261' },
  Histórico:   { color: '#2A9D8F' },
  Evento:      { color: '#9B59B6' },
}

const CATEGORY_INITIALS = {
  Restaurante: 'R',
  Museo:       'M',
  Café:        'C',
  Artesanías:  'A',
  Histórico:   'H',
  Evento:      'E',
}

function makePinIcon(categoria) {
  const color = CATEGORY_CONFIG[categoria]?.color ?? '#2A9D8F'
  const letter = CATEGORY_INITIALS[categoria] ?? '?'
  const svg = `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="${color}" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"/>
    <circle cx="14" cy="14" r="7.5" fill="white" fill-opacity="0.92"/>
    <text x="14" y="18.5" text-anchor="middle" dominant-baseline="middle" font-size="9" font-weight="700" font-family="Inter,sans-serif" fill="${color}">${letter}</text>
  </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -38],
  })
}

const DURANGO_CENTER = [24.0277, -104.6532]
const CATEGORIES = ['Todos', ...Object.keys(CATEGORY_CONFIG)]

export default function Map({ onPlaceSelect }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const clusterRef = useRef(null)
  const onSelectRef = useRef(onPlaceSelect)
  const [activeFilter, setActiveFilter] = useState('Todos')

  useEffect(() => { onSelectRef.current = onPlaceSelect })

  // Initialize map once
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    const map = L.map(containerRef.current, {
      center: DURANGO_CENTER,
      zoom: 15,
      zoomControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Zoom controls — top-right to not clash with FilterBar
    L.control.zoom({ position: 'topright' }).addTo(map)

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 48,
      iconCreateFunction(c) {
        const n = c.getChildCount()
        return L.divIcon({
          html: `<div class="mc-inner">${n}</div>`,
          className: 'mc-wrapper',
          iconSize: [36, 36],
        })
      },
    })
    map.addLayer(cluster)

    mapRef.current = map
    clusterRef.current = cluster

    return () => {
      map.remove()
      mapRef.current = null
      clusterRef.current = null
    }
  }, [])

  // Rebuild markers whenever filter changes
  useEffect(() => {
    const cluster = clusterRef.current
    if (!cluster) return

    cluster.clearLayers()

    const visible = activeFilter === 'Todos'
      ? places
      : places.filter((p) => p.categoria === activeFilter)

    visible.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], { icon: makePinIcon(place.categoria) })
      marker.on('click', () => onSelectRef.current?.(place))
      cluster.addLayer(marker)
    })
  }, [activeFilter])

  return (
    <div className="absolute inset-0">
      {/* Leaflet map */}
      <div ref={containerRef} className="w-full h-full" />

      {/* FilterBar — floats below Navbar (68 px) */}
      <div
        className="absolute left-1/2 z-[1001] w-full max-w-2xl px-4"
        style={{ top: 76, transform: 'translateX(-50%)' }}
      >
        <FilterBar
          categories={CATEGORIES}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Leaflet control overrides */}
      <style>{`
        .leaflet-control-zoom {
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          background: rgba(255,255,255,0.75) !important;
          border: 1px solid rgba(255,255,255,0.5) !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
          margin-top: 80px !important;
        }
        .leaflet-control-zoom a {
          background: transparent !important;
          color: #1a1a1a !important;
          border-bottom: 1px solid rgba(0,0,0,0.07) !important;
          font-size: 18px !important;
          line-height: 34px !important;
          width: 34px !important;
          height: 34px !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(42,157,143,0.1) !important;
          color: #2A9D8F !important;
        }
        .leaflet-control-attribution {
          background: rgba(255,255,255,0.65) !important;
          backdrop-filter: blur(4px);
          font-size: 10px !important;
          border-radius: 6px 0 0 0 !important;
          padding: 2px 6px !important;
        }
        /* Cluster markers */
        .mc-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mc-inner {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(42,157,143,0.85);
          border: 2.5px solid white;
          color: white;
          font-weight: 700;
          font-size: 12px;
          font-family: Inter, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(42,157,143,0.45);
        }
      `}</style>
    </div>
  )
}
