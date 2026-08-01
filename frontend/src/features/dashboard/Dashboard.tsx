import React, { useState } from 'react';
import { useCases } from '../../hooks/useCases';
import { CasesFilters } from '../../components/common/CasesFilters';
import { CasesTable } from '../../components/common/CasesTable';
import { Pagination } from '../../components/common/Pagination';
import { OutcomeModal } from '../../components/common/OutcomeModal';
import { TrendView } from '../../components/common/TrendView';
import type { CaseResponseDto } from '../../types/cases';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'explorer' | 'trends'>('explorer');

  const {
    cases,
    pagination,
    loading,
    error,
    userId,
    setUserId,
    userEmail,
    setUserEmail,
    deviceId,
    setDeviceId,
    page,
    setPage,
    pageSize,
    setPageSize,
    updateOutcome,
  } = useCases();

  const [selectedCase, setSelectedCase] = useState<CaseResponseDto | null>(null);

  const handleOpenModal = (record: CaseResponseDto) => {
    setSelectedCase(record);
  };

  const handleCloseModal = () => {
    setSelectedCase(null);
  };

  return (
    <div className="dashboard-container">
      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'explorer' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('explorer')}
        >
          Cases Explorer
        </button>
        <button
          className={`tab-btn ${activeTab === 'trends' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          Trend Analysis
        </button>
      </div>

      {activeTab === 'explorer' ? (
        <>
          {error && <div className="alert alert-error">{error}</div>}

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Cases</div>
              <div className="stat-value">{pagination.total}</div>
            </div>
          </section>

          <section className="control-panel">
            <CasesFilters
              userId={userId}
              onUserIdChange={setUserId}
              userEmail={userEmail}
              onUserEmailChange={setUserEmail}
              deviceId={deviceId}
              onDeviceIdChange={setDeviceId}
              loading={loading}
            />
          </section>

          <section className="table-card">
            {loading && <div className="loading-spinner-overlay">Loading cases...</div>}
            <CasesTable cases={cases} onAction={handleOpenModal} />
          </section>

          <section className="pagination-card">
            <Pagination
              page={page}
              pageSize={pageSize}
              total={pagination.total}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </section>
        </>
      ) : (
        <TrendView />
      )}

      {selectedCase && (
        <OutcomeModal
          caseRecord={selectedCase}
          onClose={handleCloseModal}
          onSubmit={updateOutcome}
        />
      )}
    </div>
  );
}
