export type PokemonRarity = 'NORMAL' | 'RARO' | 'EXTRAÑO' | 'LEGENDARIO';

const POKEMON_RARITY_BY_NAME: Record<string, PokemonRarity> = {
  pikachu: 'NORMAL',
  bulbasaur: 'NORMAL',
  ivysaur: 'NORMAL',
  venusaur: 'NORMAL',
  charmander: 'NORMAL',
  charmeleon: 'NORMAL',
  charizard: 'RARO',
  squirtle: 'NORMAL',
  wartortle: 'NORMAL',
  blastoise: 'RARO',
  eevee: 'NORMAL',
  vaporeon: 'RARO',
  jolteon: 'RARO',
  flareon: 'RARO',
  umbreon: 'RARO',
  sylveon: 'RARO',
  snorlax: 'NORMAL',
  gengar: 'RARO',
  lucario: 'RARO',
  gardevoir: 'RARO',
  greninja: 'RARO',
  dragonite: 'RARO',
  garchomp: 'RARO',
  jigglypuff: 'NORMAL',
  gastly: 'EXTRAÑO',
  haunter: 'EXTRAÑO',
  misdreavus: 'EXTRAÑO',
  rotom: 'EXTRAÑO',
  drifloon: 'EXTRAÑO',
  mantine: 'EXTRAÑO',
  absol: 'EXTRAÑO',
  mew: 'LEGENDARIO',
  mewtwo: 'LEGENDARIO',
  lugia: 'LEGENDARIO',
  'ho-oh': 'LEGENDARIO',
  rayquaza: 'LEGENDARIO',
  kyogre: 'LEGENDARIO',
  groudon: 'LEGENDARIO',
  dialga: 'LEGENDARIO',
  palkia: 'LEGENDARIO',
  giratina: 'LEGENDARIO',
  arceus: 'LEGENDARIO',
  zekrom: 'LEGENDARIO',
  reshiram: 'LEGENDARIO',
  xerneas: 'LEGENDARIO',
  yveltal: 'LEGENDARIO',
  solgaleo: 'LEGENDARIO',
  lunala: 'LEGENDARIO',
  latios: 'LEGENDARIO',
  latias: 'LEGENDARIO',
};

export function getPokemonRarity(id: number, name?: string): PokemonRarity {
  const normalizedName = name?.toLowerCase();

  if (normalizedName && normalizedName in POKEMON_RARITY_BY_NAME) {
    return POKEMON_RARITY_BY_NAME[normalizedName];
  }

  if (id <= 20) return 'NORMAL';
  if (id <= 80) return 'RARO';
  if (id <= 150) return 'EXTRAÑO';
  return 'LEGENDARIO';
}
