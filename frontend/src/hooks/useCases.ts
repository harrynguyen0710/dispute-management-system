import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type {
  CaseResponseDto,
  CaseListResponseDto,
  CaseListPaginationDto,
  CaseOutcome,
  UpdateOutcomeResponseDto,
} from '../types/cases';

const API_BASE = import.meta.env.VITE_API_BASE;

export function useCases() {
  const [cases, setCases] = useState<CaseResponseDto[]>([]);
  const [pagination, setPagination] = useState<CaseListPaginationDto>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [deviceId, setDeviceId] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<CaseListResponseDto>(`${API_BASE}/cases`, {
        params: {
          page,
          pageSize,
          user_id: userId.trim() || undefined,
          user_email: userEmail.trim() || undefined,
          device_id: deviceId.trim() || undefined,
        },
      });

      setCases(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'An error occurred while fetching cases.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, userId, userEmail, deviceId]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const updateOutcome = useCallback(async (
    caseId: string,
    outcome: CaseOutcome,
    outcomeNote?: string,
    correctionReason?: string
  ): Promise<UpdateOutcomeResponseDto> => {
    setError(null);
    try {
      const response = await axios.patch<UpdateOutcomeResponseDto>(
        `${API_BASE}/cases/${caseId}/outcome`,
        {
          outcome,
          outcome_note: outcomeNote,
          correction_reason: correctionReason,
        }
      );

      await fetchCases();
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'An error occurred while updating outcome.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  }, [fetchCases]);

  return {
    cases,
    pagination,
    loading,
    error,
    userId,
    setUserId: (val: string) => {
      setUserId(val);
      setPage(1);
    },
    userEmail,
    setUserEmail: (val: string) => {
      setUserEmail(val);
      setPage(1);
    },
    deviceId,
    setDeviceId: (val: string) => {
      setDeviceId(val);
      setPage(1);
    },
    page,
    setPage,
    pageSize,
    setPageSize: (size: number) => {
      setPageSize(size);
      setPage(1); // Reset to page 1 on size change
    },
    updateOutcome,
    refresh: fetchCases,
  };
}
