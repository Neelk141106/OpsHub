import React, { forwardRef, useState, useMemo } from 'react';
import {
  Search,
  X,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from 'lucide-react';
import { Button } from './Button.jsx';
import { StatusBadge } from './StatusBadge.jsx';

/**
 * OpsHub DataTable Component
 * 
 * Reusable enterprise data table with sorting, search filtering, pagination,
 * row actions, StatusBadge integration, loading, and empty states.
 * 
 * Props:
 * @param {Array<Object>} columns - Column definitions [{ key, header, sortable, align, width, render, type, className }]
 * @param {Array<Object>} data - Array of row records
 * @param {string} [props.keyField='id'] - Field name uniquely identifying each row
 * @param {string} [props.title] - Optional table title displayed in header bar
 * @param {string} [props.description] - Optional subtext description
 * @param {React.ReactNode} [props.headerActions] - Action elements (e.g. Buttons) placed top-right
 * @param {boolean} [props.searchable=true] - Enable client-side search filter
 * @param {string} [props.searchPlaceholder='Search records...'] - Search input placeholder
 * @param {string} [props.searchValue] - Controlled search query
 * @param {Function} [props.onSearchChange] - Search change callback
 * @param {Array<string>} [props.searchKeys] - Restrict search matching to specific column keys
 * @param {boolean} [props.pagination=true] - Enable pagination controls
 * @param {number} [props.pageSize=10] - Number of rows per page
 * @param {boolean} [props.loading=false] - Display animated skeleton rows
 * @param {string} [props.emptyTitle] - Custom title for empty state
 * @param {string} [props.emptyMessage] - Custom message for empty state
 * @param {Function} [props.actions] - Row action renderer (row, index) => ReactNode
 * @param {string} [props.actionsHeader='Actions'] - Header text for row actions column
 * @param {Function} [props.onRowClick] - Click handler for rows (row, index) => void
 * @param {string} [props.className=''] - Additional CSS classes for outer card
 */

export const DataTable = forwardRef(function DataTable(
  {
    columns = [],
    data = [],
    keyField = 'id',
    title,
    description,
    headerActions,
    searchable = true,
    searchPlaceholder = 'Search records...',
    searchValue,
    onSearchChange,
    searchKeys,
    pagination = true,
    pageSize: defaultPageSize = 10,
    loading = false,
    emptyTitle,
    emptyMessage,
    actions,
    actionsHeader = 'Actions',
    onRowClick,
    className = '',
    ...props
  },
  ref
) {
  // Search state (supports controlled or uncontrolled)
  const [internalSearch, setInternalSearch] = useState('');
  const query = searchValue !== undefined ? searchValue : internalSearch;

  const handleSearchChange = (val) => {
    if (searchValue === undefined) {
      setInternalSearch(val);
    }
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (columnKey) => {
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        if (prev.direction === 'asc') return { key: columnKey, direction: 'desc' };
        return { key: null, direction: 'asc' }; // Reset to neutral
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = Math.max(1, defaultPageSize);

  // Filter rows based on search query
  const filteredData = useMemo(() => {
    if (!query.trim()) return data;
    const lowerQuery = query.toLowerCase().trim();

    return data.filter((row) => {
      if (searchKeys && searchKeys.length > 0) {
        return searchKeys.some((k) =>
          String(row[k] ?? '')
            .toLowerCase()
            .includes(lowerQuery)
        );
      }
      return columns.some((col) => {
        const val = row[col.key];
        return String(val ?? '')
          .toLowerCase()
          .includes(lowerQuery);
      });
    });
  }, [data, query, searchKeys, columns]);

  // Sort rows based on sortConfig
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate rows
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const activePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const startIndex = (activePage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, pagination, activePage, pageSize]);

  // Reset pagination on search change
  const onSearchInput = (e) => {
    handleSearchChange(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    handleSearchChange('');
    setCurrentPage(1);
  };

  // Render cell content
  const renderCellContent = (col, row, rowIndex) => {
    const val = row[col.key];
    if (col.render) {
      return col.render(val, row, rowIndex);
    }
    if (col.type === 'status') {
      return <StatusBadge status={String(val ?? '')} size="sm" />;
    }
    return val != null ? String(val) : '—';
  };

  const hasHeader = title || description || headerActions || searchable;

  return (
    <div
      ref={ref}
      className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden font-sans ${className}`.trim()}
      {...props}
    >
      {/* Table Header Bar */}
      {hasHeader && (
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {(title || description) && (
            <div>
              {title && (
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {description}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {searchable && (
              <div className="relative flex-1 sm:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={query}
                  onChange={onSearchInput}
                  placeholder={searchPlaceholder}
                  className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                />
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
            {headerActions && <div>{headerActions}</div>}
          </div>
        </div>
      )}

      {/* Table Body & Scroll Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
              {columns.map((col) => {
                const isSorted = sortConfig.key === col.key;
                const alignClass =
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left';

                return (
                  <th
                    key={col.key}
                    style={col.width ? { width: col.width } : undefined}
                    className={`px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none ${alignClass} ${
                      col.headerClassName || ''
                    }`.trim()}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className={`inline-flex items-center gap-1.5 group focus:outline-none ${
                          isSorted
                            ? 'text-purple-600 dark:text-purple-400 font-bold'
                            : 'hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <span>{col.header}</span>
                        <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200">
                          {isSorted ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                          )}
                        </span>
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
              {actions && (
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                  {actionsHeader}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
            {/* Loading Skeleton */}
            {loading &&
              Array.from({ length: pageSize || 5 }).map((_, rIdx) => (
                <tr key={`skeleton-${rIdx}`} className="animate-pulse">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-3.5 whitespace-nowrap">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12 ml-auto" />
                    </td>
                  )}
                </tr>
              ))}

            {/* Empty State */}
            {!loading && paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center">
                    <div className="p-3 mb-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                      <Inbox className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                      {query
                        ? 'No matching records found'
                        : emptyTitle || 'No records available'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      {query
                        ? `We couldn't find any results matching "${query}". Try adjusting your keywords.`
                        : emptyMessage ||
                          'There are currently no items to display in this table.'}
                    </p>
                    {query && (
                      <Button size="sm" variant="outline" onClick={clearSearch}>
                        Clear search filter
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {/* Render Rows */}
            {!loading &&
              paginatedData.map((row, rowIdx) => {
                const rowKey = row[keyField] ?? `row-${rowIdx}`;
                const rowClickable = Boolean(onRowClick);

                return (
                  <tr
                    key={rowKey}
                    onClick={
                      rowClickable ? () => onRowClick(row, rowIdx) : undefined
                    }
                    className={`transition-colors duration-100 ${
                      rowClickable
                        ? 'cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                        : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    {columns.map((col) => {
                      const alignClass =
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left';

                      return (
                        <td
                          key={col.key}
                          className={`px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-slate-700 dark:text-slate-300 ${alignClass} ${
                            col.className || ''
                          }`.trim()}
                        >
                          {renderCellContent(col, row, rowIdx)}
                        </td>
                      );
                    })}
                    {actions && (
                      <td className="px-4 py-3 whitespace-nowrap text-right text-xs sm:text-sm">
                        {actions(row, rowIdx)}
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && !loading && totalItems > 0 && (
        <div className="p-3 sm:px-5 sm:py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing{' '}
            <span className="font-medium text-slate-900 dark:text-white">
              {(activePage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium text-slate-900 dark:text-white">
              {Math.min(activePage * pageSize, totalItems)}
            </span>{' '}
            of{' '}
            <span className="font-medium text-slate-900 dark:text-white">
              {totalItems}
            </span>{' '}
            results
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={activePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
              className="px-2.5 py-1 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Previous
            </Button>
            <span className="px-2 py-1 font-medium text-slate-700 dark:text-slate-300">
              {activePage} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={activePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
              className="px-2.5 py-1 text-xs"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;
