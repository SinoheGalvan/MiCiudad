import { useState, useRef, useEffect } from 'react'
import { places } from '../data/places'

const CATEGORIAS_FORM = ['Restaurante', 'Hotel', 'Atracción turística', 'Tienda', 'Servicio', 'Otro']

const EMPTY_FORM = { nombre: '', categoria: '', direccion: '', contacto: '' }

export default function Navbar({ onDrawerOpen, onPlaceSelect, onMarketplaceOpen }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [query, setQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const searchRef = useRef(null)

  const results = query.trim().length > 0
    ? places
        .filter(p => {
          const q = query.toLowerCase()
          return (
            p.nombre.toLowerCase().includes(q) ||
            p.categoria.toLowerCase().includes(q) ||
            (p.descripcion && p.descripcion.toLowerCase().includes(q))
          )
        })
        .slice(0, 5)
    : []

  useEffect(() => {
    function onMouseDown(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function handleSelectResult(place) {
    onPlaceSelect?.(place)
    setQuery('')
    setDropdownOpen(false)
  }

  function handleCloseModal() {
    setModalOpen(false)
    setSubmitted(false)
    setForm(EMPTY_FORM)
    setErrors({})
  }

  function handleField(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => { const next = { ...prev }; delete next[name]; return next })
    }
  }

  function validate() {
    const newErrors = {}
    if (!form.nombre?.trim())    newErrors.nombre    = 'El nombre es requerido'
    if (!form.categoria)         newErrors.categoria  = 'Selecciona una categoría'
    if (!form.direccion?.trim()) newErrors.direccion  = 'La dirección es requerida'
    if (!form.contacto?.trim())  newErrors.contacto   = 'El contacto es requerido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const pending = JSON.parse(localStorage.getItem('mc_pending_businesses') || '[]')
    pending.push({ ...form, id: Date.now(), status: 'pending' })
    localStorage.setItem('mc_pending_businesses', JSON.stringify(pending))
    setSubmitted(true)
  }

  return (
    <>
      <nav className="glass-navbar fixed top-0 left-0 right-0 z-[1100] px-3 py-2.5 flex items-center gap-2 sm:gap-3">

        {/* Hamburger */}
        <button
          onClick={onDrawerOpen}
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-black/6 transition-colors"
          aria-label="Abrir menú"
        >
          <MenuIcon />
        </button>

        {/* Logo */}
        <div className="flex-shrink-0 flex flex-col leading-tight">
          <span className="font-bold text-[1.05rem] text-[#2A9D8F] tracking-tight">MiCiudad</span>
        </div>

        {/* Search — hidden on mobile, visible sm+ */}
        <div ref={searchRef} className="hidden sm:block flex-1 relative min-w-0">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <span className="flex-shrink-0 text-gray-400"><SearchIcon /></span>
            <input
              type="text"
              placeholder="Descubre Durango..."
              value={query}
              onChange={e => { setQuery(e.target.value); setDropdownOpen(true) }}
              onFocus={() => query.trim() && setDropdownOpen(true)}
              className="flex-1 min-w-0 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setDropdownOpen(false) }}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 text-lg leading-none"
                aria-label="Limpiar"
              >
                &times;
              </button>
            )}
          </div>

          {/* Dropdown results */}
          {dropdownOpen && results.length > 0 && (
            <div
              className="glass absolute top-full left-0 right-0 mt-1.5 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 10 }}
            >
              {results.map(place => (
                <button
                  key={place.id}
                  onMouseDown={() => handleSelectResult(place)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(42,157,143,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
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
        </div>

        {/* Buttons */}
        <div className="ml-auto sm:ml-0 flex-shrink-0 flex items-center gap-1.5">
          <button
            className="btn-outline !text-xs !px-2.5 !py-1.5 sm:!text-sm sm:!px-4 sm:!py-2"
            onClick={onMarketplaceOpen}
          >
            Mercado local
          </button>
          <button
            className="btn-accent !text-xs !px-2.5 !py-1.5 sm:!text-sm sm:!px-4 sm:!py-2"
            onClick={() => setModalOpen(true)}
          >
            <span className="hidden sm:inline">Registra tu negocio</span>
            <span className="sm:hidden">Registrar</span>
          </button>
        </div>
      </nav>

      {/* Register modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={e => e.target === e.currentTarget && handleCloseModal()}
        >
          <div
            className="glass-card w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.9)' }}
          >
            {submitted ? (
              /* ── Confirmation screen ── */
              <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{
                  width: 96, height: 96, borderRadius: '50%',
                  background: 'rgba(42,157,143,0.1)',
                  border: '3px solid #2A9D8F',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'scaleIn 400ms ease-out forwards',
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                    stroke="#2A9D8F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline
                      points="20 6 9 17 4 12"
                      style={{
                        strokeDasharray: 30,
                        strokeDashoffset: 30,
                        animation: 'drawCheck 500ms ease-out 300ms forwards',
                      }}
                    />
                  </svg>
                </div>
                <p style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginTop: 24 }}>
                  ¡Solicitud enviada!
                </p>
                <p style={{ fontSize: 15, color: '#666', lineHeight: 1.6, marginTop: 8 }}>
                  Su solicitud ha sido enviada de manera correcta. Nuestro equipo la revisará y le notificará cuando su negocio esté visible en el mapa.
                </p>
                <button
                  onClick={handleCloseModal}
                  style={{
                    marginTop: 32, width: '100%',
                    background: '#2A9D8F', color: 'white',
                    borderRadius: 999, padding: '14px',
                    fontSize: 16, fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  Entendido
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Registra tu negocio</h2>
                  <button
                    onClick={handleCloseModal}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-xl leading-none"
                    aria-label="Cerrar"
                  >
                    &times;
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <Field label="Nombre del negocio" error={errors.nombre}>
                    <input
                      name="nombre"
                      type="text"
                      placeholder="Ej. Taquería La Auténtica"
                      value={form.nombre}
                      onChange={handleField}
                      className="input-field"
                      style={errors.nombre ? { borderColor: '#E07A5F' } : {}}
                    />
                  </Field>
                  <Field label="Categoría" error={errors.categoria}>
                    <select
                      name="categoria"
                      value={form.categoria}
                      onChange={handleField}
                      className="input-field bg-white"
                      style={errors.categoria ? { borderColor: '#E07A5F' } : {}}
                    >
                      <option value="">Selecciona una categoría</option>
                      {CATEGORIAS_FORM.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Dirección" error={errors.direccion}>
                    <input
                      name="direccion"
                      type="text"
                      placeholder="Ej. Constitución 115, Centro, Durango"
                      value={form.direccion}
                      onChange={handleField}
                      className="input-field"
                      style={errors.direccion ? { borderColor: '#E07A5F' } : {}}
                    />
                  </Field>
                  <Field label="Teléfono o correo" error={errors.contacto}>
                    <input
                      name="contacto"
                      type="text"
                      placeholder="618 123 4567 o negocio@ejemplo.com"
                      value={form.contacto}
                      onChange={handleField}
                      className="input-field"
                      style={errors.contacto ? { borderColor: '#E07A5F' } : {}}
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn-accent w-full py-3 rounded-xl mt-1"
                  >
                    Enviar solicitud
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .input-field {
          width: 100%;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.625rem 0.875rem;
          font-size: 0.9rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          color: #1a1a1a;
        }
        .input-field:focus {
          border-color: #2A9D8F;
          box-shadow: 0 0 0 3px rgba(42, 157, 143, 0.15);
        }
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </>
  )
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {children}
      {error && (
        <p style={{ color: '#E07A5F', fontSize: 12, marginTop: 2 }}>{error}</p>
      )}
    </div>
  )
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}
