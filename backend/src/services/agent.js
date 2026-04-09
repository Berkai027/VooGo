const Anthropic = require('@anthropic-ai/sdk').default;
const { env } = require('../config/env');
const logger = require('../config/logger');
const { SYSTEM_PROMPT } = require('./agentPrompt');
const { TOOLS, executeTool } = require('./agentTools');

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

const MAX_ITERATIONS = 5;

/**
 * Run the agent with agentic tool loop
 * Claude calls tools → we execute → feed results back → repeat until done
 *
 * @param {Array} messages - Conversation messages
 * @param {Function} onEvent - SSE event emitter (event, data)
 * @param {Function} isAborted - Check if client disconnected
 */
async function runAgent(messages, onEvent, isAborted) {
  const agentMessages = messages.map(m => ({ ...m }));

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    if (isAborted()) break;

    onEvent('text', {
      content: i === 0 ? 'Buscando voos...' : 'Analisando resultados...',
    });

    logger.info(`Agent iteration ${i + 1}`, { messageCount: agentMessages.length });

    const response = await anthropic.messages.create({
      model: env.AGENT_MODEL,
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages: agentMessages,
    });

    if (isAborted()) break;

    logger.info(`Agent response: stop_reason=${response.stop_reason}`, {
      usage: response.usage,
      contentBlocks: response.content.length,
    });

    // Claude wants to use tools
    if (response.stop_reason === 'tool_use') {
      agentMessages.push({ role: 'assistant', content: response.content });

      const toolResults = [];
      for (const block of response.content) {
        if (block.type === 'tool_use') {
          onEvent('text', {
            content: toolLabel(block.name),
          });

          const result = await executeTool(block.name, block.input);
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: JSON.stringify(result),
          });
        }
      }

      agentMessages.push({ role: 'user', content: toolResults });
      continue;
    }

    // Claude finished — extract and emit text + structured data
    let fullText = '';
    for (const block of response.content) {
      if (block.type === 'text') fullText += block.text;
    }

    // Parse <calendar_data>
    const calMatch = fullText.match(/<calendar_data>\s*([\s\S]*?)\s*<\/calendar_data>/);
    if (calMatch) {
      try {
        onEvent('calendar_data', JSON.parse(calMatch[1]));
      } catch (e) {
        logger.error('Failed to parse calendar_data', { error: e.message });
      }
      fullText = fullText.replace(/<calendar_data>[\s\S]*?<\/calendar_data>/, '');
    }

    // Parse <flights_data>
    const flightsMatch = fullText.match(/<flights_data>\s*([\s\S]*?)\s*<\/flights_data>/);
    if (flightsMatch) {
      try {
        onEvent('flights_data', JSON.parse(flightsMatch[1]));
      } catch (e) {
        logger.error('Failed to parse flights_data', { error: e.message });
      }
      fullText = fullText.replace(/<flights_data>[\s\S]*?<\/flights_data>/, '');
    }

    // Send clean text
    const cleanText = fullText.trim();
    if (cleanText) onEvent('text', { content: cleanText });

    onEvent('done', { usage: response.usage });
    return; // Done
  }
}

function toolLabel(name) {
  const labels = {
    search_flights_month: 'Consultando preços do mês...',
    search_flights_day: 'Buscando voos do dia...',
    search_airport: 'Buscando aeroportos...',
  };
  return labels[name] || `Executando ${name}...`;
}

module.exports = { runAgent };
