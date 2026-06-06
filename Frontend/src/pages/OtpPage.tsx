import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent, FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/axios'

export default function OtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const email: string = (location.state as any)?.email || ''

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMsg, setResendMsg] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [mounted, setMounted] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!email) navigate('/login', { replace: true })
    setTimeout(() => setMounted(true), 50)
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const next = [...digits]
    next[index] = value
    setDigits(next)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = [...digits]
    pasted.split('').forEach((d, i) => { if (i < 6) next[i] = d })
    setDigits(next)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault()
    const otp = digits.join('')
    if (otp.length !== 6) { setError('Please enter all 6 digits.'); return }

    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/verify-otp', { email, otp })
      login(res.data.access_token, res.data.user)
      navigate('/', { replace: true })
    } catch (err: any) {
      const remaining = err.response?.data?.attempts_remaining
      const msg = err.response?.data?.message || 'Invalid or expired OTP.'
      setError(remaining !== undefined ? `${msg} (${remaining} attempt${remaining !== 1 ? 's' : ''} left)` : msg)
      setDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    setResendLoading(true)
    setResendMsg('')
    setError('')
    try {
      await api.post('/auth/resend-otp', { email })
      setResendMsg('A new code has been sent.')
      setCanResend(false)
      setCountdown(60)
      setDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend. Try again.')
    } finally {
      setResendLoading(false)
    }
  }

  // auto-submit when all 6 digits filled
  useEffect(() => {
    if (digits.every((d) => d !== '')) handleSubmit()
  }, [digits])

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-6">
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(228,184,74,0.08) 0%, transparent 70%)',
        }}
      />

      <div
        className={`w-full max-w-md transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Back */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-ash-400 hover:text-ash-200 font-body text-sm mb-10 transition-colors"
        >
          ← Back to sign in
        </button>

        {/* Logo */}
        <div className="mb-10">
          <span className="font-display text-2xl text-gold-400 font-bold">Ecommerce</span>
        </div>

        {/* Lock icon */}
        <div className="w-14 h-14 rounded-2xl bg-ink-800 border border-ink-600 flex items-center justify-center mb-6">
          <svg className="w-7 h-7 text-gold-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        <h1 className="font-display text-3xl text-ash-100 font-bold mb-2">Verify your identity</h1>
        <p className="font-body text-ash-400 text-sm mb-1">
          We sent a 6-digit code to
        </p>
        <p className="font-mono text-gold-400 text-sm font-medium mb-8">{email}</p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-950/50 border border-red-800/60 text-red-400 text-sm font-body flex items-start gap-2">
            <span className="mt-0.5 flex-shrink-0">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {resendMsg && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-green-950/50 border border-green-800/60 text-green-400 text-sm font-body">
            ✓ {resendMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* OTP digit inputs */}
          <div className="flex gap-3 mb-8 justify-center">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className={`w-12 h-14 text-center text-xl font-mono font-bold rounded-xl border-2 transition-all duration-150 bg-ink-800 text-ash-100 focus:outline-none focus:scale-105 ${
                  d
                    ? 'border-gold-400 bg-ink-700 text-gold-400'
                    : 'border-ink-600 focus:border-gold-400'
                }`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || digits.join('').length !== 6}
            className="w-full bg-gold-400 hover:bg-gold-300 disabled:opacity-40 disabled:cursor-not-allowed text-ink-950 font-body font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-gold-400/20"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-ink-950 border-t-transparent rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & Sign In →'
            )}
          </button>
        </form>

        {/* Resend */}
        <div className="mt-6 text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="font-body text-sm text-gold-400 hover:text-gold-300 underline underline-offset-2 disabled:opacity-50"
            >
              {resendLoading ? 'Sending...' : 'Resend code'}
            </button>
          ) : (
            <p className="font-body text-ash-400 text-sm">
              Resend in{' '}
              <span className="font-mono text-gold-400 tabular-nums">
                0:{String(countdown).padStart(2, '0')}
              </span>
            </p>
          )}
        </div>

        <p className="mt-8 text-center font-body text-ink-600 text-xs">
          Code expires in 10 minutes · 5 attempts allowed
        </p>
      </div>
    </div>
  )
}