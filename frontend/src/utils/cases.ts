export const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

export const getStatusBadgeClass = (status: string) => {
  return status === 'resolved' ? 'badge status-resolved' : 'badge status-open';
};

export const getOutcomeBadgeClass = (outcome: string | null) => {
  switch (outcome) {
    case 'won':
      return 'badge outcome-won';
    case 'lost':
      return 'badge outcome-lost';
    case 'fraud_confirmed':
      return 'badge outcome-fraud';
    default:
      return 'badge outcome-none';
  }
};

export const getOutcomeLabel = (outcome: string | null) => {
  if (!outcome) return 'None';
  return outcome
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
