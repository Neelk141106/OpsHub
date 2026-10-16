/**
 * OpsHub Role-Based Access Control (RBAC) & Authentication Service
 *
 * Defines enterprise user roles, site assignments, and authorization guards:
 * - ADMIN: System Admin / Workflow Configurator (Can create, edit, save, publish, rollback)
 * - OPERATIONS_LEAD: Site Manager (Can edit drafts, test simulation, view telemetry)
 * - OPERATOR: Floor Staff / Technician (Can view published SOPs, execute operational tickets)
 */

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  OPERATIONS_LEAD: 'OPERATIONS_LEAD',
  OPERATOR: 'OPERATOR',
}

export const DEMO_USERS = [
  {
    id: 'usr_admin_1',
    name: 'Alex Morgan',
    role: USER_ROLES.ADMIN,
    title: 'Enterprise Workflow Configurator & Admin',
    email: 'alex.morgan@opshub.corp',
    assignedSite: 'all',
    avatar: 'AM',
  },
  {
    id: 'usr_stores_lead',
    name: 'Elena Rostova',
    role: USER_ROLES.OPERATIONS_LEAD,
    title: 'Central Stores Inventory Lead',
    email: 'elena.rostova@opshub.corp',
    assignedSite: 'central-stores',
    avatar: 'ER',
  },
  {
    id: 'usr_service_tech',
    name: 'Marcus Vance',
    role: USER_ROLES.OPERATOR,
    title: 'Senior Avionics PCB Technician',
    email: 'marcus.vance@opshub.corp',
    assignedSite: 'service-centre',
    avatar: 'MV',
  },
  {
    id: 'usr_dist_spec',
    name: 'Priya Sharma',
    role: USER_ROLES.OPERATOR,
    title: 'Freight Logistics Specialist',
    email: 'priya.sharma@opshub.corp',
    assignedSite: 'distribution',
    avatar: 'PS',
  },
]

export const Permissions = {
  canEditWorkflow: (user) => {
    return user?.role === USER_ROLES.ADMIN
  },
  canPublishWorkflow: (user) => {
    return user?.role === USER_ROLES.ADMIN
  },
  canRollbackWorkflow: (user) => {
    return user?.role === USER_ROLES.ADMIN
  },
  canSimulate: (user) => {
    return user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.OPERATIONS_LEAD
  },
  canApproveOperations: (user) => {
    return user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.OPERATIONS_LEAD
  },
  canExecuteOperations: (user, siteId) => {
    if (!user) return false
    if (user.role === USER_ROLES.ADMIN) return true
    return user.assignedSite === 'all' || user.assignedSite === siteId
  },
}
