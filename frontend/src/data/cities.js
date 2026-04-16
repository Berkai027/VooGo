// Cities for the Private Flights page.
// We only need city names — the exact location (heliport, address, airport)
// gets adjusted with the client during the human service step.

export const CITIES = [
  // === BRASIL — capitais e grandes destinos ===
  { id: 'sao-paulo', name: 'São Paulo', state: 'SP', country: 'Brasil', popularity: 10 },
  { id: 'rio-de-janeiro', name: 'Rio de Janeiro', state: 'RJ', country: 'Brasil', popularity: 10 },
  { id: 'brasilia', name: 'Brasília', state: 'DF', country: 'Brasil', popularity: 9 },
  { id: 'belo-horizonte', name: 'Belo Horizonte', state: 'MG', country: 'Brasil', popularity: 9 },
  { id: 'curitiba', name: 'Curitiba', state: 'PR', country: 'Brasil', popularity: 8 },
  { id: 'porto-alegre', name: 'Porto Alegre', state: 'RS', country: 'Brasil', popularity: 8 },
  { id: 'salvador', name: 'Salvador', state: 'BA', country: 'Brasil', popularity: 9 },
  { id: 'recife', name: 'Recife', state: 'PE', country: 'Brasil', popularity: 8 },
  { id: 'fortaleza', name: 'Fortaleza', state: 'CE', country: 'Brasil', popularity: 8 },
  { id: 'manaus', name: 'Manaus', state: 'AM', country: 'Brasil', popularity: 7 },
  { id: 'belem', name: 'Belém', state: 'PA', country: 'Brasil', popularity: 7 },
  { id: 'florianopolis', name: 'Florianópolis', state: 'SC', country: 'Brasil', popularity: 9 },
  { id: 'vitoria', name: 'Vitória', state: 'ES', country: 'Brasil', popularity: 7 },
  { id: 'natal', name: 'Natal', state: 'RN', country: 'Brasil', popularity: 7 },
  { id: 'maceio', name: 'Maceió', state: 'AL', country: 'Brasil', popularity: 7 },
  { id: 'joao-pessoa', name: 'João Pessoa', state: 'PB', country: 'Brasil', popularity: 6 },
  { id: 'aracaju', name: 'Aracaju', state: 'SE', country: 'Brasil', popularity: 6 },
  { id: 'sao-luis', name: 'São Luís', state: 'MA', country: 'Brasil', popularity: 6 },
  { id: 'teresina', name: 'Teresina', state: 'PI', country: 'Brasil', popularity: 5 },
  { id: 'campo-grande', name: 'Campo Grande', state: 'MS', country: 'Brasil', popularity: 6 },
  { id: 'cuiaba', name: 'Cuiabá', state: 'MT', country: 'Brasil', popularity: 6 },
  { id: 'goiania', name: 'Goiânia', state: 'GO', country: 'Brasil', popularity: 7 },
  { id: 'palmas', name: 'Palmas', state: 'TO', country: 'Brasil', popularity: 5 },
  { id: 'porto-velho', name: 'Porto Velho', state: 'RO', country: 'Brasil', popularity: 4 },
  { id: 'rio-branco', name: 'Rio Branco', state: 'AC', country: 'Brasil', popularity: 4 },
  { id: 'macapa', name: 'Macapá', state: 'AP', country: 'Brasil', popularity: 4 },
  { id: 'boa-vista', name: 'Boa Vista', state: 'RR', country: 'Brasil', popularity: 4 },

  // === BRASIL — destinos de turismo / interior relevante ===
  { id: 'campinas', name: 'Campinas', state: 'SP', country: 'Brasil', popularity: 7 },
  { id: 'sao-jose-rio-preto', name: 'São José do Rio Preto', state: 'SP', country: 'Brasil', popularity: 6 },
  { id: 'ribeirao-preto', name: 'Ribeirão Preto', state: 'SP', country: 'Brasil', popularity: 7 },
  { id: 'guaruja', name: 'Guarujá', state: 'SP', country: 'Brasil', popularity: 8 },
  { id: 'santos', name: 'Santos', state: 'SP', country: 'Brasil', popularity: 7 },
  { id: 'ilhabela', name: 'Ilhabela', state: 'SP', country: 'Brasil', popularity: 8 },
  { id: 'ubatuba', name: 'Ubatuba', state: 'SP', country: 'Brasil', popularity: 7 },
  { id: 'sao-sebastiao', name: 'São Sebastião', state: 'SP', country: 'Brasil', popularity: 7 },
  { id: 'campos-do-jordao', name: 'Campos do Jordão', state: 'SP', country: 'Brasil', popularity: 9 },
  { id: 'angra-dos-reis', name: 'Angra dos Reis', state: 'RJ', country: 'Brasil', popularity: 10 },
  { id: 'paraty', name: 'Paraty', state: 'RJ', country: 'Brasil', popularity: 9 },
  { id: 'buzios', name: 'Búzios', state: 'RJ', country: 'Brasil', popularity: 10 },
  { id: 'cabo-frio', name: 'Cabo Frio', state: 'RJ', country: 'Brasil', popularity: 8 },
  { id: 'petropolis', name: 'Petrópolis', state: 'RJ', country: 'Brasil', popularity: 7 },
  { id: 'porto-seguro', name: 'Porto Seguro', state: 'BA', country: 'Brasil', popularity: 9 },
  { id: 'trancoso', name: 'Trancoso', state: 'BA', country: 'Brasil', popularity: 10 },
  { id: 'morro-de-sao-paulo', name: 'Morro de São Paulo', state: 'BA', country: 'Brasil', popularity: 9 },
  { id: 'itacare', name: 'Itacaré', state: 'BA', country: 'Brasil', popularity: 8 },
  { id: 'ilheus', name: 'Ilhéus', state: 'BA', country: 'Brasil', popularity: 7 },
  { id: 'fernando-de-noronha', name: 'Fernando de Noronha', state: 'PE', country: 'Brasil', popularity: 10 },
  { id: 'jericoacoara', name: 'Jericoacoara', state: 'CE', country: 'Brasil', popularity: 9 },
  { id: 'canoa-quebrada', name: 'Canoa Quebrada', state: 'CE', country: 'Brasil', popularity: 7 },
  { id: 'pipa', name: 'Pipa', state: 'RN', country: 'Brasil', popularity: 8 },
  { id: 'gramado', name: 'Gramado', state: 'RS', country: 'Brasil', popularity: 9 },
  { id: 'canela', name: 'Canela', state: 'RS', country: 'Brasil', popularity: 7 },
  { id: 'bento-goncalves', name: 'Bento Gonçalves', state: 'RS', country: 'Brasil', popularity: 6 },
  { id: 'balneario-camboriu', name: 'Balneário Camboriú', state: 'SC', country: 'Brasil', popularity: 9 },
  { id: 'bombinhas', name: 'Bombinhas', state: 'SC', country: 'Brasil', popularity: 7 },
  { id: 'joinville', name: 'Joinville', state: 'SC', country: 'Brasil', popularity: 6 },
  { id: 'foz-do-iguacu', name: 'Foz do Iguaçu', state: 'PR', country: 'Brasil', popularity: 9 },
  { id: 'londrina', name: 'Londrina', state: 'PR', country: 'Brasil', popularity: 6 },
  { id: 'tiradentes', name: 'Tiradentes', state: 'MG', country: 'Brasil', popularity: 7 },
  { id: 'ouro-preto', name: 'Ouro Preto', state: 'MG', country: 'Brasil', popularity: 8 },
  { id: 'bonito', name: 'Bonito', state: 'MS', country: 'Brasil', popularity: 8 },
  { id: 'chapada-diamantina', name: 'Chapada Diamantina', state: 'BA', country: 'Brasil', popularity: 7 },
  { id: 'alto-paraiso', name: 'Alto Paraíso de Goiás', state: 'GO', country: 'Brasil', popularity: 6 },

  // === INTERNACIONAL — destinos mais comuns em voo privado ===
  { id: 'miami', name: 'Miami', state: 'FL', country: 'Estados Unidos', popularity: 10 },
  { id: 'orlando', name: 'Orlando', state: 'FL', country: 'Estados Unidos', popularity: 9 },
  { id: 'new-york', name: 'Nova York', state: 'NY', country: 'Estados Unidos', popularity: 10 },
  { id: 'los-angeles', name: 'Los Angeles', state: 'CA', country: 'Estados Unidos', popularity: 9 },
  { id: 'las-vegas', name: 'Las Vegas', state: 'NV', country: 'Estados Unidos', popularity: 8 },
  { id: 'aspen', name: 'Aspen', state: 'CO', country: 'Estados Unidos', popularity: 8 },
  { id: 'punta-del-este', name: 'Punta del Este', state: '', country: 'Uruguai', popularity: 9 },
  { id: 'montevideu', name: 'Montevidéu', state: '', country: 'Uruguai', popularity: 7 },
  { id: 'buenos-aires', name: 'Buenos Aires', state: '', country: 'Argentina', popularity: 9 },
  { id: 'bariloche', name: 'Bariloche', state: '', country: 'Argentina', popularity: 8 },
  { id: 'santiago', name: 'Santiago', state: '', country: 'Chile', popularity: 8 },
  { id: 'lisboa', name: 'Lisboa', state: '', country: 'Portugal', popularity: 9 },
  { id: 'paris', name: 'Paris', state: '', country: 'França', popularity: 9 },
  { id: 'londres', name: 'Londres', state: '', country: 'Reino Unido', popularity: 8 },
  { id: 'madrid', name: 'Madri', state: '', country: 'Espanha', popularity: 8 },
  { id: 'roma', name: 'Roma', state: '', country: 'Itália', popularity: 8 },
  { id: 'dubai', name: 'Dubai', state: '', country: 'Emirados Árabes', popularity: 7 },
];

function normalize(str) {
  return (str || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

/**
 * Search cities by query — ranked by match quality then popularity.
 */
export function searchCities(query) {
  const q = normalize(query);
  if (!q) return [];

  const results = [];
  for (const c of CITIES) {
    const name = normalize(c.name);
    const state = normalize(c.state);
    const country = normalize(c.country);

    let score = 0;
    if (name === q) score = 1000;
    else if (name.startsWith(q)) score = 900;
    else if (name.split(' ').some((w) => w.startsWith(q))) score = 700;
    else if (state === q.toUpperCase().toLowerCase()) score = 600;
    else if (country.startsWith(q)) score = 500;
    else if (name.includes(q)) score = 300;
    else if (country.includes(q)) score = 200;

    if (score > 0) {
      results.push({ ...c, _score: score + (c.popularity || 0) });
    }
  }

  results.sort((a, b) => b._score - a._score);
  return results.slice(0, 6).map(({ _score, ...rest }) => rest);
}
