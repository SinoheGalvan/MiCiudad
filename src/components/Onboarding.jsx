import { useState } from 'react'

// ── Data ──────────────────────────────────────────────────

const MOCK_USER = {
  name: 'Juan García',
  email: 'juan.garcia@gmail.com',
  initials: 'JG',
  avatar: null,
}

const USER_TYPES = [
  { id: 'local',    emoji: '🏠', label: 'Soy de Durango',     sub: 'Quiero descubrir mi ciudad' },
  { id: 'tourist',  emoji: '✈️', label: 'Soy turista',         sub: 'Estoy visitando Durango' },
  { id: 'business', emoji: '🏪', label: 'Tengo un negocio',    sub: 'Quiero registrar mi emprendimiento' },
]

const INTERESTS = [
  { id: 'Restaurante', emoji: '🍽️', label: 'Restaurantes' },
  { id: 'Museo',       emoji: '🏛️', label: 'Museos' },
  { id: 'Café',        emoji: '☕',  label: 'Cafés' },
  { id: 'Artesanías',  emoji: '🎨', label: 'Artesanías' },
  { id: 'Histórico',   emoji: '📍', label: 'Histórico' },
  { id: 'Evento',      emoji: '🎉', label: 'Eventos' },
]

const BUSINESS_TYPES = [
  { id: 'Restaurante',     emoji: '🍽️', label: 'Restaurante' },
  { id: 'Café',            emoji: '☕',  label: 'Café' },
  { id: 'Artesanías',      emoji: '🎨', label: 'Artesanías' },
  { id: 'Tienda',          emoji: '🛍️', label: 'Tienda' },
  { id: 'Entretenimiento', emoji: '🎭', label: 'Entretenimiento' },
  { id: 'Otro',            emoji: '📦', label: 'Otro' },
]

const INTEREST_LABELS = {
  Restaurante: 'Restaurantes', Museo: 'Museos', Café: 'Cafés',
  Artesanías: 'Artesanías', Histórico: 'Histórico', Evento: 'Eventos',
}

const TIPS = {
  Restaurante: [
    'Registra tu horario actualizado, los usuarios lo consultan antes de salir',
    'Agrega fotos de tus platillos más populares para atraer más clientes',
    'Responde a las reseñas para construir confianza con tu comunidad',
  ],
  Café: [
    'Las fotos de ambiente aumentan las visitas, agrega imágenes de calidad',
    'Menciona si tienes WiFi y zonas de trabajo, son muy buscadas',
    'Comparte tu menú de temporada para mantener el interés de tus clientes',
  ],
  Artesanías: [
    'Describe los materiales y técnicas que usas, ayuda a valorar tu trabajo',
    'Indica si ofreces envíos o si solo vendes en tienda física',
    'Las historias detrás de tus piezas conectan emocionalmente con los clientes',
  ],
  default: [
    'Completa todos los campos de tu perfil para aparecer primero en búsquedas',
    'Actualiza tu horario regularmente para evitar clientes insatisfechos',
    'Las fotos de calidad aumentan hasta 3× las visitas a tu negocio',
  ],
}

// ── Main component ────────────────────────────────────────

