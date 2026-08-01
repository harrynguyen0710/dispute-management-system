import React, { useState } from 'react';
import type { CaseResponseDto } from '../../types/cases';
import {
  formatDate,
  getStatusBadgeClass,
  getOutcomeBadgeClass,
  getOutcomeLabel,
} from '../../utils/cases';

interface CasesTableProps {
  cases: CaseResponseDto[];
  onAction: (record: CaseResponseDto) => void;
}

export function CasesTable({ cases, onAction }: CasesTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (caseId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [caseId]: !prev[caseId],
    }));
  };

  return (
    <div className="table-responsive">
      <table className="cases-table">
        <thead>
          <tr>
            <th className="toggle-col"></th>
            <th>Case ID</th>
            <th>User Email</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Outcome</th>
            <th className="action-col">Action</th>
          </tr>
        </thead>
        <tbody>
          {cases.length === 0 ? (
            <tr>
              <td colSpan={7} className="no-records">
                No cases found. Try adjusting your search query.
              </td>
            </tr>
          ) : (
            cases.map((c) => {
              const isExpanded = !!expandedRows[c.case_id];
              return (
                <React.Fragment key={c.case_id}>
                  <tr className={isExpanded ? 'row-expanded-header' : ''}>
                    <td className="toggle-col">
                      <button
                        type="button"
                        className="btn-toggle-expand"
                        onClick={() => toggleRow(c.case_id)}
                        title={isExpanded ? 'Hide details' : 'Show details'}
                      >
                        {isExpanded ? '▼' : '▶'}
                      </button>
                    </td>
                    <td>
                      <span className="case-id" title={c.case_id}>
                        {c.case_id.substring(0, 8)}...
                      </span>
                    </td>
                    <td>
                      <span className="user-email" title={`User: ${c.user_id}`}>
                        {c.user_email}
                      </span>
                    </td>
                    <td className="amount-col">
                      <strong>
                        {c.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </strong>{' '}
                      <span className="currency">{c.currency}</span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(c.status)}>
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={getOutcomeBadgeClass(c.outcome)}>
                        {getOutcomeLabel(c.outcome)}
                      </span>
                    </td>
                    <td className="action-col">
                      <button
                        className={`btn-action ${
                          c.status === 'resolved' ? 'btn-correct' : 'btn-resolve'
                        }`}
                        onClick={() => onAction(c)}
                      >
                        {c.status === 'resolved' ? 'Correct' : 'Resolve'}
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="details-row">
                      <td colSpan={7}>
                        <div className="details-expanded-card">
                          <div className="details-grid">
                            <div className="details-item">
                              <span className="details-label">Region</span>
                              <span className="details-val">{c.region}</span>
                            </div>
                            <div className="details-item">
                              <span className="details-label">Created At</span>
                              <span className="details-val">{formatDate(c.created_at)}</span>
                            </div>
                            {c.resolved_at && (
                              <div className="details-item">
                                <span className="details-label">Resolved At</span>
                                <span className="details-val">{formatDate(c.resolved_at)}</span>
                              </div>
                            )}
                          </div>
                          {(() => {
                            const corrections = c.audit_logs ? c.audit_logs.filter((log) => log.previous_outcome !== null) : [];
                            return (
                              <div className="details-notes-wrapper">
                                <div className="details-note-section">
                                  <span className="details-label">Outcome Note</span>
                                  <div className="details-note-content">
                                    {c.outcome_note ? c.outcome_note : <span className="no-note">No note provided.</span>}
                                  </div>
                                </div>
                                {corrections.length > 0 && (
                                  <div className="details-note-section correction-history-section">
                                    <span className="details-label">Correction History</span>
                                    <div className="details-history-list">
                                      {corrections.map((log) => (
                                        <div key={log.log_id} className="details-history-item">
                                          <span className="history-bullet">•</span>
                                          <span>
                                            <strong>[Corrected {log.changed_at.slice(0, 10)}]</strong>:{' '}
                                            {log.correction_reason} (Outcome: {getOutcomeLabel(log.previous_outcome)} &rarr; {getOutcomeLabel(log.new_outcome)})
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
