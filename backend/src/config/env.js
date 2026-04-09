const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  FRONTEND_URL: z.string().url().default('http://localhost:5174'),
  CORS_ORIGINS: z.string().default('http://localhost:5174'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
  ANTHROPIC_API_KEY: z.string().min(1, 'ANTHROPIC_API_KEY é obrigatória'),
  AGENT_MODEL: z.string().default('claude-sonnet-4-20250514'),
  RAPIDAPI_KEY: z.string().min(1, 'RAPIDAPI_KEY é obrigatória'),
  RAPIDAPI_HOST: z.string().default('sky-scrapper.p.rapidapi.com'),
  WHATSAPP_NUMBER: z.string().default('5599999999999'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('debug'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

module.exports = { env: parsed.data };
