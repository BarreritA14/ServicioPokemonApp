import { Link } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFavorites } from '../src/context/FavoritesContext';
import { usePokemonList } from '../src/hooks/usePokemonList';

export default function HomeScreen() {
  const { pokemons, loading, error } = usePokemonList(20);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f5a623" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Pokémon</Text>
        <Link href="/favoritos" asChild>
          <Pressable style={styles.favoritesButton}>
            <Text style={styles.favoritesText}>Ver favoritos ({favorites.length})</Text>
          </Pressable>
        </Link>
      </View>

      <FlatList
        data={pokemons}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const favorite = isFavorite(item);

          return (
            <View style={styles.row}>
              <Pressable onPress={() => toggleFavorite(item)} style={styles.starButton}>
                <Text style={styles.star}>{favorite ? '★' : '☆'}</Text>
              </Pressable>

              <Link href={{ pathname: '/pokemon/[name]', params: { name: item } }} asChild>
                <Pressable style={styles.nameButton}>
                  <Text style={styles.name}>{item}</Text>
                </Pressable>
              </Link>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  error: {
    color: '#b00020',
    fontSize: 16,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  favoritesButton: {
    backgroundColor: '#f5a623',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  favoritesText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  starButton: {
    paddingRight: 10,
  },
  star: {
    fontSize: 22,
    color: '#f5a623',
  },
  nameButton: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    textTransform: 'capitalize',
  },
});
