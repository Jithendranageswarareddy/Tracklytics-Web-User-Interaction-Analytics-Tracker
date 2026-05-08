const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'tracklytics.db');
const db = new sqlite3.Database(dbPath);

const validEventTypes = ['page_view', 'button_click', 'form_submit'];

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function handleRun(err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(this);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(rows || []);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(row);
    });
  });
}

async function initializeDatabase() {
  await run('DROP TABLE IF EXISTS page_visits');
  await run('DROP TABLE IF EXISTS button_clicks');
  await run('DROP TABLE IF EXISTS form_submissions');

  await run(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      page_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function insertEvent(eventType, pageName) {
  const result = await run(
    'INSERT INTO analytics (event_type, page_name) VALUES (?, ?)',
    [eventType, pageName]
  );

  return result.lastID;
}

function getStats() {
  return get(`
    SELECT
      COUNT(*) AS totalEvents,
      COALESCE(SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END), 0) AS totalPageVisits,
      COALESCE(SUM(CASE WHEN event_type = 'button_click' THEN 1 ELSE 0 END), 0) AS totalButtonClicks,
      COALESCE(SUM(CASE WHEN event_type = 'form_submit' THEN 1 ELSE 0 END), 0) AS totalFormSubmissions
    FROM analytics
  `);
}

function getEvents() {
  return all(`
    SELECT id, event_type, page_name, created_at
    FROM analytics
    ORDER BY id DESC
  `);
}

module.exports = {
  db,
  validEventTypes,
  initializeDatabase,
  insertEvent,
  getStats,
  getEvents
};
