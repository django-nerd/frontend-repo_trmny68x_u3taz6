import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import SignPicker from './components/SignPicker'

function App() {
  const [sign, setSign] = useState('')
  const [loading, setLoading] = useState(false)
  const [reading, setReading] = useState(null)
  const [error, setError] = useState('')

  const backend = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])

  const fetchReading = async () => {
    if (!sign) { setError('Choose a sign first'); return }
    setError('')
    setLoading(true)
    try {
      // generate new reading and store
      const genRes = await fetch(`${backend}/api/horoscope/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sign })
      })
      if (!genRes.ok) throw new Error('Failed to generate')
      const gen = await genRes.json()

      // fetch latest readings for the sign
      const res = await fetch(`${backend}/api/horoscope?sign=${encodeURIComponent(sign)}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setReading({ ...gen.reading, id: gen.id, history: data.results })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#05030D] text-white relative overflow-hidden">
      {/* Hero with Spline */}
      <div className="absolute inset-0 pointer-events-auto">
        <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Gradient overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#05030D] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">NebulaScope</h1>
          <a href="/test" className="text-sm text-white/60 hover:text-white">System Test</a>
        </header>

        <section className="mt-16 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Your futuristic horoscope, rendered in real-time
            </h2>
            <p className="mt-4 text-white/70 max-w-prose">
              Dial into the cosmic signal. Choose your sign and generate a personalized reading infused with cyber‑aura vibes.
            </p>

            <div className="mt-8 space-y-4">
              <SignPicker value={sign} onChange={setSign} />
              <button
                onClick={fetchReading}
                disabled={loading}
                className="rounded-xl px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg shadow-fuchsia-600/30"
              >
                {loading ? 'Calibrating…' : 'Generate reading'}
              </button>
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            {!reading ? (
              <div className="text-white/70">
                <p className="font-medium">Awaiting selection…</p>
                <p className="text-sm mt-2">Pick your sign and generate a reading to see your cosmic brief.</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="uppercase tracking-widest text-xs text-white/50">{reading.scope_date}</p>
                    <h3 className="text-2xl font-bold capitalize">{reading.sign}</h3>
                  </div>
                  <div className="text-right text-sm text-white/70">
                    <p>Lucky No. <span className="font-semibold">{reading.lucky_number}</span></p>
                    <p>Lucky Color <span className="font-semibold">{reading.lucky_color}</span></p>
                  </div>
                </div>
                <p className="mt-4 text-lg font-semibold">{reading.headline}</p>
                <p className="mt-2 text-white/80 leading-relaxed">{reading.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {reading.keywords?.map((k) => (
                    <span key={k} className="px-3 py-1 rounded-full text-xs bg-fuchsia-500/20 border border-fuchsia-400/30">
                      {k}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-white/70">Compatibility: <span className="capitalize">{reading.compatibility}</span></p>

                {reading.history?.length ? (
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-wider text-white/50">Recent</p>
                    <ul className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-2">
                      {reading.history.map((h) => (
                        <li key={h.id} className="text-sm text-white/80 flex items-center justify-between">
                          <span className="capitalize">{h.sign}</span>
                          <span className="text-white/50">{h.scope_date}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </section>

        <footer className="mt-20 text-center text-white/50 text-xs">
          Built with cosmic care. ✦
        </footer>
      </div>
    </div>
  )
}

export default App
