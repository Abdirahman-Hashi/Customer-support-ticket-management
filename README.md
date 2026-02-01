# Customer Support Tickets Management (Backend)

Backend service with AI-based automatic classification of tickets.

## Run
1. Copy `.env.example` to `.env` and set values.
2. Install deps: `npm install`
3. Start dev server: `npm run dev`

## Env
- `DB_URL` PostgreSQL connection string
- `OPENAI_API_KEY` OpenAI API key
- `PORT` server port (default 3000)

## Endpoints
- `POST /tickets`
- `GET /tickets/:id`
- `GET /tickets`
