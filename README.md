This project implements two REST endpoints required by the assignment:

- POST /bfhl: accepts exactly one of the keys {fibonacci, prime, lcm, hcf, AI} and returns a structured response.
- GET /health: returns a minimal health JSON.


Environment variables (use a .env file or set in your environment):

- OFFICIAL_EMAIL - Your Chitkara email (required)
- GEMINI_API_KEY - Google Generative API key (required for AI requests when using Gemini)
- GEMINI_MODEL - Optional: model name to call (default: models/gemini-pro)
- PORT - port to listen on (default 3000)

Notes:
- This project currently uses Google Gemini (Generative Language API). If you prefer OpenAI, the AI helper must be adapted.
- Never commit real API keys. If you believe a key was leaked, revoke it immediately in your provider console and generate a new one.


The API is publicly accessible when deployed (Vercel, Railway, Render) — see platform instructions in assignment.