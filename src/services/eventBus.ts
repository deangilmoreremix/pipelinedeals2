// Simple event bus for host integration and internal events
export function emitEvent(eventType: string, payload?: Record<string, unknown>) {
  const event = { type: eventType, payload };
  try {
    // If the host provided a global handler, call it
    const handler = (window as Record<string, unknown>).__SMARTCRM_ON_EVENT__ || (window as Record<string, unknown>).smartcrmOnEvent;
    if (typeof handler === 'function') {
      try {
        handler(event);
      } catch (err) {
        console.warn('[SmartCRM Remote] Host onEvent handler threw', err);
      }
    }

    // Also dispatch a DOM CustomEvent for any listeners
    try {
      const ce = new CustomEvent('smartcrm:remote:event', { detail: event });
      window.dispatchEvent(ce);
    } catch {
      // ignore
    }
  } catch (err) {
    console.error('[SmartCRM Remote] emitEvent failed', err);
  }
}
