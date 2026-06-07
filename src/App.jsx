import { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import PlaceCard from './components/PlaceCard'
import Map from './components/Map'
import ChatBot from './components/ChatBot'
import Drawer from './components/Drawer'
import Onboarding from './components/Onboarding'
import Marketplace from './components/Marketplace'
import Events from './components/Events'
import { places } from './data/places'

function readLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback }
  catch { return fallback }
}

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(() => !!localStorage.getItem('miCiudad_onboarded'))
  const [initialFilter, setInitialFilter]   = useState('Todos')

  const [user, setUser]                       = useState(() => readLS('miCiudad_user', null))
  const [selectedPlace, setSelectedPlace]     = useState(null)
  const [drawerOpen, setDrawerOpen]           = useState(false)
  const [savedPlaces, setSavedPlaces]         = useState(() => readLS('miCiudad_saved', []))
  const [activeFilter, setActiveFilter]       = useState('Todos')
  const [showMarketplace, setShowMarketplace] = useState(false)
  const [showEvents, setShowEvents]           = useState(false)
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
  const [routeDestination, setRouteDestination] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [locationEnabled, setLocationEnabled] = useState(false)
  const mapRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('miCiudad_saved', JSON.stringify(savedPlaces))
  }, [savedPlaces])

  function handleOnboardingComplete(categories, userData) {
    if (categories && categories.length === 1) {
      setInitialFilter(categories[0])
      setActiveFilter(categories[0])
    }
    if (userData) {
      setUser(userData)
      localStorage.setItem('miCiudad_user', JSON.stringify(userData))
    }
    localStorage.setItem('miCiudad_onboarded', '1')
    setOnboardingDone(true)
  }

  function handleViewOnMap(placeOrId) {
    const place = typeof placeOrId === 'object'
      ? placeOrId
      : places.find(p => p.id === placeOrId)
    if (!place) return
    setSelectedPlace(place)
    setShowMarketplace(false)
    setShowEvents(false)
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.flyTo([place.lat, place.lng], 17, { animate: true, duration: 1.5 })
      }
    }, 300)
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude }
        setUserLocation(coords)
        setLocationEnabled(true)
        if (mapRef.current) {
          mapRef.current.flyTo([coords.lat, coords.lng], 16, { animate: true, duration: 1.5 })
        }
      },
      (error) => {
        console.error('Location error:', error)
        setLocationEnabled(false)
        alert('No se pudo obtener tu ubicación. Verifica los permisos.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  function disableLocation() {
    setUserLocation(null)
    setLocationEnabled(false)
  }

  function handleEventOnMap(place) {
    setSelectedPlace(place)
    setShowEvents(false)
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.flyTo([place.lat, place.lng], 17, { animate: true, duration: 1.5 })
      }
    }, 300)
  }

  if (!onboardingDone) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  if (showMarketplace) {
    return (
      <Marketplace
        onBack={() => setShowMarketplace(false)}
        onViewOnMap={handleViewOnMap}
      />
    )
  }

  if (showEvents) {
    return (
      <Events
        onBack={() => setShowEvents(false)}
        onViewOnMap={handleEventOnMap}
      />
    )
  }

  const mobileSearchResults = mobileSearchQuery.trim()
    ? places.filter(p => {
        const q = mobileSearchQuery.toLowerCase()
        return (
          p.nombre.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(q))
        )
      }).slice(0, 5)
    : []

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Map — base layer, full screen */}
      <div className={`absolute inset-0${selectedPlace ? ' place-open' : ''}`}>
        <Map
          onPlaceSelect={setSelectedPlace}
          initialFilter={initialFilter}
          mapRef={mapRef}
          routeDestination={routeDestination}
          onClearRoute={() => setRouteDestination(null)}
          userLocation={userLocation}
        />
      </div>

      {/* Navbar — floats on top */}
      <Navbar
        onDrawerOpen={() => setDrawerOpen(true)}
        onPlaceSelect={setSelectedPlace}
        onMarketplaceOpen={() => setShowMarketplace(true)}
      />

      {/* PlaceCard — side panel (desktop) / bottom sheet (mobile) */}
      {selectedPlace && (
        <PlaceCard
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          savedPlaces={savedPlaces}
          onToggleSave={(place) => {
            setSavedPlaces(prev => {
              const exists = prev.find(p => p.id === place.id)
              const updated = exists
                ? prev.filter(p => p.id !== place.id)
                : [...prev, place]
              if (user) {
                localStorage.setItem('mc_favorites', JSON.stringify(updated))
              }
              return updated
            })
          }}
          onCreateRoute={(place) => {
            setRouteDestination({
              lat: place.lat,
              lng: place.lng,
              originLat: userLocation?.lat || 24.0147,
              originLng: userLocation?.lng || -104.6701,
              originName: userLocation ? 'Tu ubicación' : 'Central Camionera de Durango',
            })
            setSelectedPlace(null)
          }}
        />
      )}

      {/* Route active banner */}
      {routeDestination && (
        <div style={{
          position: 'fixed',
          top: '72px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(42,157,143,0.3)',
          borderRadius: '999px',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          fontSize: '14px',
          fontWeight: '500',
          color: '#1a1a1a',
          whiteSpace: 'nowrap',
        }}>
          <span>🗺️ Ruta desde {routeDestination.originName || 'Central Camionera'}</span>
          <button
            onClick={() => setRouteDestination(null)}
            style={{
              background: 'rgba(224,122,95,0.15)',
              border: '1px solid rgba(224,122,95,0.3)',
              borderRadius: '999px',
              padding: '2px 12px',
              fontSize: '13px',
              color: '#E07A5F',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Drawer — left-side menu */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        savedPlaces={savedPlaces}
        onCategorySelect={setActiveFilter}
        user={user}
        onEventsOpen={() => setShowEvents(true)}
        locationEnabled={locationEnabled}
        onLocationToggle={() => locationEnabled ? disableLocation() : requestLocation()}
      />

      {/* ChatBot — positioned bottom-right */}
      <ChatBot />

      {/* Mobile bottom search bar — only visible on mobile via CSS */}
      {!showMarketplace && !showEvents && (
        <>
          <div className="mobile-bottom-bar">
            <div className="mobile-search-pill">
              <svg
                className="search-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Descubre Durango..."
                value={mobileSearchQuery}
                onChange={e => setMobileSearchQuery(e.target.value)}
              />
              {mobileSearchQuery && (
                <button
                  onClick={() => setMobileSearchQuery('')}
                  style={{ color: '#9ca3af', fontSize: 18, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                  aria-label="Limpiar búsqueda"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Mobile search dropdown */}
          {mobileSearchResults.length > 0 && (
            <div className="mobile-search-dropdown">
              {mobileSearchResults.map(place => (
                <button
                  key={place.id}
                  onClick={() => { setSelectedPlace(place); setMobileSearchQuery('') }}
                  className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(42,157,143,0.06)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <span className="text-sm font-medium text-gray-800 truncate">{place.nombre}</span>
                  <span
                    className="text-xs font-semibold ml-2 flex-shrink-0 px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(42,157,143,0.12)', color: '#2A9D8F' }}
                  >
                    {place.categoria}
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
