import { useState } from 'react'

export default function Drawer({ isOpen, onClose, savedPlaces = [], onCategorySelect, user = null, onEventsOpen, locationEnabled = false, onLocationToggle }) {
  const [notifs,   setNotifs]   = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[1300] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 left-0 h-full z-[1350] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: 'min(300px, 85vw)' }}
        aria-modal="true"
        role="dialog"
        aria-label="Menú principal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            {user ? (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: '#2A9D8F' }}
              >
                {user.initials}
              </div>
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(42,157,143,0.12)' }}
              >
                <UserIcon className="text-[#2A9D8F]" />
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-[#2A9D8F]">{user ? user.name : 'MiCiudad'}</p>
              <p className="text-xs text-gray-400">{user ? user.email : 'Mi perfil'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Cerrar menú"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">

          {/* ── Lugares guardados ───────────────────── */}
          <Section icon={<PinIcon />} title="Lugares guardados">
            {savedPlaces.length === 0 ? (
              <EmptyState text="Aún no tienes lugares guardados. ¡Explora el mapa!" />
            ) : (
              <div className="flex flex-col gap-2">
                {savedPlaces.map(p => (
                  <div key={p.id} className="flex items-center gap-2 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">{p.nombre}</span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Divider />

          {/* ── Eventos en Durango ──────────────────── */}
          <button
            onClick={() => { onEventsOpen?.(); onClose() }}
            className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <span style={{ color: '#2A9D8F' }}><CalendarIcon /></span>
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                Eventos en Durango
              </span>
            </div>
            <ChevronRightIcon />
          </button>

          <Divider />

          {/* ── Mi cuenta ───────────────────────────── */}
          <Section icon={<UserIcon />} title="Mi cuenta">
            {user ? (
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: '#2A9D8F' }}
                >
                  {user.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Visitante</p>
                    <p className="text-xs text-gray-400">Sin sesión activa</p>
                  </div>
                </div>
                <button className="btn-accent w-full py-2.5 rounded-xl text-sm">
                  Iniciar sesión
                </button>
              </>
            )}
          </Section>

          <Divider />

          {/* ── Configuración ───────────────────────── */}
          <Section icon={<span>⚙️</span>} title="Configuración">
            <div className="flex flex-col">
              <ConfigRow
                emoji="🔔"
                title="Notificaciones"
                subtitle="Recibe alertas de eventos cercanos"
                type="toggle"
                value={notifs}
                onChange={setNotifs}
              />
              <ConfigRow
                emoji="🌙"
                title="Modo oscuro"
                subtitle="Cambiar apariencia de la app"
                type="toggle"
                value={darkMode}
                onChange={setDarkMode}
              />
              <ConfigRow
                emoji="📍"
                title="Ubicación"
                subtitle={locationEnabled ? 'Ubicación activa ✓' : 'Permitir acceso a tu ubicación'}
                type="toggle"
                value={locationEnabled}
                onChange={onLocationToggle}
              />
              <ConfigRow
                emoji="🌐"
                title="Idioma"
                subtitle="Español"
                type="chevron"
              />
            </div>
          </Section>

          <Divider />

          {/* ── Acerca de ───────────────────────────── */}
          <Section icon={<InfoIcon />} title="Acerca de MiCiudad">
            <p className="text-sm text-gray-500 leading-relaxed">
              MiCiudad es una plataforma local para descubrir Durango.{' '}
              <span className="font-semibold" style={{ color: '#2A9D8F' }}>
                Versión hackathon 1.0
              </span>
            </p>
          </Section>

          <div className="h-6" />
        </div>
      </div>
    </>
  )
}

// ── Sub-components ────────────────────────────────────────

function ConfigRow({ emoji, title, subtitle, type, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-base flex-shrink-0">{emoji}</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-tight">{title}</p>
          <p className="text-xs text-gray-400 leading-tight mt-0.5 truncate">{subtitle}</p>
        </div>
      </div>
      <div className="flex-shrink-0 ml-3">
        {type === 'toggle' ? (
          <Toggle on={value} onChange={onChange} />
        ) : (
          <ChevronRightIcon />
        )}
      </div>
    </div>
  )
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      aria-checked={on}
      role="switch"
      className="relative flex-shrink-0"
      style={{
        width: 44,
        height: 24,
        borderRadius: 999,
        background: on ? '#2A9D8F' : '#D1D5DB',
        transition: 'background 200ms ease',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: on ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'white',
          transition: 'left 200ms ease',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  )
}

function Section({ icon, title, children }) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[#2A9D8F]">{icon}</span>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Divider() {
  return <div className="mx-4 h-px bg-gray-100" />
}

function EmptyState({ text }) {
  return <p className="text-sm text-gray-400 leading-relaxed py-1">{text}</p>
}

function PinIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function UserIcon({ className = '' }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
