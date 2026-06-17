# CareerSnap Automation Backend

Production-ready Express.js backend scaffold for **CareerSnap Automation**.

## Features

- Express server with `helmet`, `cors`, `morgan`, and `express.json()`
- Root + health endpoints
- Meta webhook verification + receiver
- Centralized error handling + 404 handler
- Timestamped reusable logger
- Clean, modular architecture (routes → controllers → services)

## Folder structure

```
backend/
├── src/
│   ├── config/
│   │   └── env.js
│   ├── routes/
│   │   └── webhook.routes.js
│   ├── controllers/
│   │   └── webhook.controller.js
│   ├── services/
│   │   └── instagram.service.js
│   ├── middleware/
│   │   ├── error.middleware.js
│   │   └── notFound.middleware.js
│   ├── utils/
│   │   └── logger.js
│   └── app.js
├── server.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Setup

1) Install dependencies:

```bash
cd backend
npm install
```

2) Create your `.env`:

```bash
copy .env.example .env
```

3) Run in development (nodemon):

```bash
npm run dev
```

Or run in production mode:

```bash
npm start
```

## Routes

### GET /

Returns:

```json
{
  "status": "running",
  "project": "CareerSnap Automation",
  "version": "1.0.0"
}
```

### GET /health

Returns:

```json
{
  "success": true
}
```

### GET /webhook (Meta verification)

Meta sends query params:

- `hub.mode`
- `hub.verify_token`
- `hub.challenge`

If `hub.verify_token` matches `VERIFY_TOKEN` from `.env`, the server returns `hub.challenge` (as plain text).
Otherwise returns **403**.

### POST /webhook

Logs the payload and returns:

```json
{
  "success": true,
  "message": "Webhook received"
}
```

## Extending the backend (future-ready)

This scaffold is designed so you can add later modules without refactoring:

- Instagram Comment → DM
- Instagram Auto Reply
- AI Chatbot
- Supabase Lead Storage
- n8n Integration
- Telegram Bot
- WhatsApp Automation
- Analytics Dashboard

Recommended pattern:

- Add new endpoints in `src/routes/`
- Keep business logic in `src/controllers/`
- Put external API and integrations in `src/services/`

