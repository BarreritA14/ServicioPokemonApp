import { Link } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFavorites } from '../src/context/FavoritesContext';

export default function FavoritosScreen() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  if (!favorites.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No tienes Pokémon favoritos todavía.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Pressable onPress={() => toggleFavorite(item)} style={styles.starButton}>
              <Text style={styles.star}>{isFavorite(item) ? '★' : '☆'}</Text>
            </Pressable>

            <Link href={{ pathname: '/pokemon/[name]', params: { name: item } }} asChild>
              <Pressable style={styles.nameButton}>
                <Text style={styles.name}>{item}</Text>
              </Pressable>
            </Link>
          </View>
        )}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
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
