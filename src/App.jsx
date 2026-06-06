import { useState } from 'react'
import Navbar from './components/Navbar'
import PlaceCard from './components/PlaceCard'
import Map from './components/Map'
import ChatBot from './components/ChatBot'

export default function App() {
  const [selectedPlace, setSelectedPlace] = useState(null)

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Map — base layer, full screen */}
      <Map onPlaceSelect={setSelectedPlace} />

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
