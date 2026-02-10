require('dotenv').config();
const express = require('express');
const bodyParser = require('express').json;
const { gcdArray, lcmArray, isPrime, fibonacciSeries } = require('./helpers/math');
const { askGemini } = require('./helpers/ai');

const app = express();
app.use(bodyParser({ limit: '1mb' }));

const PORT = process.env.PORT || 3000;
const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!OFFICIAL_EMAIL) {
  console.error('Missing OFFICIAL_EMAIL env var. Set OFFICIAL_EMAIL to your Chitkara email.');
}

function success(res, data) {
  return res.status(200).json({ is_success: true, official_email: OFFICIAL_EMAIL || '', data });
}

function error(res, status, message) {
  return res.status(status).json({ is_success: false, official_email: OFFICIAL_EMAIL || '', error: message });
}

const MAX_ARRAY_LEN = 1000;
const MAX_NUMBER_ABS = 1e9;

app.get('/health', (req, res) => {
  return res.status(200).json({ is_success: true, official_email: OFFICIAL_EMAIL || '' });
});

app.post('/bfhl', async (req, res) => {
  try {
    if (!OFFICIAL_EMAIL) return error(res, 500, 'Server misconfiguration: OFFICIAL_EMAIL not set');

    const body = req.body;
    if (!body || typeof body !== 'object') return error(res, 400, 'Invalid JSON body');

    const allowed = ['fibonacci', 'prime', 'lcm', 'hcf', 'AI'];
    const keys = Object.keys(body).filter((k) => body[k] !== undefined);
    if (keys.length !== 1) return error(res, 400, 'Request must contain exactly one of: fibonacci, prime, lcm, hcf, AI');

    const key = keys[0];
    if (!allowed.includes(key)) return error(res, 400, `Unknown key: ${key}`);

    if (key === 'fibonacci') {
      const n = body.fibonacci;
      if (!Number.isInteger(n)) return error(res, 400, 'fibonacci must be an integer');
      if (n < 0 || n > 1000) return error(res, 400, 'fibonacci must be between 0 and 1000');
      const data = fibonacciSeries(n);
      return success(res, data);
    }

    if (key === 'prime') {
      const arr = body.prime;
      if (!Array.isArray(arr)) return error(res, 400, 'prime must be an array of integers');
      if (arr.length === 0) return error(res, 400, 'prime array must not be empty');
      if (arr.length > MAX_ARRAY_LEN) return error(res, 400, 'prime array too large');
      const filtered = arr.filter((x) => Number.isInteger(x) && Math.abs(x) <= MAX_NUMBER_ABS);
      if (filtered.length !== arr.length) return error(res, 400, 'prime array must contain valid integers within bounds');
      const data = filtered.filter((x) => isPrime(x));
      return success(res, data);
    }

    if (key === 'lcm' || key === 'hcf') {
      const arr = body[key];
      if (!Array.isArray(arr)) return error(res, 400, `${key} must be an array of integers`);
      if (arr.length === 0) return error(res, 400, `${key} array must not be empty`);
      if (arr.length > MAX_ARRAY_LEN) return error(res, 400, `${key} array too large`);
      if (!arr.every((x) => Number.isInteger(x) && Math.abs(x) <= MAX_NUMBER_ABS)) return error(res, 400, `${key} array must contain valid integers within bounds`);
      if (key === 'hcf') {
        const data = gcdArray(arr);
        return success(res, data);
      } else {
        const data = lcmArray(arr);
        return success(res, data);
      }
    }

   if (key === 'AI') {
  const q = body.AI;

  if (!q || typeof q !== 'string') {
    return error(res, 400, 'AI must be a string question');
  }

  try {
    const aiAnswer = await askGemini(q);
    return success(res, aiAnswer);
  } catch (e) {
    console.error("AI failed, returning fallback");
    return success(res, "Unknown");
  }
}



    return error(res, 400, 'Unhandled request');
  } catch (err) {
    console.error('Internal error', err);
    return error(res, 500, 'Internal server error');
  }
});

app.get('/bfhl', (req, res) => {
  return res.status(405).json({
    is_success: false,
    official_email: OFFICIAL_EMAIL || '',
    error: 'Method Not Allowed: use POST /bfhl with a JSON body containing exactly one of {fibonacci, prime, lcm, hcf, AI}'
  });
});

app.use((req, res) => {
  res.status(404).json({ is_success: false, official_email: OFFICIAL_EMAIL || '', error: 'Not found' });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`BFHL API listening on port ${PORT}`));
}

module.exports = app;
