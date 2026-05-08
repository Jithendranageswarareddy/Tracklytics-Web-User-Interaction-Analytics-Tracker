// ============================================
// TRACKLYTICS DASHBOARD - FRONTEND LOGIC
// ============================================

/*
  DASHBOARD WORKFLOW (BEGINNER FRIENDLY):
  1. Page loads
  2. Fetch /stats and /events from backend
  3. Update cards and table in the DOM
  4. User can click Refresh to load latest analytics
*/

// Use same origin so it works when served by Express on localhost:3000
const STATS_API_URL = '/stats';
const EVENTS_API_URL = '/events';

// Track this dashboard page as a page view when opened
document.addEventListener('DOMContentLoaded', async function () {
  try {
    // Optional analytics tracking for dashboard page itself
    await trackPageView('dashboard');
  } catch (error) {
    // Tracking failure should not block dashboard rendering
    console.error('Could not track dashboard page view:', error.message);
  }

  // Set up refresh button click behavior
  const refreshBtn = document.getElementById('refreshBtn');
  refreshBtn.addEventListener('click', loadDashboardData);

  // Initial load of dashboard data
  await loadDashboardData();
});

/**
 * loadDashboardData()
 * Purpose: Fetch all data needed by the dashboard and render it.
 */
async function loadDashboardData() {
  try {
    // Fetch stats and events in parallel for better performance
    const [statsResponse, eventsResponse] = await Promise.all([
      fetch(STATS_API_URL),
      fetch(EVENTS_API_URL)
    ]);

    // Convert HTTP responses to JSON objects
    const statsJson = await statsResponse.json();
    const eventsJson = await eventsResponse.json();

    // Basic response checks
    if (!statsResponse.ok || !statsJson.success) {
      throw new Error('Failed to load /stats data');
    }

    if (!eventsResponse.ok || !eventsJson.success) {
      throw new Error('Failed to load /events data');
    }

    // Render the dashboard sections
    renderStatsCards(statsJson.data);
    renderRecentEventsTable(eventsJson.data);

    // Update timestamp text so user knows when data was refreshed
    const lastUpdatedText = document.getElementById('lastUpdatedText');
    lastUpdatedText.textContent = `Last updated: ${new Date().toLocaleString()}`;
  } catch (error) {
    console.error('Dashboard fetch error:', error.message);
    renderErrorState(error.message);
  }
}

/**
 * renderStatsCards(stats)
 * Purpose: Dynamically place API values into stat card elements.
 */
function renderStatsCards(stats) {
  // Dynamic DOM rendering: update existing elements with live values
  document.getElementById('totalPageVisits').textContent = stats.totalPageVisits;
  document.getElementById('totalButtonClicks').textContent = stats.totalButtonClicks;
  document.getElementById('totalFormSubmissions').textContent = stats.totalFormSubmissions;
}

/**
 * renderRecentEventsTable(events)
 * Purpose: Build table rows from API event data.
 */
function renderRecentEventsTable(events) {
  const tableBody = document.getElementById('eventsTableBody');

  // Keep table simple: only show latest 15 events
  const recentEvents = events.slice(0, 15);

  if (recentEvents.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-row">No analytics events found yet.</td>
      </tr>
    `;
    return;
  }

  // Build table rows dynamically from API data
  const rowsHtml = recentEvents
    .map((event) => {
      const eventLabel = formatEventType(event.event_type);
      const createdAt = formatTimestamp(event.created_at);

      return `
        <tr>
          <td>${event.id}</td>
          <td><span class="event-pill ${event.event_type}">${eventLabel}</span></td>
          <td>${escapeHtml(event.page_name || '-')}</td>
          <td>${createdAt}</td>
        </tr>
      `;
    })
    .join('');

  tableBody.innerHTML = rowsHtml;
}

/**
 * renderErrorState(message)
 * Purpose: Show a friendly error state if API fetch fails.
 */
function renderErrorState(message) {
  const tableBody = document.getElementById('eventsTableBody');
  tableBody.innerHTML = `
    <tr>
      <td colspan="4" class="error-row">Could not load analytics data: ${escapeHtml(message)}</td>
    </tr>
  `;
}

/**
 * formatEventType(type)
 * Purpose: Convert backend event type to human-readable text.
 */
function formatEventType(type) {
  if (type === 'page_view') return 'Page View';
  if (type === 'button_click') return 'Button Click';
  if (type === 'form_submit') return 'Form Submission';
  return 'Unknown Event';
}

/**
 * formatTimestamp(rawTimestamp)
 * Purpose: Convert DB timestamp to browser-friendly date/time format.
 */
function formatTimestamp(rawTimestamp) {
  if (!rawTimestamp) return '-';
  return new Date(rawTimestamp).toLocaleString();
}

/**
 * escapeHtml(value)
 * Purpose: Prevent unsafe HTML injection when rendering dynamic text.
 */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
