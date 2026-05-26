import { formatTimeInStage } from '../utils/timeInStage';

export function attachTimeInStage(deal: any) {
  // Ensure lastStageChangeAt is a Date if present in string form
  if (deal.lastStageChangeAt && typeof deal.lastStageChangeAt === 'string') {
    deal.lastStageChangeAt = new Date(deal.lastStageChangeAt);
  }

  const from = deal.lastStageChangeAt || deal.createdAt;
  return {
    ...deal,
    timeInStage: formatTimeInStage(from).label,
    timeInStageDays: formatTimeInStage(from).days
  };
}
