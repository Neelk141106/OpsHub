import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DistributionDashboard from './features/distribution'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/distribution" replace />} />
        <Route path="/distribution" element={<DistributionDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
