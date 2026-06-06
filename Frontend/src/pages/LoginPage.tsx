import { useState, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/axios'

type Mode = 'login' | 'register'

export default function LoginPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (user) navigate('/', { replace: true })
    setTimeout(() => setMounted(true), 50)
  }, [user])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'register') {
        await api.post('/auth/register', {
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        })
        setMode('login')
        setError('')
        setName('')
        setPassword('')
        setConfirmPassword('')
      } else {
        await api.post('/auth/login', { email, password })
        navigate('/verify-otp', { state: { email } })
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})[0] ||
        'Something went wrong.'
      setError(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background gradient mesh */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(228,184,74,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 70% 20%, rgba(228,184,74,0.06) 0%, transparent 50%), #0a0a0f',
          }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(228,184,74,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(228,184,74,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <span className="font-display text-2xl text-gold-400 font-bold tracking-tight">
              Ecommerce
            </span>
          </div>
          <div>
            <p className="font-display text-5xl text-ash-100 font-bold leading-tight mb-6">
              Curated for the<br />
              <em className="text-gold-400 not-italic">discerning</em> buyer.
            </p>
            <p className="font-body text-ash-400 text-lg leading-relaxed max-w-sm">
              Premium products, seamlessly delivered. Your security is our priority — protected with multi-factor authentication.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-2">
              {['A', 'B', 'C', 'D'].map((l, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-ink-950 flex items-center justify-center text-xs font-mono font-bold"
                  style={{ background: `hsl(${200 + i * 30}, 30%, 35%)`, color: '#ededf4' }}
                >
                  {l}
                </div>
              ))}
            </div>
            <span className="font-body text-ash-400 text-sm">
              Trusted by thousands of customers
            </span>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div
          className={`w-full max-w-md transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <span className="font-display text-2xl text-gold-400 font-bold">Ecommerce</span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-ink-800 rounded-xl p-1 mb-8 border border-ink-700">
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-body font-medium transition-all duration-200 ${
                  mode === m
                    ? 'bg-gold-400 text-ink-950'
                    : 'text-ash-400 hover:text-ash-200'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <h1 className="font-display text-3xl text-ash-100 font-bold mb-1">
            {mode === 'login' ? 'Welcome back' : 'Join us'}
          </h1>
          <p className="font-body text-ash-400 text-sm mb-8">
            {mode === 'login'
              ? 'Sign in to access your account. An OTP will be sent to your email.'
              : 'Create your account. It only takes a moment.'}
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-red-950/50 border border-red-800/60 text-red-400 text-sm font-body flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block font-body text-xs text-ash-400 tracking-widest uppercase mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-ash-100 font-body placeholder-ink-600 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block font-body text-xs text-ash-400 tracking-widest uppercase mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-ash-100 font-body placeholder-ink-600 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 transition-all"
              />
            </div>

            <div>
              <label className="block font-body text-xs text-ash-400 tracking-widest uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-ash-100 font-body placeholder-ink-600 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 transition-all"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block font-body text-xs text-ash-400 tracking-widest uppercase mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-ash-100 font-body placeholder-ink-600 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 transition-all"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gold-400 hover:bg-gold-300 disabled:opacity-50 disabled:cursor-not-allowed text-ink-950 font-body font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-gold-400/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-ink-950 border-t-transparent rounded-full animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : mode === 'login' ? (
                'Send Verification Code →'
              ) : (
                'Create Account →'
              )}
            </button>
          </form>

          {mode === 'register' && (
            <p className="mt-6 text-center font-body text-ash-400 text-xs">
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-gold-400 hover:text-gold-300 underline underline-offset-2"
              >
                Sign in
              </button>
            </p>
          )}

          <p className="mt-8 text-center font-body text-ash-400 text-xs leading-relaxed">
            Protected by multi-factor authentication.
            <br />
            <span className="text-ink-600">Your data is always encrypted.</span>
          </p>
        </div>
      </div>
    </div>
  )
}