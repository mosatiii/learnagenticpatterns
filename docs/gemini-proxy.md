# Gemini Proxy

A standalone Node.js microservice that acts as a secure proxy between the main Next.js app and Google's Gemini AI API. It exists as a separate service to keep the AI API key isolated from the frontend.

```
gemini-proxy/
├── index.js       # HTTP server with /assess endpoint
└── package.json   # Dependencies (just the Gemini SDK)
```

---

## index.js

A plain Node.js HTTP server (no Express or other framework) that exposes a single endpoint.

### Endpoint: `POST /assess`

**Purpose:** Receives a system prompt and user message from the main app, forwards them to Google's Gemini AI, and returns the parsed result.

**Request:**
```json
{
  "systemPrompt": "You are an AI career assessment expert...",
  "userMessage": "Role: Developer. Answers: ..."
}
```

**Response:** The parsed JSON result from Gemini (score, strengths, vulnerabilities, action plan, elevator pitch).

### Security

- Protected by an `x-api-secret` header that must match the `API_SECRET` environment variable
- Requests without the correct secret get a `401 Unauthorized` response

### CORS

Handles cross-origin requests by responding to `OPTIONS` preflight requests and setting appropriate `Access-Control-Allow-*` headers. This is needed because the main app (on a different domain/port) makes requests to this service.

### Gemini Configuration

- **Model:** `gemini-2.5-pro-preview-05-06`
- **Response format:** JSON (configured via `responseMimeType: "application/json"`)
- **Temperature:** Uses the model's default

### Environment Variables

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key |
| `API_SECRET` | Shared secret for authenticating requests from the main app |
| `PORT` | Server port (defaults to 3001) |

---

## package.json

Minimal package manifest for the proxy service:

- **Type:** ESM module (`"type": "module"`)
- **Single dependency:** `@google/generative-ai` ^0.24.0 (the official Google Gemini SDK)
- **Start script:** `node index.js`

This service is designed to be deployed independently (e.g., on Railway) from the main Next.js application.
