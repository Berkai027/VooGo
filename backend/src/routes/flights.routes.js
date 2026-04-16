const express = require('express');
const { z } = require('zod');
const { skyScrapper } = require('../services/flightApi');
const logger = require('../config/logger');

const router = express.Router();

// ================================================================
// In-memory cache (TTL 1h) — avoid burning API quota
// ================================================================
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key, data) {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

// ================================================================
// GET /api/v1/flights/airports?q=term
// Search airports for autocomplete
// ================================================================
const airportSchema = z.object({
  q: z.string().min(2).max(100),
});

router.get('/airports', async (req, res, next) => {
  try {
    const parsed = airportSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: 'Query inválida' });
    }

    const { q } = parsed.data;
    const cacheKey = `airports|${q.toLowerCase()}`;
    const cached = cacheGet(cacheKey);
    if (cached) return res.json({ success: true, data: cached, cached: true });

    const results = await skyScrapper.searchAirport(q);
    cacheSet(cacheKey, results);

    res.json({ success: true, data: results });
  } catch (err) {
    logger.error('Airport search failed:', { error: err.message });
    next(err);
  }
});

// ================================================================
// GET /api/v1/flights/calendar?originSkyId=GRU&destSkyId=LIS&year=2026&month=5
// Price calendar for a whole month (fast, direct API)
// ================================================================
const calendarSchema = z.object({
  originSkyId: z.string().min(2).max(10),
  destSkyId: z.string().min(2).max(10),
  year: z.coerce.number().min(2024).max(2035),
  month: z.coerce.number().min(1).max(12),
});

router.get('/calendar', async (req, res, next) => {
  try {
    const parsed = calendarSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros inválidos',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { originSkyId, destSkyId, year, month } = parsed.data;
    const cacheKey = `cal|${originSkyId}|${destSkyId}|${year}|${month}`;
    const cached = cacheGet(cacheKey);
    if (cached) return res.json({ success: true, data: cached, cached: true });

    logger.info('Fetching calendar', { originSkyId, destSkyId, year, month });
    const days = await skyScrapper.getPriceCalendar(originSkyId, destSkyId, year, month);

    // Calculate stats
    const available = days.filter(d => d.available && d.price != null);
    const prices = available.map(d => d.price).sort((a, b) => a - b);
    const avg = prices.length ? prices.reduce((s, p) => s + p, 0) / prices.length : 0;
    const min = prices[0] || 0;
    const max = prices[prices.length - 1] || 0;

    const sorted = [...available].sort((a, b) => a.price - b.price);
    const bestDays = sorted.slice(0, 3).map(d => ({
      day: d.day,
      price: d.price,
      saving: avg > 0 ? Math.round((1 - d.price / avg) * 100) + '%' : '0%',
    }));

    const data = {
      origin: { iata: originSkyId },
      destination: { iata: destSkyId },
      currency: 'BRL',
      month: `${year}-${String(month).padStart(2, '0')}`,
      price_stats: { min, max, avg: Math.round(avg) },
      days,
      bestDays,
      cheapestDay: sorted[0] || null,
      averagePrice: Math.round(avg),
    };

    cacheSet(cacheKey, data);
    res.json({ success: true, data });
  } catch (err) {
    logger.error('Calendar fetch failed:', { error: err.message });
    next(err);
  }
});

// ================================================================
// GET /api/v1/flights/day?originSkyId=...&destSkyId=...&originEntityId=...&destEntityId=...&date=YYYY-MM-DD
// Flights for a specific day
// ================================================================
const daySchema = z.object({
  originSkyId: z.string().min(2).max(10),
  destSkyId: z.string().min(2).max(10),
  originEntityId: z.string().min(1),
  destEntityId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

router.get('/day', async (req, res, next) => {
  try {
    const parsed = daySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros inválidos',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { originSkyId, destSkyId, originEntityId, destEntityId, date } = parsed.data;
    const cacheKey = `day|${originSkyId}|${destSkyId}|${date}`;
    const cached = cacheGet(cacheKey);
    if (cached) return res.json({ success: true, data: cached, cached: true });

    logger.info('Fetching flights', { originSkyId, destSkyId, date });
    const flights = await skyScrapper.searchFlights(
      originSkyId,
      destSkyId,
      originEntityId,
      destEntityId,
      date
    );

    cacheSet(cacheKey, flights);
    res.json({ success: true, data: flights });
  } catch (err) {
    logger.error('Flights fetch failed:', { error: err.message });
    next(err);
  }
});

// ================================================================
// GET /api/v1/flights/nearby?lat=-23.55&lng=-46.63
// Airports near a GPS point
// ================================================================
const nearbySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

router.get('/nearby', async (req, res, next) => {
  try {
    const parsed = nearbySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: 'Lat/Lng inválidos' });
    }

    const { lat, lng } = parsed.data;
    const cacheKey = `nearby|${lat.toFixed(2)}|${lng.toFixed(2)}`;
    const cached = cacheGet(cacheKey);
    if (cached) return res.json({ success: true, data: cached, cached: true });

    const data = await skyScrapper.getNearbyAirports(lat, lng);
    cacheSet(cacheKey, data);

    res.json({ success: true, data });
  } catch (err) {
    logger.error('Nearby airports failed:', { error: err.message });
    next(err);
  }
});

// ================================================================
// GET /api/v1/flights/everywhere?originSkyId=SAOA&originEntityId=27539772
// Cheapest destinations from an origin
// ================================================================
const everywhereSchema = z.object({
  originSkyId: z.string().min(2).max(10),
  originEntityId: z.string().min(1),
});

router.get('/everywhere', async (req, res, next) => {
  try {
    const parsed = everywhereSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: 'Parâmetros inválidos' });
    }

    const { originSkyId, originEntityId } = parsed.data;
    const cacheKey = `everywhere|${originSkyId}|${originEntityId}`;
    const cached = cacheGet(cacheKey);
    if (cached) return res.json({ success: true, data: cached, cached: true });

    logger.info('Fetching everywhere', { originSkyId });
    const data = await skyScrapper.searchFlightEverywhere(originSkyId, originEntityId);
    cacheSet(cacheKey, data);

    res.json({ success: true, data });
  } catch (err) {
    logger.error('Everywhere search failed:', { error: err.message });
    next(err);
  }
});

module.exports = router;
