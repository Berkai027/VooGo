/**
 * Airport database with popularity scores (1-10)
 * Used to rank autocomplete results by relevance
 */
export const AIRPORTS = [
  // ═══ BRASIL — hubs principais ═══
  { iata: 'GRU', city: 'São Paulo', country: 'Brasil', name: 'Guarulhos', popularity: 10 },
  { iata: 'CGH', city: 'São Paulo', country: 'Brasil', name: 'Congonhas', popularity: 9 },
  { iata: 'GIG', city: 'Rio de Janeiro', country: 'Brasil', name: 'Galeão', popularity: 9 },
  { iata: 'SDU', city: 'Rio de Janeiro', country: 'Brasil', name: 'Santos Dumont', popularity: 8 },
  { iata: 'BSB', city: 'Brasília', country: 'Brasil', name: 'Juscelino Kubitschek', popularity: 9 },
  { iata: 'CNF', city: 'Belo Horizonte', country: 'Brasil', name: 'Confins', popularity: 8 },
  { iata: 'VCP', city: 'Campinas', country: 'Brasil', name: 'Viracopos', popularity: 7 },

  // ═══ BRASIL — capitais ═══
  { iata: 'SSA', city: 'Salvador', country: 'Brasil', name: 'Dep. Luís Eduardo Magalhães', popularity: 8 },
  { iata: 'REC', city: 'Recife', country: 'Brasil', name: 'Guararapes', popularity: 8 },
  { iata: 'FOR', city: 'Fortaleza', country: 'Brasil', name: 'Pinto Martins', popularity: 8 },
  { iata: 'POA', city: 'Porto Alegre', country: 'Brasil', name: 'Salgado Filho', popularity: 8 },
  { iata: 'CWB', city: 'Curitiba', country: 'Brasil', name: 'Afonso Pena', popularity: 8 },
  { iata: 'FLN', city: 'Florianópolis', country: 'Brasil', name: 'Hercílio Luz', popularity: 8 },
  { iata: 'BEL', city: 'Belém', country: 'Brasil', name: 'Val de Cans', popularity: 7 },
  { iata: 'MAO', city: 'Manaus', country: 'Brasil', name: 'Eduardo Gomes', popularity: 7 },
  { iata: 'NAT', city: 'Natal', country: 'Brasil', name: 'Aluízio Alves', popularity: 7 },
  { iata: 'MCZ', city: 'Maceió', country: 'Brasil', name: 'Zumbi dos Palmares', popularity: 7 },
  { iata: 'AJU', city: 'Aracaju', country: 'Brasil', name: 'Santa Maria', popularity: 6 },
  { iata: 'SLZ', city: 'São Luís', country: 'Brasil', name: 'Marechal Cunha Machado', popularity: 6 },
  { iata: 'THE', city: 'Teresina', country: 'Brasil', name: 'Senador Petrônio Portella', popularity: 6 },
  { iata: 'JPA', city: 'João Pessoa', country: 'Brasil', name: 'Presidente Castro Pinto', popularity: 6 },
  { iata: 'CGB', city: 'Cuiabá', country: 'Brasil', name: 'Marechal Rondon', popularity: 6 },
  { iata: 'CGR', city: 'Campo Grande', country: 'Brasil', name: 'Campo Grande Intl', popularity: 6 },
  { iata: 'GYN', city: 'Goiânia', country: 'Brasil', name: 'Santa Genoveva', popularity: 6 },
  { iata: 'VIX', city: 'Vitória', country: 'Brasil', name: 'Eurico de Aguiar Salles', popularity: 6 },
  { iata: 'PVH', city: 'Porto Velho', country: 'Brasil', name: 'Governador Jorge Teixeira', popularity: 5 },
  { iata: 'MCP', city: 'Macapá', country: 'Brasil', name: 'Alberto Alcolumbre', popularity: 5 },
  { iata: 'RBR', city: 'Rio Branco', country: 'Brasil', name: 'Plácido de Castro', popularity: 5 },
  { iata: 'BVB', city: 'Boa Vista', country: 'Brasil', name: 'Atlas Brasil Cantanhede', popularity: 5 },
  { iata: 'PMW', city: 'Palmas', country: 'Brasil', name: 'Brigadeiro Lysias Rodrigues', popularity: 5 },

  // ═══ BRASIL — destinos turísticos e regionais ═══
  { iata: 'IGU', city: 'Foz do Iguaçu', country: 'Brasil', name: 'Cataratas', popularity: 7 },
  { iata: 'BPS', city: 'Porto Seguro', country: 'Brasil', name: 'Porto Seguro', popularity: 7 },
  { iata: 'IOS', city: 'Ilhéus', country: 'Brasil', name: 'Jorge Amado', popularity: 6 },
  { iata: 'PNZ', city: 'Petrolina', country: 'Brasil', name: 'Senador Nilo Coelho', popularity: 5 },
  { iata: 'JOI', city: 'Joinville', country: 'Brasil', name: 'Lauro Carneiro de Loyola', popularity: 5 },
  { iata: 'NVT', city: 'Navegantes', country: 'Brasil', name: 'Ministro Victor Konder', popularity: 6 },
  { iata: 'LDB', city: 'Londrina', country: 'Brasil', name: 'Governador José Richa', popularity: 5 },
  { iata: 'MGF', city: 'Maringá', country: 'Brasil', name: 'Sílvio Name Júnior', popularity: 5 },
  { iata: 'UDI', city: 'Uberlândia', country: 'Brasil', name: 'Ten. Cel. Av. César Bombonato', popularity: 5 },
  { iata: 'RAO', city: 'Ribeirão Preto', country: 'Brasil', name: 'Leite Lopes', popularity: 5 },
  { iata: 'CXJ', city: 'Caxias do Sul', country: 'Brasil', name: 'Hugo Cantergiani', popularity: 5 },
  { iata: 'AIA', city: 'Angra dos Reis', country: 'Brasil', name: 'Helipad Angra', popularity: 6 },
  { iata: 'JDO', city: 'Juazeiro do Norte', country: 'Brasil', name: 'Orlando Bezerra', popularity: 5 },
  { iata: 'FEN', city: 'Fernando de Noronha', country: 'Brasil', name: 'Fernando de Noronha', popularity: 7 },
  { iata: 'BYO', city: 'Bonito', country: 'Brasil', name: 'Bonito', popularity: 6 },
  { iata: 'JJD', city: 'Jericoacoara', country: 'Brasil', name: 'Jericoacoara', popularity: 6 },

  // ═══ AMÉRICA DO SUL ═══
  { iata: 'EZE', city: 'Buenos Aires', country: 'Argentina', name: 'Ezeiza', popularity: 9 },
  { iata: 'AEP', city: 'Buenos Aires', country: 'Argentina', name: 'Aeroparque', popularity: 7 },
  { iata: 'SCL', city: 'Santiago', country: 'Chile', name: 'Arturo Merino Benítez', popularity: 9 },
  { iata: 'BOG', city: 'Bogotá', country: 'Colômbia', name: 'El Dorado', popularity: 8 },
  { iata: 'LIM', city: 'Lima', country: 'Peru', name: 'Jorge Chávez', popularity: 8 },
  { iata: 'MVD', city: 'Montevidéu', country: 'Uruguai', name: 'Carrasco', popularity: 7 },
  { iata: 'ASU', city: 'Assunção', country: 'Paraguai', name: 'Silvio Pettirossi', popularity: 6 },
  { iata: 'UIO', city: 'Quito', country: 'Equador', name: 'Mariscal Sucre', popularity: 6 },
  { iata: 'GYE', city: 'Guayaquil', country: 'Equador', name: 'José Joaquín de Olmedo', popularity: 6 },
  { iata: 'CCS', city: 'Caracas', country: 'Venezuela', name: 'Simón Bolívar', popularity: 6 },
  { iata: 'PTY', city: 'Cidade do Panamá', country: 'Panamá', name: 'Tocumen', popularity: 8 },
  { iata: 'CUN', city: 'Cancún', country: 'México', name: 'Cancún International', popularity: 9 },
  { iata: 'MEX', city: 'Cidade do México', country: 'México', name: 'Benito Juárez', popularity: 9 },

  // ═══ AMÉRICA DO NORTE ═══
  { iata: 'MIA', city: 'Miami', country: 'Estados Unidos', name: 'Miami International', popularity: 10 },
  { iata: 'MCO', city: 'Orlando', country: 'Estados Unidos', name: 'Orlando International', popularity: 10 },
  { iata: 'JFK', city: 'Nova York', country: 'Estados Unidos', name: 'John F. Kennedy', popularity: 10 },
  { iata: 'EWR', city: 'Newark', country: 'Estados Unidos', name: 'Newark Liberty', popularity: 8 },
  { iata: 'LGA', city: 'Nova York', country: 'Estados Unidos', name: 'LaGuardia', popularity: 7 },
  { iata: 'LAX', city: 'Los Angeles', country: 'Estados Unidos', name: 'Los Angeles International', popularity: 10 },
  { iata: 'SFO', city: 'São Francisco', country: 'Estados Unidos', name: 'San Francisco International', popularity: 9 },
  { iata: 'ORD', city: 'Chicago', country: 'Estados Unidos', name: "O'Hare", popularity: 9 },
  { iata: 'ATL', city: 'Atlanta', country: 'Estados Unidos', name: 'Hartsfield-Jackson', popularity: 9 },
  { iata: 'DFW', city: 'Dallas', country: 'Estados Unidos', name: 'Dallas/Fort Worth', popularity: 8 },
  { iata: 'BOS', city: 'Boston', country: 'Estados Unidos', name: 'Logan International', popularity: 8 },
  { iata: 'LAS', city: 'Las Vegas', country: 'Estados Unidos', name: 'Harry Reid', popularity: 9 },
  { iata: 'SEA', city: 'Seattle', country: 'Estados Unidos', name: 'Seattle-Tacoma', popularity: 8 },
  { iata: 'IAH', city: 'Houston', country: 'Estados Unidos', name: 'George Bush', popularity: 8 },
  { iata: 'DEN', city: 'Denver', country: 'Estados Unidos', name: 'Denver International', popularity: 8 },
  { iata: 'FLL', city: 'Fort Lauderdale', country: 'Estados Unidos', name: 'Hollywood International', popularity: 7 },
  { iata: 'YYZ', city: 'Toronto', country: 'Canadá', name: 'Pearson', popularity: 8 },
  { iata: 'YVR', city: 'Vancouver', country: 'Canadá', name: 'Vancouver International', popularity: 7 },
  { iata: 'YUL', city: 'Montreal', country: 'Canadá', name: 'Pierre Elliott Trudeau', popularity: 7 },

  // ═══ EUROPA ═══
  { iata: 'LIS', city: 'Lisboa', country: 'Portugal', name: 'Humberto Delgado', popularity: 10 },
  { iata: 'OPO', city: 'Porto', country: 'Portugal', name: 'Francisco Sá Carneiro', popularity: 8 },
  { iata: 'MAD', city: 'Madrid', country: 'Espanha', name: 'Barajas', popularity: 10 },
  { iata: 'BCN', city: 'Barcelona', country: 'Espanha', name: 'El Prat', popularity: 9 },
  { iata: 'CDG', city: 'Paris', country: 'França', name: 'Charles de Gaulle', popularity: 10 },
  { iata: 'ORY', city: 'Paris', country: 'França', name: 'Orly', popularity: 7 },
  { iata: 'LHR', city: 'Londres', country: 'Reino Unido', name: 'Heathrow', popularity: 10 },
  { iata: 'LGW', city: 'Londres', country: 'Reino Unido', name: 'Gatwick', popularity: 7 },
  { iata: 'FCO', city: 'Roma', country: 'Itália', name: 'Fiumicino', popularity: 9 },
  { iata: 'MXP', city: 'Milão', country: 'Itália', name: 'Malpensa', popularity: 8 },
  { iata: 'FRA', city: 'Frankfurt', country: 'Alemanha', name: 'Frankfurt am Main', popularity: 9 },
  { iata: 'MUC', city: 'Munique', country: 'Alemanha', name: 'Franz Josef Strauss', popularity: 7 },
  { iata: 'BER', city: 'Berlim', country: 'Alemanha', name: 'Brandenburg', popularity: 7 },
  { iata: 'AMS', city: 'Amsterdã', country: 'Holanda', name: 'Schiphol', popularity: 9 },
  { iata: 'ZRH', city: 'Zurique', country: 'Suíça', name: 'Zurich Airport', popularity: 7 },
  { iata: 'GVA', city: 'Genebra', country: 'Suíça', name: 'Genève Aéroport', popularity: 6 },
  { iata: 'VIE', city: 'Viena', country: 'Áustria', name: 'Vienna International', popularity: 7 },
  { iata: 'CPH', city: 'Copenhague', country: 'Dinamarca', name: 'Kastrup', popularity: 7 },
  { iata: 'ARN', city: 'Estocolmo', country: 'Suécia', name: 'Arlanda', popularity: 7 },
  { iata: 'HEL', city: 'Helsinque', country: 'Finlândia', name: 'Vantaa', popularity: 6 },
  { iata: 'OSL', city: 'Oslo', country: 'Noruega', name: 'Gardermoen', popularity: 6 },
  { iata: 'DUB', city: 'Dublin', country: 'Irlanda', name: 'Dublin Airport', popularity: 7 },
  { iata: 'IST', city: 'Istambul', country: 'Turquia', name: 'Istanbul Airport', popularity: 9 },
  { iata: 'ATH', city: 'Atenas', country: 'Grécia', name: 'Eleftherios Venizelos', popularity: 7 },
  { iata: 'PRG', city: 'Praga', country: 'Tchéquia', name: 'Václav Havel', popularity: 7 },
  { iata: 'BUD', city: 'Budapeste', country: 'Hungria', name: 'Ferenc Liszt', popularity: 6 },
  { iata: 'WAW', city: 'Varsóvia', country: 'Polônia', name: 'Chopin', popularity: 6 },

  // ═══ ORIENTE MÉDIO ═══
  { iata: 'DXB', city: 'Dubai', country: 'Emirados Árabes', name: 'Dubai International', popularity: 10 },
  { iata: 'DOH', city: 'Doha', country: 'Qatar', name: 'Hamad International', popularity: 9 },
  { iata: 'AUH', city: 'Abu Dhabi', country: 'Emirados Árabes', name: 'Abu Dhabi International', popularity: 7 },
  { iata: 'TLV', city: 'Tel Aviv', country: 'Israel', name: 'Ben Gurion', popularity: 7 },
  { iata: 'CAI', city: 'Cairo', country: 'Egito', name: 'Cairo International', popularity: 7 },

  // ═══ ÁSIA ═══
  { iata: 'NRT', city: 'Tóquio', country: 'Japão', name: 'Narita', popularity: 9 },
  { iata: 'HND', city: 'Tóquio', country: 'Japão', name: 'Haneda', popularity: 8 },
  { iata: 'ICN', city: 'Seul', country: 'Coreia do Sul', name: 'Incheon', popularity: 8 },
  { iata: 'SIN', city: 'Singapura', country: 'Singapura', name: 'Changi', popularity: 9 },
  { iata: 'BKK', city: 'Bangkok', country: 'Tailândia', name: 'Suvarnabhumi', popularity: 9 },
  { iata: 'HKG', city: 'Hong Kong', country: 'China', name: 'Hong Kong International', popularity: 8 },
  { iata: 'PEK', city: 'Pequim', country: 'China', name: 'Capital International', popularity: 7 },
  { iata: 'PVG', city: 'Xangai', country: 'China', name: 'Pudong', popularity: 7 },
  { iata: 'DEL', city: 'Nova Delhi', country: 'Índia', name: 'Indira Gandhi', popularity: 7 },
  { iata: 'BOM', city: 'Mumbai', country: 'Índia', name: 'Chhatrapati Shivaji', popularity: 6 },
  { iata: 'KUL', city: 'Kuala Lumpur', country: 'Malásia', name: 'KLIA', popularity: 7 },

  // ═══ OCEANIA ═══
  { iata: 'SYD', city: 'Sydney', country: 'Austrália', name: 'Kingsford Smith', popularity: 8 },
  { iata: 'MEL', city: 'Melbourne', country: 'Austrália', name: 'Tullamarine', popularity: 7 },
  { iata: 'AKL', city: 'Auckland', country: 'Nova Zelândia', name: 'Auckland Airport', popularity: 6 },

  // ═══ ÁFRICA ═══
  { iata: 'JNB', city: 'Joanesburgo', country: 'África do Sul', name: 'O.R. Tambo', popularity: 7 },
  { iata: 'CPT', city: 'Cidade do Cabo', country: 'África do Sul', name: 'Cape Town Intl', popularity: 6 },
  { iata: 'CMN', city: 'Casablanca', country: 'Marrocos', name: 'Mohammed V', popularity: 6 },
];

