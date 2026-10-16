import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../index.css'
import CentralStoresPreviewShell from './CentralStoresPreviewShell'

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <CentralStoresPreviewShell />
    </StrictMode>,
  )
}
