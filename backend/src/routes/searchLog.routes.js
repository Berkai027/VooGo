const express = require('express');
const prisma = require('../config/prisma');
const logger = require('../config/logger');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { origin, destination, city } = req.body;
    if (origin && destination) {
      await prisma.searchLog.create({
        data: {
          origin: String(origin).slice(0, 50),
          destination: String(destination).slice(0, 50),
          city: String(city || '').slice(0, 100),
        },
      });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error('Search log error:', { error: err.message });
    res.json({ success: true }); // Don't fail the user experience
  }
});

module.exports = router;
