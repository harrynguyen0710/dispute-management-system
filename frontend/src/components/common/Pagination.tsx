import React from 'react';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

export function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  if (total === 0) return null;

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing <strong>{Math.min((page - 1) * pageSize + 1, total)}</strong> to{' '}
        <strong>{Math.min(page * pageSize, total)}</strong> of{' '}
        <strong>{total}</strong> results
      </div>

      <div className="pagination-controls">
        <div className="page-size-selector">
          <label htmlFor="page-size">Per page:</label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="select-input"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="btn-group">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="pagination-btn"
          >
            &larr; Prev
          </button>
          <span className="page-indicator">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="pagination-btn"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
