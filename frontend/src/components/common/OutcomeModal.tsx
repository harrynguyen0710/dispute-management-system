import React, { useState, useEffect } from 'react';
import type { CaseResponseDto, CaseOutcome } from '../../types/cases';

interface OutcomeModalProps {
  caseRecord: CaseResponseDto | null;
  onClose: () => void;
  onSubmit: (
    caseId: string,
    outcome: CaseOutcome,
    outcomeNote: string,
    correctionReason?: string
  ) => Promise<any>;
}

export function OutcomeModal({ caseRecord, onClose, onSubmit }: OutcomeModalProps) {
  const [outcome, setOutcome] = useState<CaseOutcome>('won');
  const [outcomeNote, setOutcomeNote] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (caseRecord) {
      setOutcome(caseRecord.outcome || 'won');
      setOutcomeNote(caseRecord.outcome_note || '');
      setCorrectionReason('');
      setValidationError(null);
    }
  }, [caseRecord]);

  if (!caseRecord) return null;

  const isCorrection = caseRecord.status === 'resolved';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!outcome) {
      setValidationError('Outcome is required.');
      return;
    }

    if (isCorrection && !correctionReason.trim()) {
      setValidationError('Correction reason is required when correcting a resolved outcome.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(
        caseRecord.case_id,
        outcome,
        outcomeNote.trim(),
        isCorrection ? correctionReason.trim() : undefined
      );
      onClose();
    } catch (err: any) {
      setValidationError(err.message || 'Failed to update case outcome.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {isCorrection ? 'Correct Case Outcome' : 'Resolve Case Outcome'}
          </h2>
          <button className="close-x" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {validationError && (
              <div className="alert alert-error">
                {validationError}
              </div>
            )}

            <div className="case-brief">
              <div>
                <strong>Case ID:</strong> {caseRecord.case_id}
              </div>
              <div>
                <strong>User Email:</strong> {caseRecord.user_email}
              </div>
              <div>
                <strong>Amount:</strong> {caseRecord.amount} {caseRecord.currency}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="modal-outcome">Outcome</label>
              <select
                id="modal-outcome"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as CaseOutcome)}
                className="select-input"
              >
                <option value="won">Won</option>
                <option value="lost">Lost</option>
                <option value="fraud_confirmed">Fraud Confirmed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="modal-note">Note (Optional)</label>
              <textarea
                id="modal-note"
                rows={3}
                placeholder="Details about the outcome decision..."
                value={outcomeNote}
                onChange={(e) => setOutcomeNote(e.target.value)}
                className="textarea-input"
              />
            </div>

            {isCorrection && (
              <div className="form-group">
                <label htmlFor="modal-correction-reason">
                  Correction Reason <span className="required-star">*</span>
                </label>
                <textarea
                  id="modal-correction-reason"
                  rows={2}
                  placeholder="Explain why this outcome is being corrected..."
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  className="textarea-input"
                  required
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
