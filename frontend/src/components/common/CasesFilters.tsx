import React, { useState, useEffect } from 'react';

interface CasesFiltersProps {
  userId: string;
  onUserIdChange: (val: string) => void;
  userEmail: string;
  onUserEmailChange: (val: string) => void;
  deviceId: string;
  onDeviceIdChange: (val: string) => void;
  loading?: boolean;
}

export function CasesFilters({
  userId,
  onUserIdChange,
  userEmail,
  onUserEmailChange,
  deviceId,
  onDeviceIdChange,
  loading,
}: CasesFiltersProps) {
  const [localUserId, setLocalUserId] = useState(userId);
  const [localUserEmail, setLocalUserEmail] = useState(userEmail);
  const [localDeviceId, setLocalDeviceId] = useState(deviceId);

  useEffect(() => {
    setLocalUserId(userId);
  }, [userId]);

  useEffect(() => {
    setLocalUserEmail(userEmail);
  }, [userEmail]);

  useEffect(() => {
    setLocalDeviceId(deviceId);
  }, [deviceId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUserIdChange(localUserId);
    onUserEmailChange(localUserEmail);
    onDeviceIdChange(localDeviceId);
  };

  const handleReset = () => {
    setLocalUserId('');
    setLocalUserEmail('');
    setLocalDeviceId('');
    onUserIdChange('');
    onUserEmailChange('');
    onDeviceIdChange('');
  };

  const hasAnyFilter = localUserId || localUserEmail || localDeviceId;

  return (
    <form className="filters-form-grid" onSubmit={handleSubmit}>
      <div className="filter-field">
        <label htmlFor="filter-user-id">User ID</label>
        <input
          id="filter-user-id"
          type="text"
          placeholder="Filter by User ID..."
          value={localUserId}
          onChange={(e) => setLocalUserId(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-field">
        <label htmlFor="filter-user-email">Email Address</label>
        <input
          id="filter-user-email"
          type="text"
          placeholder="Filter by Email..."
          value={localUserEmail}
          onChange={(e) => setLocalUserEmail(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-field">
        <label htmlFor="filter-device-id">Device ID</label>
        <input
          id="filter-device-id"
          type="text"
          placeholder="Filter by Device ID..."
          value={localDeviceId}
          onChange={(e) => setLocalDeviceId(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-actions">
        <button type="submit" className="search-submit-btn" disabled={loading}>
          {loading ? 'Filtering...' : 'Apply Filters'}
        </button>
        {hasAnyFilter && (
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary reset-btn"
            disabled={loading}
          >
            Reset
          </button>
        )}
      </div>
    </form>
  );
}
