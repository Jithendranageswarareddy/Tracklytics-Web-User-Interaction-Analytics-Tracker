# Quick Start

## Install

```bash
npm install
```

## Run

```bash
npm start
```

Open `http://localhost:3000`.

## Test The Flow

1. Visit the Home page.
2. Click a navigation link or dashboard button.
3. Open the Contact page and submit a valid form.
4. Open the Dashboard page.
5. Confirm the cards and recent events table update.

## API Checks

```bash
curl http://localhost:3000/stats
curl http://localhost:3000/events
```

Track an event:

```bash
curl -X POST http://localhost:3000/api/track \
  -H "Content-Type: application/json" \
  -d "{\"event_type\":\"page_view\",\"page_name\":\"home\"}"
```
