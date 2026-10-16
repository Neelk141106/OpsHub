import { useState, useMemo } from 'react'
import DistributionHeader from './components/DistributionHeader'
import DistributionSummaryCards from './components/DistributionSummaryCards'
import DistributionInsights from './components/DistributionInsights'
import AssignmentFilters from './components/AssignmentFilters'
import AssignmentTable from './components/AssignmentTable'
import NewAssignmentModal from './components/NewAssignmentModal'
import AssignmentDetailsModal from './components/AssignmentDetailsModal'
import { INITIAL_ASSIGNMENTS } from './data/distributionMockData'
import ThemeProvider from './context/ThemeProvider'
import { useTheme } from './context/useTheme'

function getCurrentTimeString() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function DistributionDashboardContent() {
  const { isDark } = useTheme()
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(getCurrentTimeString)
  const [toastMessage, setToastMessage] = useState(null)

  // Filtered Assignments
  const filteredAssignments = useMemo(() => {
    const query = searchTerm.toLowerCase().trim()
    return assignments.filter((item) => {
      // Status Match
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter

      // Query Match (ID, material, source, destination)
      const matchesQuery =
        !query ||
        item.id.toLowerCase().includes(query) ||
        item.material.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query) ||
        item.destination.toLowerCase().includes(query)

      return matchesStatus && matchesQuery
    })
  }, [assignments, searchTerm, statusFilter])

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('')
    setStatusFilter('All')
  }

  // Refresh feed
  const handleRefresh = () => {
    setLastUpdated(getCurrentTimeString())
    showToast('Distribution telemetry and movement records refreshed.')
  }

  // Add Assignment
  const handleAddAssignment = (newAssignment) => {
    setAssignments((prev) => [newAssignment, ...prev])
    showToast(`Assignment ${newAssignment.id} created successfully.`)
  }

  // Toast Helper
  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current))
    }, 3500)
  }

  return (
    <div
      className={`min-h-screen antialiased transition-colors duration-200 ${
        isDark ? 'bg-[#151725] text-[#F2F3FA]' : 'bg-[#F5F7FC] text-[#17213A]'
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-medium shadow-xl animate-bounce-subtle ${
            isDark
              ? 'border-[#2E334D] bg-[#222538] text-[#F2F3FA]'
              : 'border-slate-200 bg-slate-900 text-white'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Dashboard Layout Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* A. Page Heading */}
        <DistributionHeader
          onNewAssignment={() => setIsNewModalOpen(true)}
          onRefresh={handleRefresh}
          lastUpdated={lastUpdated}
        />

        {/* B. Summary Cards */}
        <DistributionSummaryCards assignments={assignments} />

        {/* E. Consumption and Movement Insights */}
        <DistributionInsights assignments={assignments} />

        {/* D. Search and Filters */}
        <div className="space-y-4">
          <AssignmentFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onResetFilters={handleResetFilters}
            totalCount={assignments.length}
            filteredCount={filteredAssignments.length}
          />

          {/* C. Assignment and Shipment Table */}
          <AssignmentTable
            assignments={filteredAssignments}
            onViewDetails={(record) => setSelectedAssignment(record)}
            onResetFilters={handleResetFilters}
            isFiltered={searchTerm.trim().length > 0 || statusFilter !== 'All'}
          />
        </div>
      </main>

      {/* F. New Assignment Modal */}
      <NewAssignmentModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onAddAssignment={handleAddAssignment}
      />

      {/* G. Assignment Details Modal */}
      <AssignmentDetailsModal
        assignment={selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
      />
    </div>
  )
}

export default function DistributionDashboard() {
  return (
    <ThemeProvider>
      <DistributionDashboardContent />
    </ThemeProvider>
  )
}
