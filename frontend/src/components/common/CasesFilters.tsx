import React, { useState, useEffect } from 'react';

interface CasesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  loading?: boolean;
}

export function CasesFilters({ search, onSearchChange, loading }: CasesFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);

  // Sync state if search prop changes
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const handleClear = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  return (
    <form className="filters-form" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <svg
          className="search-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search by User ID, Email, or Device ID..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="search-input"
        />
        {localSearch && (
          <button
            type="button"
            onClick={handleClear}
            className="clear-button"
            title="Clear search"
          >
            &#x2715;
          </button>
        )}
      </div>
      <button type="submit" className="search-submit-btn" disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}
