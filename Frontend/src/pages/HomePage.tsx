import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const FEATURED_PRODUCTS = [
  { id: 1, name: 'Leather Bifold Wallet', category: 'Accessories', price: 89, badge: 'Bestseller' },
  { id: 2, name: 'Merino Wool Sweater', category: 'Apparel', price: 145, badge: 'New' },
  { id: 3, name: 'Ceramic Pour-Over Set', category: 'Kitchen', price: 62, badge: null },
  { id: 4, name: 'Linen Throw Blanket', category: 'Home', price: 98, badge: 'New' },
  { id: 5, name: 'Brass Desk Lamp', category: 'Lighting', price: 210, badge: null },
  { id: 6, name: 'Handmade Candle Trio', category: 'Lifestyle', price: 44, badge: 'Limited' },
]

const CATEGORIES = ['All', 'Accessories', 'Apparel', 'Kitchen', 'Home', 'Lighting', 'Lifestyle']

export default function HomePage() {
  const { user } = useAuth()
  const [activeCategory, setActiveCategory] = useState('All')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 50)
  }, [])

  const filtered =
    activeCategory === 'All'
      ? FEATURED_PRODUCTS
      : FEATURED_PRODUCTS.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-ink-950">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 px-6 lg:px-12">
        {/* Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 60% 40%, rgba(228,184,74,0.07) 0%, transparent 65%), radial-gradient(ellipse 40% 60% at 10% 80%, rgba(228,184,74,0.04) 0%, transparent 50%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(228,184,74,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(228,184,74,0.4) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <div
            className={`transition-all duration-700 delay-100 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-ink-800 border border-ink-600 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-xs text-ash-400 tracking-wider uppercase">
                New Arrivals — Summer 2025
              </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div>
                <h1 className="font-display text-5xl lg:text-7xl text-ash-100 font-bold leading-tight mb-4">
                  Crafted with<br />
                  <em className="text-gold-400 not-italic">intention.</em>
                </h1>
                <p className="font-body text-ash-400 text-lg max-w-md leading-relaxed">
                  Thoughtfully selected products for everyday living. Each item chosen for quality, utility, and enduring design.
                </p>
              </div>

              <div className="flex gap-8 lg:gap-12 flex-shrink-0">
                {[
                  { num: '200+', label: 'Products' },
                  { num: '4.9', label: 'Avg Rating' },
                  { num: '12k+', label: 'Customers' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="font-display text-3xl text-gold-400 font-bold">{s.num}</div>
                    <div className="font-body text-xs text-ash-400 tracking-widest uppercase mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome bar */}
      <section className="px-6 lg:px-12 pb-8">
        <div className="max-w-6xl mx-auto">
          <div
            className={`bg-ink-800 border border-ink-700 rounded-2xl px-6 py-5 flex items-center justify-between transition-all duration-700 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gold-400/15 border border-gold-400/30 flex items-center justify-center">
                <span className="font-display font-bold text-gold-400">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-body text-ash-100 text-sm font-medium">
                  Welcome back, <span className="text-gold-400">{user?.name}</span>
                </p>
                <p className="font-body text-ash-400 text-xs">{user?.email}</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-green-950/40 border border-green-800/40 rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="font-mono text-xs text-green-400">Session Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="px-6 lg:px-12 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div
            className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 transition-all duration-700 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div>
              <h2 className="font-display text-2xl text-ash-100 font-bold">Featured Collection</h2>
              <p className="font-body text-ash-400 text-sm mt-1">
                {filtered.length} item{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Category filter */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-gold-400 text-ink-950'
                      : 'bg-ink-800 text-ash-400 hover:text-ash-200 border border-ink-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} mounted={mounted} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-800 px-6 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-gold-400 font-bold text-lg">Ecommerce</span>
          <p className="font-body text-ash-400 text-xs text-center">
            © {new Date().getFullYear()} Ecommerce. All rights reserved.
          </p>
          <div className="flex gap-4">
            {['Privacy', 'Terms', 'Support'].map((l) => (
              <a key={l} href="#" className="font-body text-ash-400 hover:text-gold-400 text-xs transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProductCard({
  product,
  index,
  mounted,
}: {
  product: (typeof FEATURED_PRODUCTS)[0]
  index: number
  mounted: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${300 + index * 60}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`bg-ink-800 border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
          hovered ? 'border-gold-400/50 shadow-lg shadow-gold-400/10 -translate-y-1' : 'border-ink-700'
        }`}
      >
        {/* Product image placeholder */}
        <div className="relative h-52 overflow-hidden bg-ink-900">
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, hsl(${200 + index * 20}, 20%, 12%), hsl(${220 + index * 20}, 15%, 18%))`,
            }}
          >
            <div className="w-20 h-20 rounded-full opacity-20 bg-gold-400" />
            <div className="absolute font-display text-6xl opacity-10 text-gold-400">
              {product.name.charAt(0)}
            </div>
          </div>

          {product.badge && (
            <div className="absolute top-3 left-3">
              <span
                className={`font-mono text-xs px-2 py-1 rounded-md font-medium ${
                  product.badge === 'New'
                    ? 'bg-green-900/80 text-green-400 border border-green-800/50'
                    : product.badge === 'Limited'
                    ? 'bg-red-900/80 text-red-400 border border-red-800/50'
                    : 'bg-gold-400/20 text-gold-400 border border-gold-400/30'
                }`}
              >
                {product.badge}
              </span>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="p-5">
          <p className="font-mono text-xs text-ash-400 tracking-widest uppercase mb-1">
            {product.category}
          </p>
          <h3 className="font-body text-ash-100 font-medium text-base mb-3">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="font-display text-gold-400 font-bold text-xl">${product.price}</span>
            <button
              className={`px-4 py-2 rounded-lg text-xs font-body font-semibold transition-all duration-200 ${
                hovered
                  ? 'bg-gold-400 text-ink-950'
                  : 'bg-ink-700 text-ash-300 border border-ink-600'
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}