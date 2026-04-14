const express = require('express');
const logger = require('../config/logger');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { origin, destination, city } = req.body;
    if (origin && destination) {
      // Log to file for now (Prisma will be used when MySQL is configured)
      const line = `${new Date().toISOString()}\t${String(origin).slice(0, 50)}\t${String(destination).slice(0, 50)}\t${String(city || '').slice(0, 100)}\n`;
      await fs.appendFile(path.join(__dirname, '..', '..', 'searches.log'), line).catch(() => {});
      logger.info('Search logged', { origin, destination });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error('Search log error:', { error: err.message });
    res.json({ success: true });
  }
});

module.exports = router;
