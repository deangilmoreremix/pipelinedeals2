// Simple event bus for host integration and internal events
export function emitEvent(eventType: string, payload?: any) {
  const event = { type: eventType, payload };
  try {
    // Console diagnostics
    // eslint-disable-next-line no-console
    console.log('[SmartCRM Remote] emitEvent', event);

    // If the host provided a global handler, call it
    const handler = (window as any).__SMARTCRM_ON_EVENT__ || (window as any).smartcrmOnEvent;
    if (typeof handler === 'function') {
      try {
        handler(event);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[SmartCRM Remote] Host onEvent handler threw', err);
      }
    }

    // Also dispatch a DOM CustomEvent for any listeners
    try {
      const ce = new CustomEvent('smartcrm:remote:event', { detail: event });
      window.dispatchEvent(ce);
    } catch (err) {
      // ignore
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[SmartCRM Remote] emitEvent failed', err);
  }
}
