import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { places } from '../data/places'
import FilterBar from './FilterBar'

const ORIGIN = { lat: 24.0147, lng: -104.6701 }

const CATEGORY_CONFIG = {
  Restaurante: { color: '#E07A5F' },
  Museo:       { color: '#4A6FA5' },
  Café:        { color: '#8B6B47' },
  Artesanías:  { color: '#9B59B6' },
  Histórico:   { color: '#2C3E50' },
  Evento:      { color: '#F39C12' },
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

function makeEventIcon() {
  const html = `
    <div style="position:relative;width:40px;height:40px;">
      <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"
        style="width:40px;height:40px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
        <polygon
          points="20,3 25,14 37,14 28,22 31,34 20,27 9,34 12,22 3,14 15,14"
          fill="#F39C12"
          stroke="white"
          stroke-width="2"
        />
        <text
          x="20" y="23"
          text-anchor="middle"
          font-size="11"
          font-weight="bold"
          fill="white"
          font-family="Arial, sans-serif"
        >EVT</text>
      </svg>
    </div>
  `
  return L.divIcon({
    html,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  })
}

const DURANGO_CENTER = [24.0277, -104.6532]
const CATEGORIES = ['Todos', ...Object.keys(CATEGORY_CONFIG)]

export default function Map({ onPlaceSelect, mapRef, routeDestination, userLocation }) {
  const containerRef = useRef(null)
  const mapInst = useRef(null)
  const clusterRef = useRef(null)
  const routingControlRef = useRef(null)
  const userMarkerRef = useRef(null)
  const onSelectRef = useRef(onPlaceSelect)
  const [activeFilter, setActiveFilter] = useState('Todos')

  useEffect(() => { onSelectRef.current = onPlaceSelect })

  // Initialize map once
  useEffect(() => {
    if (mapInst.current || !containerRef.current) return

    const map = L.map(containerRef.current, {
      center: DURANGO_CENTER,
      zoom: 15,
      zoomControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Zoom controls — bottom-left: clear of FilterBar (top), chatbot (bottom-right) and PlaceCard (right)
    L.control.zoom({ position: 'bottomleft' }).addTo(map)

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

    mapInst.current = map
    clusterRef.current = cluster
    if (mapRef) mapRef.current = map

    return () => {
      map.remove()
      mapInst.current = null
      clusterRef.current = null
      if (mapRef) mapRef.current = null
    }
  }, [])

  // Show / update user location marker
  useEffect(() => {
    const map = mapInst.current
    if (!map) return

    if (userMarkerRef.current) {
      userMarkerRef.current.remove()
      userMarkerRef.current = null
    }

    if (!userLocation) return

    const userIcon = L.divIcon({
      html: `
        <div style="width:20px;height:20px;position:relative;">
          <div style="
            position:absolute;width:40px;height:40px;
            top:-10px;left:-10px;
            background:rgba(42,157,143,0.2);
            border-radius:50%;
            animation:locationPulse 2s ease-out infinite;
          "></div>
          <div style="
            width:20px;height:20px;
            background:#2A9D8F;
            border:3px solid white;
            border-radius:50%;
            box-shadow:0 2px 8px rgba(42,157,143,0.5);
            position:relative;z-index:1;
          "></div>
        </div>
      `,
      className: '',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })

    userMarkerRef.current = L.marker(
      [userLocation.lat, userLocation.lng],
      { icon: userIcon, zIndexOffset: 1000 }
    )
      .addTo(map)
      .bindPopup('📍 Tu ubicación actual')
  }, [userLocation])

  // Draw / clear route whenever routeDestination changes
  useEffect(() => {
    // cleanup helper
    const clearControl = () => {
      if (routingControlRef.current && mapInst.current) {
        try { mapInst.current.removeControl(routingControlRef.current) } catch (_) {}
        routingControlRef.current = null
      }
    }

    if (!routeDestination) {
      clearControl()
      return
    }

    console.log('Creating route to:', routeDestination)
    console.log('Coords:', routeDestination.lat, routeDestination.lng)
    console.log('Are numbers:',
      typeof routeDestination.lat === 'number',
      typeof routeDestination.lng === 'number'
    )

    // delay so the map instance is guaranteed ready
    const timer = setTimeout(() => {
      if (!mapInst.current) return
      if (!L.Routing) {
        console.error('L.Routing is undefined — leaflet-routing-machine may not have loaded')
        return
      }

      clearControl()

      try {
        const origin      = L.latLng(
          parseFloat(routeDestination.originLat || 24.0147),
          parseFloat(routeDestination.originLng || -104.6701)
        )
        const destination = L.latLng(
          parseFloat(routeDestination.lat),
          parseFloat(routeDestination.lng)
        )

        const control = L.Routing.control({
          waypoints: [origin, destination],
          router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            profile: 'driving',
          }),
          routeWhileDragging: false,
          showAlternatives: false,
          show: false,
          collapsible: true,
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: false,
          lineOptions: {
            styles: [{ color: '#2A9D8F', weight: 5, opacity: 0.85 }],
            extendToWaypoints: true,
            missingRouteTolerance: 0,
          },
          createMarker: (i, waypoint) => {
            const emoji = i === 0 ? '🚌' : '📍'
            const color = i === 0 ? '#2A9D8F' : '#E07A5F'
            return L.marker(waypoint.latLng, {
              icon: L.divIcon({
                html: `<div style="
                  width:32px;height:32px;
                  background:${color};
                  border:3px solid white;border-radius:50%;
                  display:flex;align-items:center;justify-content:center;
                  box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:14px;
                ">${emoji}</div>`,
                className: '',
                iconSize: [32, 32],
                iconAnchor: [16, 16],
              }),
            })
          },
        }).addTo(mapInst.current)

        control.on('routesfound', (e) => {
          console.log('Route found:', e.routes[0])
          const bounds = L.latLngBounds([origin, destination])
          mapInst.current?.fitBounds(bounds, { padding: [80, 80], animate: true, duration: 1.5 })
        })
        control.on('routingerror', (e) => {
          console.error('Routing error:', e)
          const bounds = L.latLngBounds([origin, destination])
          mapInst.current?.fitBounds(bounds, { padding: [80, 80] })
        })

        routingControlRef.current = control
      } catch (err) {
        console.error('Error creating routing control:', err)
      }
    }, 400)

    return () => {
      clearTimeout(timer)
      clearControl()
    }
  }, [routeDestination])

  // Rebuild markers whenever filter changes
  useEffect(() => {
    const cluster = clusterRef.current
    if (!cluster) return

    cluster.clearLayers()

    const visible = activeFilter === 'Todos'
      ? places
      : places.filter((p) => p.categoria === activeFilter)

    visible.forEach((place) => {
      const icon = place.categoria === 'Evento' ? makeEventIcon() : makePinIcon(place.categoria)
      const marker = L.marker([place.lat, place.lng], { icon })
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
        /* Position the bottom-left corner container */
        .leaflet-bottom.leaflet-left {
          margin-bottom: 16px;
          margin-left: 8px;
        }
        /* When PlaceCard bottom sheet is open, App.jsx adds .has-placecard to <body>
           so the zoom floats above the sheet (72 vh max-height + gap) */
        .has-placecard .leaflet-bottom.leaflet-left {
          margin-bottom: calc(72vh + 8px);
        }
        .leaflet-control-zoom {
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          background: rgba(255,255,255,0.75) !important;
          border: 1px solid rgba(255,255,255,0.5) !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
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
