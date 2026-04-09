export const AIRPORTS = [
  // Brasil
  { iata: 'GRU', city: 'São Paulo', country: 'Brasil', name: 'Guarulhos' },
  { iata: 'CGH', city: 'São Paulo', country: 'Brasil', name: 'Congonhas' },
  { iata: 'GIG', city: 'Rio de Janeiro', country: 'Brasil', name: 'Galeão' },
  { iata: 'SDU', city: 'Rio de Janeiro', country: 'Brasil', name: 'Santos Dumont' },
  { iata: 'BSB', city: 'Brasília', country: 'Brasil', name: 'Juscelino Kubitschek' },
  { iata: 'CNF', city: 'Belo Horizonte', country: 'Brasil', name: 'Confins' },
  { iata: 'SSA', city: 'Salvador', country: 'Brasil', name: 'Dep. Luís Eduardo Magalhães' },
  { iata: 'REC', city: 'Recife', country: 'Brasil', name: 'Guararapes' },
  { iata: 'FOR', city: 'Fortaleza', country: 'Brasil', name: 'Pinto Martins' },
  { iata: 'POA', city: 'Porto Alegre', country: 'Brasil', name: 'Salgado Filho' },
  { iata: 'CWB', city: 'Curitiba', country: 'Brasil', name: 'Afonso Pena' },
  { iata: 'FLN', city: 'Florianópolis', country: 'Brasil', name: 'Hercílio Luz' },
  { iata: 'VCP', city: 'Campinas', country: 'Brasil', name: 'Viracopos' },
  { iata: 'BEL', city: 'Belém', country: 'Brasil', name: 'Val de Cans' },
  { iata: 'MAO', city: 'Manaus', country: 'Brasil', name: 'Eduardo Gomes' },
  { iata: 'NAT', city: 'Natal', country: 'Brasil', name: 'Augusto Severo' },
  // América do Sul
  { iata: 'EZE', city: 'Buenos Aires', country: 'Argentina', name: 'Ezeiza' },
  { iata: 'SCL', city: 'Santiago', country: 'Chile', name: 'Arturo Merino Benítez' },
  { iata: 'BOG', city: 'Bogotá', country: 'Colômbia', name: 'El Dorado' },
  { iata: 'LIM', city: 'Lima', country: 'Peru', name: 'Jorge Chávez' },
  { iata: 'MVD', city: 'Montevidéu', country: 'Uruguai', name: 'Carrasco' },
  { iata: 'PTY', city: 'Cidade do Panamá', country: 'Panamá', name: 'Tocumen' },
  { iata: 'CUN', city: 'Cancún', country: 'México', name: 'Cancún International' },
  { iata: 'MEX', city: 'Cidade do México', country: 'México', name: 'Benito Juárez' },
  // América do Norte
  { iata: 'MIA', city: 'Miami', country: 'Estados Unidos', name: 'Miami International' },
  { iata: 'JFK', city: 'Nova York', country: 'Estados Unidos', name: 'John F. Kennedy' },
  { iata: 'EWR', city: 'Newark', country: 'Estados Unidos', name: 'Newark Liberty' },
  { iata: 'LAX', city: 'Los Angeles', country: 'Estados Unidos', name: 'Los Angeles International' },
  { iata: 'ORD', city: 'Chicago', country: 'Estados Unidos', name: "O'Hare" },
  { iata: 'MCO', city: 'Orlando', country: 'Estados Unidos', name: 'Orlando International' },
  { iata: 'SFO', city: 'São Francisco', country: 'Estados Unidos', name: 'San Francisco International' },
  { iata: 'ATL', city: 'Atlanta', country: 'Estados Unidos', name: 'Hartsfield-Jackson' },
  { iata: 'YYZ', city: 'Toronto', country: 'Canadá', name: 'Pearson' },
  // Europa
  { iata: 'LIS', city: 'Lisboa', country: 'Portugal', name: 'Humberto Delgado' },
  { iata: 'OPO', city: 'Porto', country: 'Portugal', name: 'Francisco Sá Carneiro' },
  { iata: 'MAD', city: 'Madrid', country: 'Espanha', name: 'Barajas' },
  { iata: 'BCN', city: 'Barcelona', country: 'Espanha', name: 'El Prat' },
  { iata: 'CDG', city: 'Paris', country: 'França', name: 'Charles de Gaulle' },
  { iata: 'LHR', city: 'Londres', country: 'Reino Unido', name: 'Heathrow' },
  { iata: 'FCO', city: 'Roma', country: 'Itália', name: 'Fiumicino' },
  { iata: 'MXP', city: 'Milão', country: 'Itália', name: 'Malpensa' },
  { iata: 'FRA', city: 'Frankfurt', country: 'Alemanha', name: 'Frankfurt am Main' },
  { iata: 'AMS', city: 'Amsterdã', country: 'Holanda', name: 'Schiphol' },
  { iata: 'IST', city: 'Istambul', country: 'Turquia', name: 'Istanbul Airport' },
  // Oriente Médio
  { iata: 'DXB', city: 'Dubai', country: 'Emirados Árabes', name: 'Dubai International' },
  { iata: 'DOH', city: 'Doha', country: 'Qatar', name: 'Hamad International' },
  // Ásia
  { iata: 'NRT', city: 'Tóquio', country: 'Japão', name: 'Narita' },
  { iata: 'ICN', city: 'Seul', country: 'Coreia do Sul', name: 'Incheon' },
  { iata: 'SIN', city: 'Singapura', country: 'Singapura', name: 'Changi' },
  { iata: 'BKK', city: 'Bangkok', country: 'Tailândia', name: 'Suvarnabhumi' },
  // Oceania
  { iata: 'SYD', city: 'Sydney', country: 'Austrália', name: 'Kingsford Smith' },
  // África
  { iata: 'JNB', city: 'Joanesburgo', country: 'África do Sul', name: 'O.R. Tambo' },
];

export function searchAirports(query) {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return AIRPORTS.filter(a =>
    a.iata.toLowerCase().includes(q) ||
    a.city.toLowerCase().includes(q) ||
    a.country.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q)
  ).slice(0, 8);
}
