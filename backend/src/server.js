require('dotenv').config({ override: true });
const { env } = require('./config/env');
const app = require('./app');
const logger = require('./config/logger');

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 VooGo API running on port ${env.PORT} (${env.NODE_ENV})`);
  logger.info(`Flights API: ${env.RAPIDAPI_HOST}`);
});

const shutdown = (signal) => {
  logger.info(`${signal} received. Shutting down...`);
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  shutdown('UNHANDLED_REJECTION');
});
