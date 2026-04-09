const express = require('express');
const { z } = require('zod');
const { runAgent } = require('../services/agent');
const logger = require('../config/logger');

const router = express.Router();

const agentSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1),
  })).min(1),
  searchContext: z.object({
    origin: z.string().optional(),
    destination: z.string().optional(),
    year: z.number().optional(),
    month: z.number().optional(),
  }).optional(),
});

// POST /api/v1/agent — SSE streaming
router.post('/', async (req, res) => {
  const parsed = agentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { messages, searchContext } = parsed.data;

  // SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  let aborted = false;
  req.on('close', () => { aborted = true; });

  const sendEvent = (event, data) => {
    if (!aborted) {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    }
  };

  try {
    // Append search context to last user message
    const processedMessages = messages.map(m => ({ ...m }));
    if (searchContext) {
      const last = processedMessages[processedMessages.length - 1];
      if (last?.role === 'user') {
        const ctx = searchContext;
        last.content += `\n\n[Contexto: Origem=${ctx.origin || ''}, Destino=${ctx.destination || ''}, Mês=${ctx.month}/${ctx.year}]`;
      }
    }

    await runAgent(processedMessages, sendEvent, () => aborted);

    if (!aborted) res.end();
  } catch (err) {
    logger.error('Agent route error:', { error: err.message, stack: err.stack });
    sendEvent('error', { message: err.message });
    if (!aborted) res.end();
  }
});

module.exports = router;
