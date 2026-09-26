import { useEffect, useState } from 'react';

import { PokemonDetail } from '../types/pokemon';

export function usePokemonDetail(name: string | undefined) {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(Boolean(name));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) {
      setPokemon(null);
      setError('No se pudo cargar el Pokémon.');
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function load() {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const data: PokemonDetail = await response.json();

        if (isMounted) {
          setPokemon(data);
          setError(null);
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : 'No se pudo cargar el Pokémon.',
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
  }, [name]);

  return { pokemon, loading, error };
}
