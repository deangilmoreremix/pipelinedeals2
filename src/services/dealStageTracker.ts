export function recordStageChange(dealId: string, fromStage: string, toStage: string) {
  const timestamp = new Date();
  const key = `deal:${dealId}:lastStageChange`;
  try {
    localStorage.setItem(key, timestamp.toISOString());
  } catch (err) {
    // ignore localStorage failures
  }

  // Console diagnostics
  // eslint-disable-next-line no-console
  console.log('[SmartCRM Remote] Stage change recorded', { dealId, fromStage, toStage, timestamp });

  return timestamp;
}
