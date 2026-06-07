import { places } from '../data/places'

const events = places.filter(p => p.categoria === 'Evento')

const EVENT_DATES = [
  'Vie 13 Jun · 19:00 hrs',
  'Sáb 14 Jun · 18:00 hrs',
  'Dom 15 Jun · 12:00 hrs',
  'Vie 20 Jun · 20:00 hrs',
  'Sáb 21 Jun · 17:00 hrs',
]

function getEventDate(id) {
  return EVENT_DATES[id % EVENT_DATES.length]
}

export default function Events({ onBack, onViewOnMap }) {
  return (
    <div
      className="fixed inset-0 z-[1500] flex flex-col"
      style={{ background: 'linear-gradient(135deg, #e8f4f2 0%, #f0f7f6 50%, #e8f4f2 100%)', minHeight: '100vh' }}
    >
      <style>{`
        @keyframes evFadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ev-card {
          animation: evFadeInUp 400ms ease-out both;
          transition: transform 200ms ease, box-shadow 200ms ease;
        }
        .ev-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important;
        }
      `}</style>

      {/* ── Sticky header ─────────────────────────────── */}
      <header
        className="sticky top-0 z-10 flex-shrink-0 px-4 pt-3 pb-4 flex flex-col gap-1"
        style={{
          background: 'rgba(248,248,248,0.75)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 1px 0 rgba(0,0,0,0.05)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Volver al mapa"
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-black/6 transition-colors"
          >
            <BackIcon />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Eventos en Durango</h1>
            <p className="text-xs text-gray-400 leading-none mt-0.5">Próximas actividades en tu ciudad</p>
          </div>
        </div>
      </header>

      {/* ── Events grid ───────────────────────────────── */}
      <div className="flex-1 overflow-y-auto" style={{ padding: 24 }}>
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <span style={{ fontSize: 52 }}>📅</span>
            <div>
              <p className="font-bold text-gray-700 text-base">No hay eventos próximos registrados</p>
              <p className="text-sm text-gray-400 mt-1">Vuelve pronto para ver actividades en Durango</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {events.map((place, i) => (
              <EventCard
                key={place.id}
                place={place}
                index={i}
                onViewOnMap={onViewOnMap}
                onBack={onBack}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EventCard({ place, index, onViewOnMap, onBack }) {
  return (
    <div
      className="ev-card flex flex-col overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(16px) saturate(150%)',
        WebkitBackdropFilter: 'blur(16px) saturate(150%)',
        border: '1px solid rgba(255,255,255,0.8)',
        borderRadius: 20,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Image */}
      <div className="relative flex-shrink-0" style={{ height: 200 }}>
        <img
          src={place.imagen}
          alt={place.nombre}
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%)' }}
        />

        {/* Badge: "Evento" — top left */}
        <span
          className="absolute text-xs font-semibold"
          style={{
            top: 12,
            left: 12,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 999,
            padding: '4px 12px',
            color: '#2A9D8F',
            border: '1px solid rgba(255,255,255,0.9)',
          }}
        >
          Evento
        </span>

        {/* Badge: date — top right */}
        <span
          className="absolute text-xs font-semibold"
          style={{
            top: 12,
            right: 12,
            background: 'rgba(42,157,143,0.9)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 999,
            padding: '6px 14px',
            color: 'white',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {getEventDate(place.id)}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3 }}>
          {place.nombre}
        </h3>

        {place.direccion && (
          <p style={{ fontSize: 14, color: '#666', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <span>📍</span> {place.direccion}
          </p>
        )}
        {place.horario && (
          <p style={{ fontSize: 14, color: '#666', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <span>🕐</span> {place.horario}
          </p>
        )}

        {place.descripcion && (
          <p
            style={{
              fontSize: 14,
              color: '#444',
              marginTop: 8,
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {place.descripcion}
          </p>
        )}

        <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '8px 0' }} />

        <button
          onClick={() => { onViewOnMap(place); onBack() }}
          className="flex items-center justify-center gap-2 py-3 font-semibold transition-all active:scale-95 hover:opacity-90"
          style={{
            background: 'rgba(42,157,143,0.9)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 999,
            color: 'white',
            fontSize: 15,
            border: '1px solid rgba(42,157,143,0.3)',
            boxShadow: '0 2px 8px rgba(42,157,143,0.25)',
            cursor: 'pointer',
          }}
        >
          📍 Ver en mapa
        </button>
      </div>
    </div>
  )
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}
