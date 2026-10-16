import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Plus,
  RefreshCw,
  AlertCircle,
  Cpu,
  ArrowRight,
  Workflow,
} from 'lucide-react';
import { Button } from '../../components/Button.jsx';
import { StatCard } from '../../components/StatCard.jsx';
import { DataTable } from '../../components/DataTable.jsx';
import { INITIAL_TICKETS, WORK_BAYS } from './mockData.js';
import { StatusWorkflowModal } from './StatusWorkflowModal.jsx';
import { NewTicketModal } from './NewTicketModal.jsx';

/**
 * OpsHub Service Centre Repair Ticket Dashboard
 * 
 * Central orchestration view for equipment maintenance, intake triage,
 * technician assignment, and return-to-service validation workflows.
 */
export function ServiceCentreDashboard() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Filter tickets by quick status category
  const filteredTickets = useMemo(() => {
    switch (activeTab) {
      case 'CRITICAL':
        return tickets.filter(
          (t) => t.priority === 'Critical' || t.status === 'SLA Breach'
        );
      case 'IN_REPAIR':
        return tickets.filter((t) => t.status === 'In Repair');
      case 'QA_TESTING':
        return tickets.filter((t) => t.status === 'QA Testing');
      case 'ON_HOLD':
        return tickets.filter((t) => t.status === 'On Hold');
      case 'COMPLETED':
        return tickets.filter(
          (t) => t.status === 'Completed' || t.status === 'Approved'
        );
      default:
        return tickets;
    }
  }, [tickets, activeTab]);

  // Derived counts for KPI cards & tabs
  const criticalCount = tickets.filter(
    (t) => t.priority === 'Critical' || t.status === 'SLA Breach'
  ).length;
  const inRepairCount = tickets.filter((t) => t.status === 'In Repair').length;
  const onHoldCount = tickets.filter((t) => t.status === 'On Hold').length;
  const qaCount = tickets.filter((t) => t.status === 'QA Testing').length;
  const completedCount = tickets.filter(
    (t) => t.status === 'Completed' || t.status === 'Approved'
  ).length;

  const handleOpenWorkflow = (ticket) => {
    setSelectedTicket(ticket);
    setIsWorkflowModalOpen(true);
  };

  const handleSaveWorkflow = (updatedTicket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
    );
  };

  const handleCreateTicket = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleSimulateRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 900);
  };

  const handleToggleError = () => {
    setHasError((prev) => !prev);
  };

  // Priority badge styling helper
  const renderPriorityBadge = (priority) => {
    let style = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    if (priority === 'Critical') {
      style = 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 font-semibold';
    } else if (priority === 'High') {
      style = 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
    } else if (priority === 'Medium') {
      style = 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800';
    }

    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs select-none ${style}`}>
        {priority}
      </span>
    );
  };

  // Columns for the DataTable
  const tableColumns = [
    {
      key: 'id',
      header: 'Ticket ID',
      sortable: true,
      width: '120px',
      render: (val, row) => (
        <button
          type="button"
          onClick={() => handleOpenWorkflow(row)}
          className="font-mono font-semibold text-teal-600 dark:text-teal-400 hover:underline focus:outline-none"
        >
          {val}
        </button>
      ),
    },
    {
      key: 'device',
      header: 'Equipment & Device',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-white line-clamp-1">
            {val}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            S/N: {row.serialNumber} • {row.category}
          </div>
        </div>
      ),
    },
    {
      key: 'bay',
      header: 'Work Bay',
      sortable: true,
      render: (val) => (
        <span className="text-xs text-slate-700 dark:text-slate-300">
          {val}
        </span>
      ),
    },
    {
      key: 'technician',
      header: 'Technician',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold text-[10px] flex items-center justify-center border border-teal-200 dark:border-teal-800 shrink-0">
            {row.technicianAvatar}
          </div>
          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
            {val}
          </span>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (val) => renderPriorityBadge(val),
    },
    {
      key: 'status',
      header: 'Workflow Status',
      sortable: true,
      type: 'status',
    },
    {
      key: 'slaRemaining',
      header: 'SLA Window',
      sortable: true,
      render: (val, row) => {
        const isBreached = row.slaStatus === 'breached';
        return (
          <span
            className={`text-xs font-medium ${
              isBreached
                ? 'text-rose-600 dark:text-rose-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {val}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Service Centre Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              Service Centre
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-full">
              OpsHub Operational Hub #2
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Repair & Diagnostics Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Live equipment maintenance, triage queues, technician work bay allocations, and return-to-service validation pipeline.
          </p>
        </div>

        {/* Dashboard Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/builder?site=service-centre"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors shadow-2xs"
            title="Open and customize Service Centre workflow in Builder"
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Edit SOP in Builder</span>
          </Link>

          <Button
            size="sm"
            variant="outline"
            onClick={handleToggleError}
            title="Demonstrate error state handling"
            className={hasError ? 'border-rose-500 text-rose-600' : ''}
          >
            <AlertCircle className="w-3.5 h-3.5 mr-1 text-current" />
            {hasError ? 'Clear Error State' : 'Simulate Error'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            loading={isLoading}
            onClick={handleSimulateRefresh}
            title="Refresh active bay telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Refresh Telemetry
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsNewTicketModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white focus-visible:ring-teal-500 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Repair Ticket
          </Button>
        </div>
      </div>

      {/* Simulated Error State Banner */}
      {hasError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <h4 className="font-semibold text-rose-900 dark:text-rose-200">
              Telemetry Synchronization Alert
            </h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
              Unable to poll live Bay 3 telemetry from edge controller. Displaying cached operational snapshot.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSimulateRefresh}
            className="border-rose-300 text-rose-700 hover:bg-rose-100 dark:border-rose-700 dark:text-rose-200"
          >
            Retry Sync
          </Button>
        </div>
      )}

      {/* Summary KPI Cards Grid (Using StatCard primitive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Intake Queue"
          value={tickets.length}
          icon={Wrench}
          trend={{ direction: 'up', value: '+14% vs last week', label: 'intake volume' }}
          subtext="Total tracked repair units"
          loading={isLoading}
        />

        <StatCard
          title="Active in Diagnostics & Repair"
          value={inRepairCount}
          icon={Activity}
          trend={{ direction: 'neutral', value: '4 Bays active', label: '85% occupancy' }}
          subtext="Technicians on active shifts"
          loading={isLoading}
        />

        <StatCard
          title="Critical & SLA Breaches"
          value={criticalCount}
          icon={AlertTriangle}
          trend={{
            direction: 'down',
            value: '-1 today',
            label: 'escalations',
            sentiment: 'positive',
          }}
          subtext="1 ticket requires expediting"
          loading={isLoading}
        />

        <StatCard
          title="Return-to-Service Yield"
          value="94.2%"
          icon={CheckCircle2}
          trend={{ direction: 'up', value: '+2.8%', label: 'vs 90% SLA goal' }}
          subtext={`${completedCount} units certified this week`}
          loading={isLoading}
        />
      </div>

      {/* Work Bays Telemetry Strip */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Active Service Bays Telemetry
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Intake connected to Central Stores • Dispatches to Distribution
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {WORK_BAYS.map((bay) => (
            <div
              key={bay.id}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  {bay.name.split(' (')[0]}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {bay.name.includes('(') ? bay.name.split('(')[1].replace(')', '') : ''}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  {bay.occupied}/{bay.capacity}
                </span>
                <span
                  className={`block text-[10px] font-medium ${
                    bay.status === 'At Capacity'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-teal-600 dark:text-teal-400'
                  }`}
                >
                  {bay.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { key: 'ALL', label: 'All Tickets', count: tickets.length },
          { key: 'CRITICAL', label: 'Critical & SLA Risk', count: criticalCount },
          { key: 'IN_REPAIR', label: 'In Repair', count: inRepairCount },
          { key: 'QA_TESTING', label: 'QA Testing', count: qaCount },
          { key: 'ON_HOLD', label: 'Awaiting Parts', count: onHoldCount },
          { key: 'COMPLETED', label: 'Return to Service', count: completedCount },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors select-none ${
                isActive
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Repair Tickets DataTable */}
      <DataTable
        title="Repair Ticket Master Queue"
        description="Filter by ticket ID, equipment title, serial number, technician, or work bay"
        columns={tableColumns}
        data={filteredTickets}
        loading={isLoading}
        pageSize={6}
        emptyTitle={
          activeTab === 'ALL'
            ? 'No repair tickets recorded'
            : `No tickets found in ${activeTab.replace('_', ' ')}`
        }
        emptyMessage="Tickets logged through intake or triage will appear in this operational view."
        onRowClick={(row) => handleOpenWorkflow(row)}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenWorkflow(row);
              }}
              className="text-xs hover:border-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
            >
              Workflow
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        )}
      />

      {/* Service-Status Workflow Modal */}
      <StatusWorkflowModal
        ticket={selectedTicket}
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
        onSave={handleSaveWorkflow}
      />

      {/* New Ticket Modal */}
      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        onCreate={handleCreateTicket}
      />
    </div>
  );
}

export default ServiceCentreDashboard;
