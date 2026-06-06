export default function PlaceCard({ place, onClose }) {
  if (!place) return null

  const mapsUrl = place.lat && place.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`
    : `https://maps.google.com/?q=${encodeURIComponent(
        place.direccion ? `${place.nombre}, ${place.direccion}` : place.nombre
      )}`

  return (
    <div
      className="
        glass-card fixed z-[1050]
        left-0 right-0 bottom-0 rounded-t-2xl rounded-b-none
        sm:left-auto sm:right-4 sm:bottom-4 sm:top-[68px] sm:w-[380px] sm:rounded-2xl
        flex flex-col overflow-hidden
        max-h-[72vh] sm:max-h-none
      "
    >
      {/* Close button — always top-right */}
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="
          absolute top-3 right-3 z-10
          w-8 h-8 rounded-full flex items-center justify-center
          bg-black/25 text-white hover:bg-black/45
          text-xl leading-none transition-colors
        "
      >
        &times;
      </button>

      {/* Image */}
      {place.imagen ? (
        <div className="relative h-44 flex-shrink-0">
          <img
            src={place.imagen}
            alt={place.nombre}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {place.categoria && (
            <span className="absolute bottom-3 left-4 bg-[#2A9D8F] text-white text-xs font-semibold px-3 py-1 rounded-full">
              {place.categoria}
            </span>
          )}
        </div>
      ) : (
        <div
          className="relative h-24 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(42,157,143,0.25), rgba(42,157,143,0.08))' }}
        >
          {place.categoria && (
            <span className="absolute bottom-3 left-4 bg-[#2A9D8F] text-white text-xs font-semibold px-3 py-1 rounded-full">
              {place.categoria}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-900 leading-snug pr-4">
          {place.nombre}
        </h2>

        {place.descripcion && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {place.descripcion}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {place.direccion && (
            <InfoRow
              label="Dirección"
              value={place.direccion}
              icon={<PinIcon />}
            />
          )}
          {place.horario && (
            <InfoRow
              label="Horario"
              value={place.horario}
              icon={<ClockIcon />}
            />
          )}
          {place.contacto && (
            <InfoRow
              label="Contacto"
              value={place.contacto}
              icon={<PhoneIcon />}
            />
          )}
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-accent block text-center py-3 rounded-xl mt-auto"
        >
          Cómo llegar
        </a>
      </div>
    </div>
  )
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="flex-shrink-0 mt-0.5 text-[#2A9D8F]">{icon}</span>
      <div>
        <span className="block text-[0.65rem] font-bold text-[#2A9D8F] uppercase tracking-widest">
          {label}
        </span>
        <span className="block text-sm text-gray-700 mt-0.5 leading-snug">{value}</span>
      </div>
    </div>
  )
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.09 6.09l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
