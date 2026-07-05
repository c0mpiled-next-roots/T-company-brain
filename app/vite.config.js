import { defineConfig, loadEnv } from 'vite';
import { handleClaudeRequest } from './api/_lib.js';

// ローカル開発でも /api/claude を動かすためのミドルウェア。
// 本番は Vercel Functions (api/claude.js) が同じ _lib.js を使う。
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;

  return {
    plugins: [
      {
        name: 'dev-api-claude',
        configureServer(server) {
          server.middlewares.use('/api/claude', (req, res) => {
            let body = '';
            req.on('data', (c) => (body += c));
            req.on('end', async () => {
              try {
                const result = await handleClaudeRequest(JSON.parse(body || '{}'));
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result));
              } catch (e) {
                res.statusCode = 502;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: String(e.message || e) }));
              }
            });
          });
        },
      },
    ],
  };
});
