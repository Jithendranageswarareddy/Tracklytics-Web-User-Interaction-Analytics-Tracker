# Tracklytics

Tracklytics is a beginner-friendly web analytics project that tracks basic user interactions and displays them in a simple dashboard.

## Project Overview

The app records three event types:

- Page views
- Button/navigation clicks
- Contact form submissions

Events are sent from the frontend to an Express API and stored in a local SQLite database.

## Features

- Responsive landing page
- Contact page with form validation
- Analytics dashboard with summary cards
- Recent events table
- SQLite event storage
- Simple REST API

## Tech Stack

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- SQLite

## Folder Structure

```text
Tracklytics/
  db/
    database.js
  public/
    index.html
    contact.html
    dashboard.html
    landing.css
    contact.css
    dashboard.css
    tracking-helper.js
    landing.js
    contact.js
    dashboard.js
  package.json
  server.js
  README.md
  QUICK_START.md
```

## Installation Steps

```bash
npm install
```

## Run Locally

```bash
npm start
```

Open:

```text
http://localhost:3000
```

Useful pages:

- Home: `http://localhost:3000`
- Contact: `http://localhost:3000/contact.html`
- Dashboard: `http://localhost:3000/dashboard.html`

## Screenshots

Add screenshots here after running the project locally:

- Home page
- Contact page
- Analytics dashboard

## Project Workflow

1. A user visits a page or interacts with the UI.
2. Frontend JavaScript sends an event to `POST /api/track`.
3. Express validates the request.
4. SQLite stores the event in the `analytics` table.
5. The dashboard reads totals from `GET /stats` and event history from `GET /events`.

## Deployment Notes

This project is configured for Node.js `20.18.0` because SQLite uses native bindings that must match the Node runtime.

For Render:

- Build command: `npm install`
- Start command: `npm start`
- Environment variable: `NODE_VERSION=20.18.0`
- Confirm deploy logs show Node.js `20.18.0`, not Render's default Node version.

The frontend can be deployed as static files on Vercel, but the full backend with SQLite should not be treated as production-ready on Vercel. SQLite depends on a local database file, while serverless platforms use temporary file systems.

For a hosted version, use a persistent backend host or replace SQLite with a hosted database.

## Future Improvements

- Add charts to the dashboard
- Add date filters
- Track button names
- Export analytics as CSV
- Replace SQLite with a hosted database for production deployment

## Author

Built by Jithendra as a beginner full-stack portfolio project.
