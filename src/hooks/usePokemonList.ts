import { useEffect, useState } from 'react';

import { PokemonListResponse } from '../types/pokemon';

export function usePokemonList(limit = 20) {
  const [pokemons, setPokemons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`,
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const data: PokemonListResponse = await response.json();

        if (isMounted) {
          setPokemons(data.results.map((pokemon) => pokemon.name));
          setError(null);
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : 'No se pudo cargar la lista de Pokémon.',
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { pokemons, loading, error };
}
