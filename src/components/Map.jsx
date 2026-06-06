// Módulo del mapa — implementación a cargo del equipo de mapas
// Props: onPlaceSelect(place) — llamar cuando el usuario seleccione un lugar
export default function Map({ onPlaceSelect }) {
  return (
    <div className="w-full h-full bg-[#e8ede9] flex items-center justify-center select-none">
      <span className="text-gray-400 text-sm font-medium tracking-wide uppercase">
        Mapa · En desarrollo
      </span>
    </div>
  )
}
