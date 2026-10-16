/**
 * OpsHub Central Stores Feature Entry Point (GENESIS 2.0 Track EVA 03 - PS03)
 * 
 * Public feature boundary exporting the self-contained CentralStoresDashboard,
 * isolated Zustand store, data models, formatters, and CSV tools for
 * straightforward integration into OpsHub's shared application shell and routing.
 * 
 * -----------------------------------------------------------------------------
 * INTEGRATION CONTRACT FOR OPSHUB APPLICATION SHELL:
 * -----------------------------------------------------------------------------
 * 1. Component Import & Route Registration:
 *    ```jsx
 *    import CentralStoresDashboard from '@/features/central-stores'
 *    // Mount inside React Router 7:
 *    <Route path="/central-stores" element={<CentralStoresDashboard />} />
 *    ```
 * 
 * 2. Supported Dashboard Props:
 *    - `theme`: (Optional) 'light' | 'dark' | 'auto'. Explicit mode passed from global theme.
 *    - `showThemeToggle`: (Optional, default: false) Set to true only in isolated preview harness.
 *    - `className`: (Optional) Additional outer container styling classes.
 * 
 * 3. Shared Design System Tokens:
 *    - Automatically inherits global `--opshub-*` CSS custom properties with resilient
 *      fallbacks to official GENESIS 2.0 PS03 specification hex codes:
 *      Primary: #6554C0, Deep Purple: #4F46A5, Secondary Blue: #3B82F6, Teal: #0D9488,
 *      Success: #16A34A, Warning: #D97706, Error: #DC2626.
 * 
 * 4. Cross-Site Requisition Gateway:
 *    - Service Centre and Distribution components can query and submit material requests
 *      directly via `useCentralStoresStore.getState().submitMaterialRequest({ ... })`.
 * -----------------------------------------------------------------------------
 */

export { CentralStoresDashboard, default } from './CentralStoresDashboard'
export { CentralStoresPreviewShell } from './CentralStoresPreviewShell'
export { CentralStoresAnalyticsView } from './components/CentralStoresAnalyticsView'
export { EditItemModal } from './components/EditItemModal'
export { useCentralStoresStore } from './store/useCentralStoresStore'
export {
  INITIAL_INVENTORY_ITEMS,
  INITIAL_MATERIAL_REQUESTS,
  INITIAL_STOCK_MOVEMENTS,
  INVENTORY_CATEGORIES,
  REQUESTING_SITES,
  MOVEMENT_TYPES,
} from './data/mockCentralStoresData'
export {
  formatCurrency,
  formatNumber,
  formatDateTime,
  getStockStatus,
  calculateValuation,
} from './utils/formatters'
export {
  exportInventoryToCsv,
  exportRequestsToCsv,
  exportMovementsToCsv,
  parseInventoryCsv,
  downloadCsvFile,
  getSampleInventoryCsv,
} from './utils/csvExport'
export { StockMovementsTable } from './components/StockMovementsTable'
export { ImportInventoryModal } from './components/ImportInventoryModal'