/**
 * Remove accents for better matching (São Paulo → sao paulo)
 */
function normalize(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Search airports by query with intelligent ranking
 * Priority order:
 *   1. Exact IATA match (e.g. "GRU")
 *   2. City starts with query
 *   3. IATA starts with query
 *   4. Country starts with query
 *   5. Name contains query (partial)
 * Within each group, sorted by popularity (desc)
 */
export function searchAirports(query) {
  const q = normalize(query);
  if (!q) return [];
  const qLen = q.length;

  const results = [];
  for (const a of AIRPORTS) {
    const iata = a.iata.toLowerCase();
    const city = normalize(a.city);
    const country = normalize(a.country);
    const name = normalize(a.name);

    let score = 0;

    // Exact IATA match (highest priority)
    if (iata === q) score = 1000;
    // IATA starts with
    else if (iata.startsWith(q)) score = 900;
    // City starts with
    else if (city.startsWith(q)) score = 800;
    // City contains as word start (any word)
    else if (city.includes(' ' + q) || city.split(' ').some(w => w.startsWith(q))) score = 700;
    // Country starts with
    else if (country.startsWith(q)) score = 500;
    // Name starts with
    else if (name.startsWith(q)) score = 400;
    // City contains (substring)
    else if (qLen >= 3 && city.includes(q)) score = 300;
    // Name contains
    else if (qLen >= 3 && name.includes(q)) score = 200;
    // Country contains
    else if (qLen >= 3 && country.includes(q)) score = 100;

    if (score > 0) {
      // Add popularity as tie-breaker (up to +10)
      results.push({ ...a, _score: score + (a.popularity || 0) });
    }
  }

  results.sort((a, b) => b._score - a._score);
  return results.slice(0, 8).map(({ _score, ...rest }) => rest);
}
