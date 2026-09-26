import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PokemonRarity } from '../utils/pokemonRarity';

const RARITY_STYLES: Record<PokemonRarity, { background: string; text: string }> = {
  NORMAL: { background: '#2f3a46', text: '#eaf2ff' },
  RARO: { background: '#355c7d', text: '#eaf2ff' },
  EXTRAÑO: { background: '#6a4b8a', text: '#f6eaff' },
  LEGENDARIO: { background: '#9b6b00', text: '#fff8dd' },
};

export function PokemonRarityBadge({ rarity }: { rarity: PokemonRarity }) {
  const style = RARITY_STYLES[rarity];

  return (
    <View style={[styles.badge, { backgroundColor: style.background }]}>
      <Text style={[styles.text, { color: style.text }]}>{rarity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
