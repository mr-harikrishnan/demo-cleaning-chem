import { ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react';
import React from 'react';
import { EmptyState } from './EmptyState';
import { TableSkeleton } from './Skeleton';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;
  page: number;
  limit: number;
  isInitialLoad?: boolean;
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  filterSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (item: T) => void;
  rowKey: (item: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  total,
  page,
  limit,
  isInitialLoad = false,
  isLoading = false,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  onPageChange,
  onLimitChange,
  filterSlot,
  actionsSlot,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search query or filter options.',
  onRowClick,
  rowKey
}: DataTableProps<T>) {
  // If initial load, display full skeleton according to DataTable policy
  if (isInitialLoad) {
    return (
      <div className="flex flex-col gap-4">
        {/* Placeholder toolbar */}
        <div className="h-11 w-full bg-[#F8FAFC] rounded-[10px] shimmer" />
        <TableSkeleton rows={limit > 10 ? 10 : limit} cols={columns.length} />
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit) || 1;
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          {onSearchChange && (
            <div className="relative flex-1 max-w-sm">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-11 pl-10 pr-3.5 bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] rounded-[10px] border border-[#E6EAF2] hover:border-[#CBD5E1] focus:border-[#1F6FEB] focus-ring transition-colors duration-150"
              />
              {isLoading && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1F6FEB]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
            </div>
          )}
          {filterSlot && <div className="flex items-center gap-2">{filterSlot}</div>}
        </div>

        {actionsSlot && <div className="flex items-center gap-2 shrink-0">{actionsSlot}</div>}
      </div>

      {/* Table Container */}
      <div className="relative w-full bg-white rounded-[16px] border border-[#E6EAF2] overflow-hidden shadow-cleantec-sm">
        {/* Subtle loading overlay bar for subsequent queries (keeps table mounted & input focused!) */}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#EEF4FF] overflow-hidden z-20">
            <div className="h-full bg-[#1F6FEB] animate-pulse w-full" />
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E6EAF2] sticky top-0 z-10">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    style={{ width: col.width }}
                    className={`py-3.5 px-6 text-xs font-bold uppercase tracking-[0.08em] text-[#94A3B8] select-none ${
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E6EAF2] text-sm text-[#0F172A]">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-8">
                    <EmptyState
                      title={emptyTitle}
                      description={emptyDescription}
                      className="border-0 shadow-none py-8"
                    />
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={rowKey(item)}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`h-14 transition-colors duration-150 ${
                      onRowClick ? 'cursor-pointer hover:bg-[#F7F9FC]' : 'hover:bg-[#F7F9FC]/60'
                    }`}
                  >
                    {columns.map((col) => (
                      <td
                        key={`${rowKey(item)}-${col.key}`}
                        className={`px-6 py-3.5 ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        }`}
                      >
                        {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        {total > 0 && (
          <div className="px-6 py-4 border-t border-[#E6EAF2] bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#475569]">
            <div className="flex items-center gap-4">
              <span>
                Showing <strong className="font-semibold text-[#0A1F5C]">{startItem}</strong> to{' '}
                <strong className="font-semibold text-[#0A1F5C]">{endItem}</strong> of{' '}
                <strong className="font-semibold text-[#0A1F5C]">{total}</strong> results
              </span>

              {onLimitChange && (
                <div className="flex items-center gap-2">
                  <span>Show</span>
                  <select
                    value={limit}
                    onChange={(e) => onLimitChange(Number(e.target.value))}
                    className="h-8 px-2 bg-white border border-[#E6EAF2] rounded-[6px] text-xs font-medium text-[#0A1F5C] focus-ring"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              )}
            </div>

            {onPageChange && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onPageChange(page - 1)}
                  disabled={page <= 1}
                  className="p-1.5 rounded-[6px] border border-[#E6EAF2] bg-white text-[#0A1F5C] hover:bg-[#EEF4FF] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-3 py-1 font-semibold text-[#0A1F5C]">
                  {page} / {totalPages}
                </span>

                <button
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-[6px] border border-[#E6EAF2] bg-white text-[#0A1F5C] hover:bg-[#EEF4FF] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