export default function Onboarding({ onComplete }) {
  const [step, setStep]           = useState(0)
  const [stepKey, setStepKey]     = useState(0)
  const [userType, setUserType]   = useState(null)
  const [interests, setInterests] = useState([])
  const [bizTypes, setBizTypes]   = useState([])
  const [loginState, setLoginState] = useState('idle') // 'idle' | 'loading' | 'done'
  const [user, setUser]           = useState(null)

  function navigate(next) {
    setStepKey(k => k + 1)
    setStep(next)
  }

  function skip() { onComplete([], null) }

  function handleUserType(type) {
    setUserType(type)
    navigate(2)
  }

  function toggleInterest(id) {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  function toggleBizType(id) {
    setBizTypes(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  function handleComplete() {
    navigate(4)
  }

  function handleLoginWithGoogle() {
    setLoginState('loading')
    setTimeout(() => {
      setUser(MOCK_USER)
      setLoginState('done')
      setTimeout(() => {
        onComplete(userType === 'business' ? [] : interests, MOCK_USER)
      }, 800)
    }, 1200)
  }

  function handleSkipLogin() {
    onComplete(userType === 'business' ? [] : interests, null)
  }

  const tips = bizTypes.length > 0 ? (TIPS[bizTypes[0]] ?? TIPS.default) : TIPS.default

  return (
    <div
      className="fixed inset-0 z-[2000] flex flex-col"
      style={{ background: 'linear-gradient(135deg, #f8f8f8 0%, #e8f4f2 100%)' }}
    >
      <style>{`
        @keyframes stepIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ob-step { animation: stepIn 250ms ease forwards; }
        @keyframes confettiFall {
          from { opacity: 1; transform: translateY(0) rotate(0deg); }
          to   { opacity: 0; transform: translateY(90px) rotate(360deg); }
        }
      `}</style>

      {/* Skip — hidden on welcome (has its own) and on login step */}
      {step > 0 && step < 4 && (
        <button
          onClick={skip}
          className="fixed top-4 right-4 z-10 text-sm text-gray-400 hover:text-gray-600 transition-colors px-3 py-2 rounded-lg"
        >
          Saltar →
        </button>
      )}

      {/* Progress dots — 4 dots for steps 1-4 */}
      {step > 0 && (
        <div className="flex-shrink-0 flex justify-center gap-2 pt-10 pb-2">
          {[1, 2, 3, 4].map(dot => (
            <div
              key={dot}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: dot <= step ? '#2A9D8F' : 'rgba(42,157,143,0.22)',
                transform: dot === step ? 'scale(1.4)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      )}

      {/* Animated step wrapper */}
      <div
        key={stepKey}
        className="ob-step flex-1 flex flex-col items-center justify-center px-6 py-6 overflow-y-auto"
      >
        {step === 0 && <StepWelcome onNext={() => navigate(1)} onSkip={skip} />}
        {step === 1 && <StepWhoAreYou onSelect={handleUserType} />}
        {step === 2 && userType !== 'business' && (
          <StepInterests selected={interests} onToggle={toggleInterest} onNext={() => navigate(3)} />
        )}
        {step === 2 && userType === 'business' && (
          <StepBusiness selected={bizTypes} onToggle={toggleBizType} tips={tips} onNext={() => navigate(3)} />
        )}
        {step === 3 && (
          <StepFinal isBusiness={userType === 'business'} interests={interests} onComplete={handleComplete} />
        )}
        {step === 4 && (
          <StepLogin
            loginState={loginState}
            user={user}
            onGoogle={handleLoginWithGoogle}
            onSkip={handleSkipLogin}
          />
        )}
      </div>
    </div>
  )
}

// ── Steps ─────────────────────────────────────────────────

function StepWelcome({ onNext, onSkip }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center px-8 text-center"
      style={{ background: 'linear-gradient(145deg, #2A9D8F 0%, #1a7a6e 55%, #145f56 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-80px] right-[-60px] w-64 h-64 rounded-full opacity-10" style={{ background: 'white' }} />
      <div className="absolute bottom-[-40px] left-[-50px] w-48 h-48 rounded-full opacity-10" style={{ background: 'white' }} />

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-2">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-5 mx-auto">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight leading-none">MiCiudad</h1>
        </div>
        <p className="text-white/80 text-lg mt-4 max-w-xs leading-relaxed">
          Descubre todo lo que Durango tiene para ti
        </p>

        <button
          onClick={onNext}
          className="mt-10 px-12 py-4 rounded-full bg-white font-bold text-lg transition-all active:scale-95 hover:shadow-lg"
          style={{ color: '#2A9D8F', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}
        >
          Comenzar
        </button>

        <button
          onClick={onSkip}
          className="mt-4 text-white/55 text-sm hover:text-white/80 transition-colors py-2 px-4"
        >
          Saltar →
        </button>
      </div>
    </div>
  )
}

function StepWhoAreYou({ onSelect }) {
  return (
    <div className="w-full max-w-sm flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">¿Cómo vas a usar MiCiudad?</h2>
      <p className="text-gray-400 text-sm text-center mb-8">Cuéntanos para personalizar tu experiencia</p>

      <div className="w-full flex flex-col gap-3">
        {USER_TYPES.map(({ id, emoji, label, sub }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white text-left transition-all active:scale-[0.98] hover:shadow-md"
            style={{ border: '2px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2A9D8F'; e.currentTarget.style.background = 'rgba(42,157,143,0.04)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.background = 'white' }}
          >
            <span className="text-3xl flex-shrink-0">{emoji}</span>
            <div>
              <p className="font-bold text-gray-900 text-base">{label}</p>
              <p className="text-gray-400 text-sm">{sub}</p>
            </div>
            <svg className="ml-auto flex-shrink-0 text-gray-300" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepInterests({ selected, onToggle, onNext }) {
  const canContinue = selected.length > 0

  return (
    <div className="w-full max-w-sm flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">¿Qué te interesa explorar?</h2>
      <p className="text-gray-400 text-sm text-center mb-8">Selecciona uno o más temas</p>

      <div className="w-full grid grid-cols-2 gap-3 mb-8">
        {INTERESTS.map(({ id, emoji, label }) => {
          const active = selected.includes(id)
          return (
            <button
              key={id}
              onClick={() => onToggle(id)}
              className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95"
              style={{
                border: `2px solid ${active ? '#2A9D8F' : '#ebebeb'}`,
                background: active ? 'rgba(42,157,143,0.08)' : 'white',
                color: active ? '#2A9D8F' : '#374151',
                boxShadow: active ? '0 0 0 4px rgba(42,157,143,0.08)' : '0 2px 6px rgba(0,0,0,0.04)',
              }}
            >
              <span className="text-xl">{emoji}</span>
              {label}
            </button>
          )
        })}
      </div>

      <PrimaryButton onClick={onNext} disabled={!canContinue}>
        Continuar
      </PrimaryButton>
    </div>
  )
}

function StepBusiness({ selected, onToggle, tips, onNext }) {
  return (
    <div className="w-full max-w-sm flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">¿Qué tipo de negocio tienes?</h2>
      <p className="text-gray-400 text-sm text-center mb-6">Puedes elegir más de uno</p>

      <div className="w-full grid grid-cols-2 gap-3 mb-6">
        {BUSINESS_TYPES.map(({ id, emoji, label }) => {
          const active = selected.includes(id)
          return (
            <button
              key={id}
              onClick={() => onToggle(id)}
              className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95"
              style={{
                border: `2px solid ${active ? '#2A9D8F' : '#ebebeb'}`,
                background: active ? 'rgba(42,157,143,0.08)' : 'white',
                color: active ? '#2A9D8F' : '#374151',
                boxShadow: active ? '0 0 0 4px rgba(42,157,143,0.08)' : '0 2px 6px rgba(0,0,0,0.04)',
              }}
            >
              <span className="text-xl">{emoji}</span>
              {label}
            </button>
          )
        })}
      </div>

      {/* Dynamic tips */}
      <div className="w-full mb-6">
        <p className="text-xs font-bold text-[#2A9D8F] uppercase tracking-widest mb-2 px-1">
          💡 Tips para emprendedores en Durango
        </p>
        <div className="flex flex-col gap-2">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="px-4 py-3 rounded-xl text-sm text-gray-700 leading-relaxed"
              style={{ background: 'rgba(42,157,143,0.07)', border: '1px solid rgba(42,157,143,0.12)' }}
            >
              {tip}
            </div>
          ))}
        </div>
      </div>

      <PrimaryButton onClick={onNext}>Continuar</PrimaryButton>
    </div>
  )
}

function StepFinal({ isBusiness, interests, onComplete }) {
  const interestText = interests.length > 0
    ? interests.map(id => INTEREST_LABELS[id] || id).join(', ')
    : 'lugares de interés'

  return (
    <div className="w-full max-w-sm flex flex-col items-center text-center">
      {/* Animated icon */}
      <div className="relative flex items-center justify-center mb-8">
        <div
          className="absolute w-24 h-24 rounded-full animate-ping"
          style={{ background: 'rgba(42,157,143,0.15)', animationDuration: '1.8s' }}
        />
        <div
          className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(42,157,143,0.12)' }}
        >
          {isBusiness ? <StoreIcon /> : <MapPinIcon />}
        </div>
      </div>

      {isBusiness ? (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-snug">
            ¡Genial!
          </h2>
          <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xs">
            Cuando estés listo, usa <span className="font-semibold text-[#2A9D8F]">"Registra tu negocio"</span> en el menú principal
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-snug">
            ¡Listo!
          </h2>
          <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xs">
            Mostrándote{' '}
            <span className="font-semibold text-[#2A9D8F]">{interestText}</span>
            {' '}cerca de ti en Durango
          </p>
        </>
      )}

      <PrimaryButton onClick={onComplete}>
        {isBusiness ? 'Continuar →' : 'Continuar →'}
      </PrimaryButton>
    </div>
  )
}

function StepLogin({ loginState, user, onGoogle, onSkip }) {
  if (loginState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <SpinnerSVG />
        <p className="text-gray-500 text-sm">Conectando con Google...</p>
      </div>
    )
  }

  if (loginState === 'done') {
    return <WelcomeUserScreen user={user} />
  }

  return (
    <div className="w-full max-w-sm flex flex-col items-center text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: 'rgba(42,157,143,0.1)' }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2A9D8F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Quieres guardar tus favoritos?</h2>
      <p className="text-gray-400 text-sm mb-8 max-w-xs leading-relaxed">
        Inicia sesión para guardar lugares y personalizar tu experiencia en Durango
      </p>

      <button
        onClick={onGoogle}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-white font-bold text-gray-700 transition-all active:scale-95 hover:shadow-md mb-3"
        style={{ border: '2px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#2A9D8F' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb' }}
      >
        <GoogleIcon />
        Continuar con Google
      </button>

      <button
        onClick={onSkip}
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors py-2 px-4"
      >
        Continuar sin sesión →
      </button>
    </div>
  )
}

// ── Shared UI ─────────────────────────────────────────────

function WelcomeUserScreen({ user }) {
  const firstName = user?.name?.split(' ')[0] ?? 'bienvenido'
  return (
    <div className="relative flex flex-col items-center text-center gap-4">
      <Confetti />
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
        style={{ background: '#2A9D8F', boxShadow: '0 4px 20px rgba(42,157,143,0.4)' }}
      >
        {user?.initials ?? '?'}
      </div>
      <h2 className="text-2xl font-bold text-gray-900">¡Hola, {firstName}!</h2>
      <p className="text-gray-400 text-sm">Preparando tu experiencia personalizada...</p>
    </div>
  )
}

function Confetti() {
  const dots = [
    { color: '#2A9D8F', x: 10, delay: 0 },
    { color: '#E76F51', x: 28, delay: 0.1 },
    { color: '#F4A261', x: 48, delay: 0.2 },
    { color: '#457B9D', x: 66, delay: 0.05 },
    { color: '#9B59B6', x: 84, delay: 0.15 },
    { color: '#2A9D8F', x: 20, delay: 0.3 },
    { color: '#E76F51', x: 72, delay: 0.25 },
  ]
  return (
    <div
      className="absolute"
      style={{ top: -60, left: 0, right: 0, height: 80, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${d.x}%`,
            top: -8,
            width: 8,
            height: 8,
            borderRadius: 2,
            background: d.color,
            animation: `confettiFall 1s ${d.delay}s ease-in forwards`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
}

function SpinnerSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke="rgba(42,157,143,0.2)" strokeWidth="4" />
      <path d="M44 24C44 12.954 35.046 4 24 4" stroke="#2A9D8F" strokeWidth="4" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="0.8s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function PrimaryButton({ onClick, disabled = false, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 rounded-full font-bold text-lg text-white transition-all active:scale-95"
      style={{
        background: disabled ? '#b0d8d4' : '#2A9D8F',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '1.1rem',
        boxShadow: disabled ? 'none' : '0 4px 20px rgba(42,157,143,0.35)',
      }}
    >
      {children}
    </button>
  )
}

function MapPinIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2A9D8F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function StoreIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2A9D8F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
