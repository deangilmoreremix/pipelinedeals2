export function formatTimeInStage(from?: Date) {
  if (!from) return { label: 'Unknown', days: null };
  const now = new Date();
  const diffMs = now.getTime() - new Date(from).getTime();
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days === 0) return { label: 'Today', days };
  if (days === 1) return { label: '1 day', days };
  return { label: `${days} days`, days };
}
