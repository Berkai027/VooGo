const { env } = require('../config/env');
const logger = require('../config/logger');

function pad(n) { return String(n).padStart(2, '0'); }

/**
 * Sky Scrapper API (RapidAPI) — flight data provider
 * Docs: https://rapidapi.com/apiheya/api/sky-scrapper
 */
const skyScrapper = {
  async fetch(path, params) {
    const url = new URL(`https://${env.RAPIDAPI_HOST}${path}`);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }

    const res = await fetch(url.toString(), {
      headers: {
        'x-rapidapi-host': env.RAPIDAPI_HOST,
        'x-rapidapi-key': env.RAPIDAPI_KEY,
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      logger.error(`SkyScrapper ${res.status}: ${body.slice(0, 200)}`);
      throw new Error(`Flight API error: ${res.status}`);
    }

    return res.json();
  },

  /**
   * Get price calendar for a month
   * Endpoint: /api/v1/flights/getPriceCalendar
   */
  async getPriceCalendar(originSkyId, destSkyId, year, month) {
    const fromDate = `${year}-${pad(month)}-01`;
    const data = await this.fetch('/api/v1/flights/getPriceCalendar', {
      originSkyId,
      destinationSkyId: destSkyId,
      fromDate,
      currency: 'BRL',
    });

    const grid = data?.data?.flights?.days || data?.data?.flights || [];
    const flightList = Array.isArray(grid) ? grid : [];
    const daysInMonth = new Date(year, month, 0).getDate();
    const targetPrefix = `${year}-${pad(month)}`;

    const priceMap = {};
    for (const f of flightList) {
      const dateStr = f.day || f.date || f.departureDate || '';
      if (!dateStr.startsWith(targetPrefix)) continue;
      const dayNum = parseInt(dateStr.split('-')[2], 10);
      if (dayNum && f.price != null) {
        priceMap[dayNum] = {
          day: dayNum,
          date: dateStr,
          available: true,
          price: Number(f.price),
          currency: 'BRL',
          group: f.group || '',
        };
      }
    }

    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(priceMap[d] || {
        day: d,
        date: `${year}-${pad(month)}-${pad(d)}`,
        available: false,
        price: null,
        currency: 'BRL',
      });
    }

    return days;
  },

  /**
   * Search flights for a specific date
   * Endpoint: /api/v2/flights/searchFlights
   */
  async searchFlights(originSkyId, destSkyId, originEntityId, destEntityId, date) {
    const data = await this.fetch('/api/v2/flights/searchFlights', {
      originSkyId,
      destinationSkyId: destSkyId,
      originEntityId,
      destinationEntityId: destEntityId,
      date,
      cabinClass: 'economy',
      adults: 1,
      sortBy: 'best',
      currency: 'BRL',
      market: 'BR',
      countryCode: 'BR',
    });

    return (data?.data?.itineraries || []).slice(0, 6).map(it => {
      const leg = it.legs?.[0] || {};
      const carrier = leg.carriers?.marketing?.[0] || {};
      const durationMin = leg.durationInMinutes || 0;
      const segments = leg.segments || [];

      return {
        airline: carrier.name || '',
        airlineCode: carrier.alternateId || carrier.id?.toString() || '',
        departure: (leg.departure || '').slice(11, 16),
        arrival: (leg.arrival || '').slice(11, 16),
        duration: `${Math.floor(durationMin / 60)}h${pad(durationMin % 60)}`,
        stops: leg.stopCount ?? Math.max(0, segments.length - 1),
        stopCities: segments.slice(1).map(s => s.destination?.name || '').filter(Boolean),
        price: it.price?.raw ?? null,
        deepLink: it.deepLink || '',
      };
    });
  },

  // Brazilian airport IATA → state mapping (for enrichment)
  _brStates: {
    GRU:'SP',CGH:'SP',VCP:'SP',SDU:'RJ',GIG:'RJ',BSB:'DF',CNF:'MG',PLU:'MG',
    CWB:'PR',IGU:'PR',LDB:'PR',MGF:'PR',POA:'RS',CXJ:'RS',PET:'RS',FLN:'SC',
    NVT:'SC',JOI:'SC',JJG:'SC',EEA:'SC',CCM:'SC',SSA:'BA',BPS:'BA',IOS:'BA',
    REC:'PE',FEN:'PE',FOR:'CE',JDO:'CE',NAT:'RN',MCZ:'AL',AJU:'SE',SLZ:'MA',
    THE:'PI',BEL:'PA',MAO:'AM',MCP:'AP',PVH:'RO',RBR:'AC',BVB:'RR',PMW:'TO',
    GYN:'GO',CGB:'MT',CGR:'MS',BYO:'MS',VIX:'ES',JPA:'PB',SJP:'SP',SJK:'SP',
    RAO:'SP',BAU:'SP',PPB:'SP',UDI:'MG',MOC:'MG',CFB:'RJ',QDV:'RJ',AQA:'SP',
    JDF:'MG',IPN:'MG',CPV:'PB',PNZ:'PE',STM:'PA',IMP:'MA',CZS:'AC',TFF:'AM',
  },

  /**
   * Get nearby airports for a lat/lng point
   * Endpoint: /api/v1/flights/getNearByAirports
   */
  async getNearbyAirports(lat, lng) {
    const data = await this.fetch('/api/v1/flights/getNearByAirports', {
      lat,
      lng,
      locale: 'pt-BR',
    });

    const current = data?.data?.current;
    const nearby = Array.isArray(data?.data?.nearby) ? data.data.nearby : [];

    return {
      current: current
        ? {
            skyId: current.navigation?.relevantFlightParams?.skyId || current.skyId || '',
            entityId: current.entityId || '',
            name: current.presentation?.title || '',
            suggestionTitle: current.presentation?.suggestionTitle || '',
            subtitle: current.presentation?.subtitle || '',
          }
        : null,
      nearby: nearby.map((n) => {
        const fp = n.navigation?.relevantFlightParams || {};
        const hp = n.navigation?.relevantHotelParams || {};
        const skyId = fp.skyId || '';
        const airportName = fp.localizedName || n.presentation?.title || '';
        const city = hp.localizedName || '';
        const country = n.presentation?.subtitle || 'Brasil';
        const state = this._brStates[skyId] || '';
        const mapQuery = encodeURIComponent(`Aeroporto ${airportName} ${skyId} ${city} ${state} ${country}`);
        return {
          skyId,
          entityId: n.navigation?.entityId || '',
          airportName,
          city,
          state,
          country,
          suggestionTitle: n.presentation?.suggestionTitle || '',
          type: n.navigation?.entityType || 'AIRPORT',
          mapUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
        };
      }),
    };
  },

  /**
   * Search flights "everywhere" — cheapest destinations from an origin
   * Endpoint: /api/v2/flights/searchFlightEverywhere
   */
  async searchFlightEverywhere(originSkyId, originEntityId) {
    const data = await this.fetch('/api/v2/flights/searchFlightEverywhere', {
      originSkyId,
      originEntityId,
      cabinClass: 'economy',
      journeyType: 'one_way',
      currency: 'BRL',
      market: 'pt-BR',
      countryCode: 'BR',
    });

    const results = Array.isArray(data?.data?.results) ? data.data.results : [];

    return results
      .filter((r) => r.type === 'LOCATION' || r.type === 'PLACE')
      .map((r) => {
        const loc = r.content?.location || {};
        const quotes = r.content?.flightQuotes || {};
        const cheapest = quotes.cheapest || quotes.direct || {};
        return {
          id: loc.id || r.id,
          name: loc.name || '',
          type: loc.type || '', // Nation, City, Airport
          skyCode: loc.skyCode || '',
          continent: loc.continent?.name || '',
          price: cheapest.rawPrice ?? null,
          priceFormatted: cheapest.price || '',
          direct: !!cheapest.direct,
          image: r.content?.image?.url || '',
        };
      })
      .filter((r) => r.price != null)
      .sort((a, b) => a.price - b.price)
      .slice(0, 18);
  },

  /**
   * Search airports by query
   * Endpoint: /api/v1/flights/searchAirport
   */
  async searchAirport(query) {
    const data = await this.fetch('/api/v1/flights/searchAirport', {
      query,
      locale: 'pt-BR',
    });

    return (data?.data || []).map(item => ({
      skyId: item.skyId || '',
      entityId: item.entityId || '',
      name: item.presentation?.title || '',
      subtitle: item.presentation?.subtitle || '',
      suggestionTitle: item.presentation?.suggestionTitle || '',
    }));
  },
};

module.exports = { skyScrapper, pad };
