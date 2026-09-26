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

import { PokemonCard } from '../src/components/PokemonCard';
import { useFavorites } from '../src/context/FavoritesContext';
import { usePokemonList } from '../src/hooks/usePokemonList';

export default function HomeScreen() {
  const { pokemons, loading, error } = usePokemonList(20);
  const { favorites } = useFavorites();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f5a623" />
        <Text style={styles.loadingText}>Loading Pokémon...</Text>
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
      <View style={styles.headerWrap}>
        <View>
          <Text style={styles.title}>Pokédex</Text>
          <Text style={styles.subtitle}>Explore the Pokémon world</Text>
        </View>

        <Link href="/favoritos" asChild>
          <Pressable style={styles.favoritesButton}>
            <Text style={styles.favoritesText}>Favorites {favorites.length}</Text>
          </Pressable>
        </Link>
      </View>

      <FlatList
        data={pokemons}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PokemonCard name={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070b14',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#070b14',
  },
  loadingText: {
    marginTop: 12,
    color: '#cbd5e1',
    fontSize: 14,
  },
  error: {
    color: '#fca5a5',
    fontSize: 16,
    textAlign: 'center',
  },
  headerWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 14,
    backgroundColor: '#0b1020',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.15)',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 4,
    color: '#94a3b8',
    fontSize: 13,
  },
  favoritesButton: {
    backgroundColor: '#f5a623',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: '#f5a623',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  favoritesText: {
    color: '#fff',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
