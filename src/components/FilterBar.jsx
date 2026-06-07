const CATEGORY_ICONS = {
  Todos: '🗺️',
  Restaurante: '🍽️',
  Museo: '🏛️',
  Café: '☕',
  Artesanías: '🎨',
  Histórico: '🏰',
  Evento: '🎉',
}

export default function FilterBar({ categories, activeFilter, onFilterChange }) {
  return (
    <div
      className="glass flex gap-2 p-2 overflow-x-auto"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {categories.map((cat) => {
        const active = cat === activeFilter
        return (
          <button
            key={cat}
            onClick={() => onFilterChange(cat)}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
            style={
              active
                ? { background: '#2A9D8F', color: '#fff', boxShadow: '0 2px 8px rgba(42,157,143,0.35)' }
                : { background: 'rgba(255,255,255,0.65)', color: '#374151' }
            }
          >
            <span style={{ fontSize: 14 }}>{CATEGORY_ICONS[cat] ?? '📍'}</span>
            {cat}
          </button>
        )
      })}
    </div>
  )
}
