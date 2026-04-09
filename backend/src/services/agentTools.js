const { skyScrapper } = require('./flightApi');
const logger = require('../config/logger');

/**
 * Tool definitions for Claude agent
 * These are custom tools that Claude calls to get real flight data
 */
const TOOLS = [
  {
    name: 'search_flights_month',
    description: 'Search flight prices for every day of a given month. Returns an array with the cheapest price per day. Use this to populate the calendar. ALWAYS use IATA codes (GRU, LIS, MAD, etc).',
    input_schema: {
      type: 'object',
      properties: {
        origin: { type: 'string', description: 'Origin airport IATA/skyId code (e.g. GRU, SAOP)' },
        destination: { type: 'string', description: 'Destination airport IATA/skyId code (e.g. LIS, LISB)' },
        year: { type: 'number', description: 'Year (e.g. 2026)' },
        month: { type: 'number', description: 'Month 1-12' },
      },
      required: ['origin', 'destination', 'year', 'month'],
    },
  },
  {
    name: 'search_flights_day',
    description: 'Search available flights for a specific date. Returns up to 6 flights with details. Use IATA codes and entityIds from searchAirport.',
    input_schema: {
      type: 'object',
      properties: {
        originSkyId: { type: 'string', description: 'Origin skyId (e.g. GRU)' },
        destSkyId: { type: 'string', description: 'Destination skyId (e.g. LIS)' },
        originEntityId: { type: 'string', description: 'Origin entityId from searchAirport (e.g. 27544008)' },
        destEntityId: { type: 'string', description: 'Destination entityId from searchAirport (e.g. 27544008)' },
        date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
      },
      required: ['originSkyId', 'destSkyId', 'originEntityId', 'destEntityId', 'date'],
    },
  },
  {
    name: 'search_airport',
    description: 'Search for airports by city name or IATA code. Returns skyId and entityId needed for other flight searches.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'City name or airport code (e.g. "São Paulo", "GRU", "London")' },
      },
      required: ['query'],
    },
  },
];

/**
 * Execute a tool call from Claude
 */
async function executeTool(name, input) {
  logger.info(`Executing tool: ${name}`, { input });

  try {
    if (name === 'search_flights_month') {
      const { origin, destination, year, month } = input;
      return await skyScrapper.getPriceCalendar(origin, destination, year, month);
    }

    if (name === 'search_flights_day') {
      const { originSkyId, destSkyId, originEntityId, destEntityId, date } = input;
      return await skyScrapper.searchFlights(originSkyId, destSkyId, originEntityId, destEntityId, date);
    }

    if (name === 'search_airport') {
      return await skyScrapper.searchAirport(input.query);
    }

    return { error: `Unknown tool: ${name}` };
  } catch (err) {
    logger.error(`Tool ${name} failed: ${err.message}`);
    return { error: `Tool failed: ${err.message}` };
  }
}

module.exports = { TOOLS, executeTool };
