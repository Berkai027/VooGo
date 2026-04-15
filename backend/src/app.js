const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { env } = require('./config/env');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();

// ── SECURITY ──
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGINS.split(',').map(s => s.trim()),
  credentials: true,
}));

// ── RATE LIMITING ──
app.use('/api/', rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Try again later.' },
}));

// ── PARSERS ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── LOGGING ──
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── HEALTH CHECK ──
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    uptime: process.uptime(),
  });
});

// ── ROUTES ──
app.use('/api/v1/flights', require('./routes/flights.routes'));
app.use('/api/v1/config', require('./routes/config.routes'));
app.use('/api/v1/search-log', require('./routes/searchLog.routes'));

// ── ERROR HANDLING ──
app.use(notFound);
app.use(errorHandler);

module.exports = app;
