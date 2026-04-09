const express = require('express');
const { env } = require('../config/env');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      whatsappNumber: env.WHATSAPP_NUMBER,
    },
  });
});

module.exports = router;
