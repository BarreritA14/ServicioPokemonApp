import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TYPE_STYLES: Record<string, { background: string; text: string }> = {
  normal: { background: '#a8a77a', text: '#fff' },
  fire: { background: '#ee8130', text: '#fff' },
  water: { background: '#6390f0', text: '#fff' },
  electric: { background: '#f7d02c', text: '#2f2f2f' },
  grass: { background: '#7ac74c', text: '#fff' },
  ice: { background: '#96d9d6', text: '#1e2a2a' },
  fighting: { background: '#c22e28', text: '#fff' },
  poison: { background: '#a33ea1', text: '#fff' },
  ground: { background: '#e2bf65', text: '#2f2f2f' },
  flying: { background: '#a98ff3', text: '#fff' },
  psychic: { background: '#f95587', text: '#fff' },
  bug: { background: '#a6b91a', text: '#fff' },
  rock: { background: '#b6a136', text: '#fff' },
  ghost: { background: '#735797', text: '#fff' },
  dragon: { background: '#6f35fc', text: '#fff' },
  dark: { background: '#705746', text: '#fff' },
  steel: { background: '#b7b7ce', text: '#2f2f2f' },
  fairy: { background: '#d685ad', text: '#fff' },
};

export function PokemonTypeBadge({ type }: { type: string }) {
  const style = TYPE_STYLES[type] ?? { background: '#9298a4', text: '#fff' };

  return (
    <View style={[styles.badge, { backgroundColor: style.background }]}>
      <Text style={[styles.text, { color: style.text }]}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'capitalize',
  },
});
