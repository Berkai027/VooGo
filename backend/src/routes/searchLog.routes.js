const express = require('express');
const { z } = require('zod');
const logger = require('../config/logger');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

const LOG_FILE = path.join(__dirname, '..', '..', 'searches.log');
const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5 MB — rotate after this

const logSchema = z.object({
  origin: z.string().min(1).max(50),
  destination: z.string().min(1).max(50),
  city: z.string().max(100).optional(),
});

async function rotateLogIfNeeded() {
  try {
    const stat = await fs.stat(LOG_FILE);
    if (stat.size < MAX_LOG_SIZE) return;
    const archive = `${LOG_FILE}.${Date.now()}`;
    await fs.rename(LOG_FILE, archive);
  } catch {
    // file doesn't exist yet — no rotation needed
  }
}

router.post('/', async (req, res) => {
  try {
    const parsed = logSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: 'Dados inválidos' });
    }

    const { origin, destination, city } = parsed.data;
    await rotateLogIfNeeded();
    const line = `${new Date().toISOString()}\t${origin}\t${destination}\t${city || ''}\n`;
    await fs.appendFile(LOG_FILE, line).catch(() => {});
    logger.info('Search logged', { origin, destination });

    res.json({ success: true });
  } catch (err) {
    logger.error('Search log error:', { error: err.message });
    res.json({ success: true });
  }
});

module.exports = router;
