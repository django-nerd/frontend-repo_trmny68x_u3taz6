import { useState } from 'react'

const SIGNS = [
  'aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'
]

export default function SignPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)

  const handleSelect = (sign) => {
    onChange(sign)
    setOpen(false)
  }

  return (
    <div className="relative w-full max-w-sm">
      <button
        className="w-full bg-white/10 backdrop-blur border border-white/20 text-white rounded-xl px-4 py-3 flex items-center justify-between hover:bg-white/15 transition"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className="capitalize">{value || 'Choose your sign'}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={`transition ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="absolute z-20 mt-2 w-full bg-black/70 border border-white/10 rounded-xl overflow-hidden backdrop-blur shadow-xl max-h-64 overflow-y-auto">
          {SIGNS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSelect(s)}
              className={`w-full text-left px-4 py-2 capitalize text-white/90 hover:bg-white/10 ${value===s ? 'bg-white/5' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
