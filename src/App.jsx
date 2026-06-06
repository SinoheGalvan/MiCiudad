import { useState } from 'react'
import Navbar from './components/Navbar'
import PlaceCard from './components/PlaceCard'
import Map from './components/Map'
import ChatBot from './components/ChatBot'

export default function App() {
  const [selectedPlace, setSelectedPlace] = useState(null)

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Placeholder — reemplazar con <Map onPlaceSelect={setSelectedPlace} /> cuando el módulo esté listo */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
        style={{ background: '#EDF4F3' }}
      >
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            fill="#2A9D8F"
            fillOpacity="0.2"
            stroke="#2A9D8F"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="9" r="2.5" fill="#2A9D8F" />
        </svg>
        <p className="text-sm font-semibold tracking-wide" style={{ color: '#2A9D8F' }}>
          Cargando mapa...
        </p>
      </div>

      {/* Navbar — floats on top */}
      <Navbar />

      {/* PlaceCard — side panel (desktop) / bottom sheet (mobile) */}
      {selectedPlace && (
        <PlaceCard
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      {/* ChatBot — positioned bottom-right, managed externally */}
      <ChatBot />
    </div>
  )
}
