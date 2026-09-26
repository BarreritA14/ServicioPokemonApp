export type PokemonRarity = 'NORMAL' | 'RARO' | 'EXTRAÑO' | 'LEGENDARIO';

export function getPokemonRarity(id: number): PokemonRarity {
  if (id <= 20) return 'NORMAL';
  if (id <= 80) return 'RARO';
  if (id <= 150) return 'EXTRAÑO';
  return 'LEGENDARIO';
}
