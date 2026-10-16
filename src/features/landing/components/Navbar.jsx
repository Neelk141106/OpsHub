import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Layers,
  Menu,
  Moon,
  Sun,
  X,
  ArrowRight,
} from 'lucide-react'
import { useLandingTheme } from '../context/useLandingTheme'

export default function Navbar() {
  const { isDark, toggleTheme } = useLandingTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Product', href: '#modules' },
    { name: 'Platform', href: '#overview' },
    { name: 'Capabilities', href: '#capabilities' },
    { name: 'Architecture', href: '#workflow' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Showcase', href: '#showcase' },
  ]

  const handleSmoothScroll = (e, href) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isDark
            ? 'bg-[#071B2B]/90 backdrop-blur-md border-b border-[#153D57] shadow-lg shadow-[#071B2B]/40'
            : 'bg-[#F4F8FB]/90 backdrop-blur-md border-b border-[#D9EAF5] shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* OpsHub Wordmark & Geometric Architectural Icon */}
          <a
            href="#"
            onClick={(e) => handleSmoothScroll(e, '#')}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div
              className={`relative flex items-center justify-center h-10 w-10 rounded-lg border transition-all duration-300 ${
                isDark
                  ? 'border-[#2997FF]/60 bg-[#0B263A] text-[#52D7FF] group-hover:border-[#52D7FF] shadow-[0_0_15px_rgba(41,151,255,0.25)]'
                  : 'border-[#2997FF] bg-white text-[#2997FF] group-hover:border-[#153D57] shadow-sm'
              }`}
            >
              {/* Isometric Cube / Schematic Mark */}
              <Layers className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#52D7FF] ring-2 ring-[#071B2B] animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-mono text-base font-bold tracking-tight transition-colors ${
                  isDark ? 'text-white' : 'text-[#102536]'
                }`}
              >
                OpsHub<span className="text-[#2997FF]">.io</span>
              </span>
              <span
                className={`text-[9px] font-mono tracking-wider uppercase transition-colors ${
                  isDark ? 'text-[#8CA8BC]' : 'text-slate-500'
                }`}
              >
                Blueprint Architecture
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium font-mono uppercase tracking-wider transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#2997FF] ${
                  isDark
                    ? 'text-[#8CA8BC] hover:text-[#52D7FF] hover:bg-[#0B263A]/70'
                    : 'text-slate-600 hover:text-[#2997FF] hover:bg-slate-100'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle blueprint color mode"
              className={`p-2 rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2997FF] ${
                isDark
                  ? 'border-[#153D57] bg-[#0B263A] text-[#8CA8BC] hover:text-[#52D7FF] hover:border-[#2997FF]/50'
                  : 'border-[#D9EAF5] bg-white text-slate-600 hover:text-[#2997FF] hover:border-[#2997FF]/50'
              }`}
              title={isDark ? 'Switch to Light Blueprint' : 'Switch to Dark Blueprint'}
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-300" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </button>

            {/* Sign In Link to /login */}
            <Link
              to="/login"
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#2997FF] ${
                isDark
                  ? 'border-[#153D57] text-[#8CA8BC] hover:text-white hover:border-[#52D7FF]/60 hover:bg-[#0B263A]'
                  : 'border-slate-200 text-slate-700 hover:text-[#102536] hover:border-[#2997FF] hover:bg-white'
              }`}
            >
              Sign In
            </Link>

            {/* Primary Get Started CTA -> /signup */}
            <Link
              to="/signup"
              className="relative inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-white bg-[#2997FF] hover:bg-[#1f84e3] rounded-lg shadow-[0_0_20px_rgba(41,151,255,0.35)] hover:shadow-[0_0_25px_rgba(82,215,255,0.5)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#52D7FF]"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`p-2 rounded-lg border transition-colors ${
                isDark
                  ? 'border-[#153D57] bg-[#0B263A] text-amber-300'
                  : 'border-[#D9EAF5] bg-white text-slate-700'
              }`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile navigation menu"
              className={`p-2 rounded-lg border transition-colors ${
                isDark
                  ? 'border-[#153D57] bg-[#0B263A] text-white'
                  : 'border-slate-200 bg-white text-slate-800'
              }`}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className={`sm:hidden border-b transition-colors px-4 pt-2 pb-6 space-y-3 ${
            isDark
              ? 'bg-[#071B2B] border-[#153D57] text-white'
              : 'bg-[#F4F8FB] border-[#D9EAF5] text-[#102536]'
          }`}
        >
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className={`px-3 py-2 rounded-md text-xs font-mono font-medium uppercase tracking-wider transition-colors ${
                  isDark
                    ? 'text-[#8CA8BC] hover:text-[#52D7FF] hover:bg-[#0B263A]'
                    : 'text-slate-600 hover:text-[#2997FF] hover:bg-slate-100'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-700/40 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full py-2 text-xs font-mono font-medium rounded-lg border text-center transition-colors ${
                isDark
                  ? 'border-[#153D57] text-[#8CA8BC] hover:text-white'
                  : 'border-slate-200 text-slate-700 hover:text-[#102536]'
              }`}
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider text-white bg-[#2997FF] hover:bg-[#1f84e3] rounded-lg shadow-md transition-all text-center"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
