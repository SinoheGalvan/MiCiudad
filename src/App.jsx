import { useState } from 'react'
import Navbar from './components/Navbar'
import PlaceCard from './components/PlaceCard'
import Map from './components/Map'
import ChatBot from './components/ChatBot'
import Drawer from './components/Drawer'

export default function App() {
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [drawerOpen, setDrawerOpen]       = useState(false)
  const [savedPlaces, setSavedPlaces]     = useState([])
  const [activeFilter, setActiveFilter]   = useState('Todos')

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Map — base layer, full screen; place-open mueve el zoom cuando PlaceCard está visible */}
      <div className={`absolute inset-0${selectedPlace ? ' place-open' : ''}`}>
        <Map onPlaceSelect={setSelectedPlace} />
      </div>

      {/* Navbar — floats on top */}
      <Navbar
        onDrawerOpen={() => setDrawerOpen(true)}
        onPlaceSelect={setSelectedPlace}
      />

      {/* PlaceCard — side panel (desktop) / bottom sheet (mobile) */}
      {selectedPlace && (
        <PlaceCard
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      {/* Drawer — left-side menu */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        savedPlaces={savedPlaces}
        onCategorySelect={setActiveFilter}
      />

      {/* ChatBot — positioned bottom-right, managed externally */}
      <ChatBot />
    </div>
  )
}
