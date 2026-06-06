import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = ['Shop', 'Collections', 'New Arrivals', 'Sale']

const MENU_ITEMS = [
  { icon: '👤', label: 'My Account' },
  { icon: '📦', label: 'My Orders' },
  { icon: '❤️', label: 'Wishlist' },
  { icon: '⚙️', label: 'Settings' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)

    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [])

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setLoggingOut(false)
    }
  }

  const initials =
    user?.name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-12">
        
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tight text-amber-400">
            Ecommerce
          </span>

          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-slate-400 transition-colors hover:text-slate-100"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Cart */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 transition-all hover:border-amber-400/50">
            <svg
              className="h-4 w-4 text-slate-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>

            <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400">
              <span
                className="font-bold text-slate-950"
                style={{ fontSize: '9px' }}
              >
                0
              </span>
            </div>
          </button>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className={`flex items-center gap-2.5 rounded-xl border px-3 py-1.5 transition-all duration-200 ${
                open
                  ? 'border-amber-400/50 bg-slate-800'
                  : 'border-slate-700 bg-slate-800 hover:border-amber-400/30'
              }`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-400/15">
                <span className="text-xs font-bold text-amber-400">
                  {initials}
                </span>
              </div>

              <span className="hidden max-w-[120px] truncate text-sm text-slate-200 sm:block">
                {user?.name}
              </span>

              <svg
                className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                  open ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl">

                {/* User Info */}
                <div className="border-b border-slate-700 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/15">
                      <span className="font-bold text-amber-400">
                        {initials}
                      </span>
                    </div>

                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-medium text-slate-100">
                        {user?.name}
                      </p>

                      <p className="truncate text-xs text-slate-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />

                    <span className="text-xs text-green-400">
                      Authenticated • MFA Verified
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {MENU_ITEMS.map((item) => (
                    <button
                      key={item.label}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-700"
                    >
                      <span>{item.icon}</span>

                      <span className="text-sm text-slate-300">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Logout */}
                <div className="border-t border-slate-700 px-3 pb-3 pt-2">
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-xl border border-red-900/40 bg-red-950/40 px-4 py-2.5 transition-all hover:border-red-800/60 hover:bg-red-950/70 disabled:opacity-50"
                  >
                    {loggingOut ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                    ) : (
                      <svg
                        className="h-4 w-4 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                        />
                      </svg>
                    )}

                    <span className="text-sm font-medium text-red-400">
                      {loggingOut ? 'Signing out...' : 'Sign Out'}
                    </span>
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}