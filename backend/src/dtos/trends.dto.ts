export interface OutcomeCounts {
  won: number;
  lost: number;
  fraud_confirmed: number;
  total: number;
}

export interface CasesTrendsResponseDto {
  by_region: Record<string, OutcomeCounts>;
  by_month: Record<string, OutcomeCounts>;
}
