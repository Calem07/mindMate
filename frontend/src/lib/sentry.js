const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN ?? '';

export function initSentry() {
  if (!SENTRY_DSN) {
    return;
  }
  // Hook point for @sentry/react when the dependency is enabled for production.
  window.__MINDMATE_SENTRY_READY__ = true;
}

export function captureFrontendException(error, context = {}) {
  if (!SENTRY_DSN || !error) {
    return;
  }
  console.warn('Sentry frontend hook captured error', {
    name: error.name,
    context,
  });
}
