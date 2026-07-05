import { handleClaudeRequest } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const result = await handleClaudeRequest(body);
    res.status(200).json(result);
  } catch (e) {
    res.status(502).json({ error: String(e.message || e) });
  }
}
