import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { useFavorites } from '../../src/context/FavoritesContext';
import { usePokemonDetail } from '../../src/hooks/usePokemonDetail';

export default function PokemonDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const { pokemon, loading, error } = usePokemonDetail(name);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { width } = useWindowDimensions();

  const imageSize = width > 600 ? 220 : 150;
  const isFav = pokemon ? isFavorite(pokemon.name) : false;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f5a623" />
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>No se pudo cargar el Pokémon.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: pokemon.name }} />

      <View style={styles.card}>
        <Text style={styles.title}>{pokemon.name}</Text>

        {pokemon.sprites?.front_default ? (
          <Image
            source={{ uri: pokemon.sprites.front_default }}
            style={{ width: imageSize, height: imageSize }}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}

        <Text style={styles.meta}>Tipo: {pokemon.types.map((item) => item.type.name).join(', ')}</Text>
        <Text style={styles.meta}>Altura: {pokemon.height}</Text>
        <Text style={styles.meta}>Peso: {pokemon.weight}</Text>

        <Text style={styles.statTitle}>Estadísticas:</Text>
        {pokemon.stats.map((stat) => (
          <Text key={`${pokemon.name}-${stat.stat.name}`} style={styles.stat}>
            {stat.stat.name}: {stat.base_stat}
          </Text>
        ))}

        <Pressable onPress={() => toggleFavorite(pokemon.name)} style={styles.favoriteButton}>
          <Text style={styles.favoriteText}>
            {isFav ? '★ Quitar de favoritos' : '☆ Agregar a favoritos'}
          </Text>
        </Pressable>

        <Text style={styles.countText}>Favoritos: {favorites.length}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  meta: {
    fontSize: 16,
    marginTop: 8,
  },
  statTitle: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: '700',
  },
  stat: {
    fontSize: 15,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  favoriteButton: {
    marginTop: 20,
    backgroundColor: '#f5a623',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  favoriteText: {
    color: '#fff',
    fontWeight: '700',
  },
  countText: {
    marginTop: 12,
    color: '#555',
  },
  error: {
    color: '#b00020',
    fontSize: 16,
    textAlign: 'center',
  },
  placeholder: {
    width: 150,
    height: 150,
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    color: '#666',
  },
});
