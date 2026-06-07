import { places } from '../data/places'

const SYSTEM_PROMPT = `Eres Nautilus, el asistente local de MiCiudad, una app para descubrir Durango, México. Eres amigable, breve y útil.

Tienes acceso a estos lugares registrados en la app:
${JSON.stringify(places, null, 0)}

Reglas:
- Responde siempre en español
- Sé breve (máximo 3-4 oraciones por respuesta)
- Si te preguntan por un lugar, menciona su nombre, categoría y dirección
- Si no tienes información de algo, sugiere explorar el mapa o usar los filtros
- Si alguien saluda, responde con entusiasmo y pregunta en qué puedes ayudar
- No inventes lugares que no estén en tu lista
- Si preguntan quién eres, di que eres Nautilus, el asistente de MiCiudad`

export async function askGemini(userMessage, history = []) {
  // ── Gemini API (comentado mientras se usa Ollama) ────────
  // const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  // console.log('=== GEMINI DEBUG ===')
  // console.log('API Key exists:', !!apiKey)
  // console.log('API Key preview:', apiKey?.substring(0, 8) + '...')
  // const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`
  // console.log('Endpoint:', url)
  // const contents = [
  //   { role: 'user',  parts: [{ text: SYSTEM_PROMPT }] },
  //   { role: 'model', parts: [{ text: 'Entendido.' }] },
  //   ...history,
  //   { role: 'user',  parts: [{ text: userMessage }] },
  // ]
  // const res = await fetch(url, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ contents }),
  // })
  // console.log('Response status:', res.status)
  // const data = await res.json()
  // console.log('Response data:', JSON.stringify(data, null, 2))
  // if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`)
  // return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No obtuve respuesta. Intenta de nuevo.'

  // ── Ollama — llama3.2:3b ─────────────────────────────────
  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(h => ({
        role: h.role === 'model' ? 'assistant' : 'user',
        content: h.parts[0].text
      })),
      { role: 'user', content: userMessage }
    ]

    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        messages,
        stream: false
      })
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    return data.message?.content || 'No pude generar una respuesta.'

  } catch (error) {
    console.error('Ollama error:', error)
    return 'Lo siento, no pude conectarme. ¿Está corriendo Ollama?'
  }
}
