import { useState } from 'react'

const CATEGORIAS = ['Restaurante', 'Hotel', 'Atracción turística', 'Tienda', 'Servicio', 'Otro']

export default function Navbar() {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ nombre: '', categoria: '', contacto: '' })

  function handleField(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleClose() {
    setModalOpen(false)
    setForm({ nombre: '', categoria: '', contacto: '' })
  }

  return (
    <>
      <nav className="glass-navbar fixed top-0 left-0 right-0 z-50 px-5 py-3 flex items-center justify-between">
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-[1.2rem] text-[#2A9D8F] tracking-tight">MiCiudad</span>
          <span className="text-[0.7rem] text-gray-500 font-medium tracking-wide uppercase">
            Descubre Durango
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-outline hidden sm:inline-block">Explorar</button>
          <button className="btn-accent" onClick={() => setModalOpen(true)}>
            <span className="hidden sm:inline">Registra tu negocio</span>
            <span className="sm:hidden">Registrar</span>
          </button>
        </div>
      </nav>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={e => e.target === e.currentTarget && handleClose()}
        >
          <div
            className="glass-card w-full max-w-md rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.9)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Registra tu negocio</h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-xl leading-none"
                aria-label="Cerrar"
              >
                &times;
              </button>
            </div>

            <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
              <Field label="Nombre del negocio">
                <input
                  name="nombre"
                  type="text"
                  placeholder="Ej. Taquería La Auténtica"
                  value={form.nombre}
                  onChange={handleField}
                  className="input-field"
                />
              </Field>

              <Field label="Categoría">
                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={handleField}
                  className="input-field bg-white"
                >
                  <option value="">Selecciona una categoría</option>
                  {CATEGORIAS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Teléfono o correo">
                <input
                  name="contacto"
                  type="text"
                  placeholder="618 123 4567 o negocio@ejemplo.com"
                  value={form.contacto}
                  onChange={handleField}
                  className="input-field"
                />
              </Field>

              <button type="submit" className="btn-accent w-full py-3 rounded-xl mt-1">
                Enviar solicitud
              </button>
            </form>
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
      `}</style>
    </>
  )
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {children}
    </div>
  )
}
