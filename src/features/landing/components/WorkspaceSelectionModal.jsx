import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import WorkspaceSelectionView from './WorkspaceSelectionView'
import { useLandingTheme } from '../context/useLandingTheme'

export default function WorkspaceSelectionModal({ isOpen, onClose }) {
  const { isDark } = useLandingTheme()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Workspace Selection"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Card */}
      <div
        className={`relative z-10 w-full max-w-6xl my-8 rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-[#071B2B] border-[#153D57] text-[#D9EAF5]'
            : 'bg-[#F4F8FB] border-slate-200 text-[#102536]'
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close workspace selector"
          className="absolute top-5 right-5 z-20 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2997FF]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="p-4 sm:p-8 max-h-[85vh] overflow-y-auto">
          <WorkspaceSelectionView isDark={isDark} onSelect={onClose} />
        </div>
      </div>
    </div>
  )
}
