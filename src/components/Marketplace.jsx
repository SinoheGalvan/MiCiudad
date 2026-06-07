import { useState } from 'react'
import { products } from '../data/products'

const CATEGORIAS = ['Todos', 'Alimentos', 'Artesanías', 'Ropa', 'Dulces', 'Plantas', 'Electrónica local', 'Servicios']

export default function Marketplace({ onBack, onViewOnMap }) {
  const [search, setSearch]           = useState('')
  const [activeCategory, setCategory] = useState('Todos')

  const filtered = products.filter(p => {
    const matchesCat    = activeCategory === 'Todos' || p.categoria === activeCategory
    const q             = search.trim().toLowerCase()
    const matchesSearch = !q || p.nombre.toLowerCase().includes(q) || p.vendedor.toLowerCase().includes(q)
    return matchesCat && matchesSearch
  })

  return (
    <div
      className="fixed inset-0 z-[1500] flex flex-col"
      style={{ background: 'linear-gradient(135deg, #e8f4f2 0%, #f0f7f6 50%, #e8f4f2 100%)', minHeight: '100vh' }}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .product-card {
          animation: fadeInUp 400ms ease-out both;
          transition: transform 200ms ease, box-shadow 200ms ease;
        }
        .product-card:hover {
          transform: translateY(-4px) !important;
          box-shadow:
            0 12px 40px rgba(0,0,0,0.12),
            inset 0 1px 0 rgba(255,255,255,0.9) !important;
        }
        .cat-chips::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── Sticky header ─────────────────────────────── */}
      <header
        className="sticky top-0 z-10 flex-shrink-0 px-4 pt-3 pb-3 flex flex-col gap-3"
        style={{
          background: 'rgba(248,248,248,0.75)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 1px 0 rgba(0,0,0,0.05)',
        }}
      >
        {/* Top row */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Volver al mapa"
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-black/6 transition-colors"
          >
            <BackIcon />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Mercado Local</h1>
            <p className="text-xs text-gray-400 leading-none mt-0.5">Apoya a los emprendedores de Durango</p>
          </div>
        </div>

        {/* Search bar */}
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.9)',
            borderRadius: 999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
          }}
        >
          <SearchIcon />
          <input
            type="text"
            placeholder="Buscar productos o vendedores..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              aria-label="Limpiar búsqueda"
            >
              &times;
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="cat-chips flex gap-2 overflow-x-auto pb-0.5">
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={
                cat === activeCategory
                  ? {
                      background: 'rgba(42,157,143,0.85)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(42,157,143,0.3)',
                      color: 'white',
                      boxShadow: '0 2px 12px rgba(42,157,143,0.3)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.6)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.8)',
                      color: '#555',
                    }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* ── Product grid ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onViewOnMap={onViewOnMap}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product, index, onViewOnMap }) {
  return (
    <div
      className="product-card flex flex-col overflow-hidden"
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
          src={product.imagen}
          alt={product.nombre}
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.15) 100%)',
          }}
        />
        {/* Category badge */}
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
          {product.categoria}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-bold text-gray-900 text-base leading-snug" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.nombre}
        </h3>

        <p
          className="text-sm text-gray-500 leading-relaxed flex-1"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.descripcion}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="font-bold" style={{ fontSize: 20, color: '#2A9D8F' }}>
            ${product.precio} <span className="text-xs font-normal text-gray-400">MXN</span>
          </span>
          <span className="text-xs text-gray-400 truncate max-w-[55%] text-right">
            {product.vendedor}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => onViewOnMap(product.placeId)}
            className="flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-semibold transition-all active:scale-95 hover:opacity-90 flex-1"
            style={{
              background: 'rgba(42,157,143,0.9)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(42,157,143,0.3)',
              color: 'white',
              borderRadius: 999,
              boxShadow: '0 2px 8px rgba(42,157,143,0.25)',
            }}
          >
            <PinIcon />
            Ver en mapa
          </button>

          {product.envio && (
            <div
              className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold flex-shrink-0"
              style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(42,157,143,0.3)',
                color: '#2A9D8F',
                borderRadius: 999,
              }}
            >
              <TruckIcon />
              Envío
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        <BoxIcon />
      </div>
      <div>
        <p className="font-bold text-gray-700 text-base">Sin productos en esta categoría</p>
        <p className="text-sm text-gray-400 mt-1 max-w-xs leading-relaxed">
          ¡Pronto habrá más! Prueba con otra categoría o busca por nombre.
        </p>
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

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function TruckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function BoxIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2A9D8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  )
}
