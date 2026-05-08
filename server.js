const express = require('express');
const cors = require('cors');
const path = require('path');
const database = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/track', async (req, res) => {
  try {
    const eventType = String(req.body.event_type || '').trim();
    const pageName = String(req.body.page_name || '').trim();

    if (!database.validEventTypes.includes(eventType)) {
      return res.status(400).json({
        success: false,
        error: 'event_type must be page_view, button_click, or form_submit'
      });
    }

    if (!pageName) {
      return res.status(400).json({
        success: false,
        error: 'page_name is required'
      });
    }

    const id = await database.insertEvent(eventType, pageName);

    return res.status(201).json({
      success: true,
      id,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Track event error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to track event'
    });
  }
});

app.get('/stats', async (req, res) => {
  try {
    const stats = await database.getStats();

    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Stats error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to load stats'
    });
  }
});

app.get('/events', async (req, res) => {
  try {
    const events = await database.getEvents();

    return res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Events error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to load events'
    });
  }
});

async function startServer() {
  try {
    await database.initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Tracklytics running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
    process.exit(1);
  }
}

startServer();
