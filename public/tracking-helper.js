const TRACKING_URL = '/api/track';

function sendBeaconEvent(eventType, pageName) {
  if (!navigator.sendBeacon) {
    return false;
  }

  const payload = JSON.stringify({
    event_type: eventType,
    page_name: pageName
  });

  const blob = new Blob([payload], { type: 'application/json' });
  return navigator.sendBeacon(TRACKING_URL, blob);
}

async function trackEvent(eventType, pageName, options = {}) {
  if (!eventType || !pageName) {
    return { success: false, error: 'eventType and pageName are required' };
  }

  if (options.beacon && sendBeaconEvent(eventType, pageName)) {
    return { success: true, sentWithBeacon: true };
  }

  try {
    const response = await fetch(TRACKING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventType,
        page_name: pageName
      }),
      keepalive: Boolean(options.keepalive)
    });

    return response.json();
  } catch (error) {
    console.error('Tracking failed:', error.message);
    return { success: false, error: error.message };
  }
}

function trackPageView(pageName) {
  return trackEvent('page_view', pageName);
}

function trackButtonClick(pageName, options) {
  return trackEvent('button_click', pageName, options);
}

function trackFormSubmission(pageName) {
  return trackEvent('form_submit', pageName);
}
