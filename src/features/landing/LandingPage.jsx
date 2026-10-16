import { useEffect, useState } from 'react'
import LandingThemeProvider from './context/LandingThemeProvider'
import { useLandingTheme } from './context/useLandingTheme'
import BlueprintBackground from './components/BlueprintBackground'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import PlatformOverview from './components/PlatformOverview'
import ModulesSection from './components/ModulesSection'
import USPSection from './components/USPSection'
import WorkflowSection from './components/WorkflowSection'
import ProductShowcase from './components/ProductShowcase'
import PricingSection from './components/PricingSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import WorkspaceSelectionModal from './components/WorkspaceSelectionModal'

function LandingContent() {
  const { isDark } = useLandingTheme()
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false)

  useEffect(() => {
    // Set descriptive title for SEO and browser tab
    document.title = 'OpsHub — Architectural Blueprint for Industrial Operations'

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.content =
      'OpsHub connects inventory, service operations and distribution through intelligent workflows, operational visibility and data-driven decisions.'
  }, [])

  return (
    <div
      className={`min-h-screen relative font-sans antialiased selection:bg-[#2997FF] selection:text-white transition-colors duration-300 ${
        isDark ? 'text-[#D9EAF5]' : 'text-[#102536]'
      }`}
    >
      {/* 1. Dynamic Architectural Blueprint Grid Background */}
      <BlueprintBackground />

      {/* 2. Fixed Blueprint Navigation Header */}
      <Navbar onOpenWorkspaceModal={() => setIsWorkspaceModalOpen(true)} />

      {/* Main Content Sections */}
      <main className="relative z-10 flex flex-col">
        {/* 3. Hero Section — Main Visual Experience */}
        <HeroSection onOpenWorkspaceModal={() => setIsWorkspaceModalOpen(true)} />

        {/* 4. Platform Overview — The 3 Connected Sites & Panorama */}
        <PlatformOverview />

        {/* 5. Core Platform Modules (Central Stores, Service Centre, Distribution) */}
        <ModulesSection />

        {/* 6. Core OpsHub Capabilities (Builder, Time Machine, Diff, Pulse, Rollback) */}
        <USPSection />

        {/* 7. How OpsHub Works — 5-Step Process Topology */}
        <WorkflowSection />

        {/* 8. Authentic Product UI Showcase */}
        <ProductShowcase />

        {/* 9. Configurable Pricing Plans & 7-Day Free Trial */}
        <PricingSection />

        {/* 10. Closing Action CTA */}
        <CTASection onOpenWorkspaceModal={() => setIsWorkspaceModalOpen(true)} />
      </main>

      {/* 10. Engineering Blueprint Footer */}
      <Footer />

      {/* Workspace Selection Modal */}
      <WorkspaceSelectionModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
      />
    </div>
  )
}

export default function LandingPage() {
  return (
    <LandingThemeProvider>
      <LandingContent />
    </LandingThemeProvider>
  )
}
