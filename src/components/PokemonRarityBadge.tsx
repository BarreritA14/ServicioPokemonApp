import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PokemonRarity } from '../utils/pokemonRarity';

const RARITY_STYLES: Record<PokemonRarity, { background: string; border: string; text: string }> = {
  NORMAL: { background: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.14)', text: '#eaf2ff' },
  RARO: { background: 'rgba(70,145,202,0.22)', border: 'rgba(125,211,252,0.48)', text: '#dff5ff' },
  EXTRAÑO: { background: 'rgba(151,93,187,0.24)', border: 'rgba(216,180,254,0.5)', text: '#f3e8ff' },
  LEGENDARIO: { background: 'rgba(209,159,58,0.25)', border: 'rgba(255,217,128,0.72)', text: '#fff0bd' },
};

export function PokemonRarityBadge({ rarity }: { rarity: PokemonRarity }) {
  const style = RARITY_STYLES[rarity];

  return (
    <View style={[styles.badge, { backgroundColor: style.background, borderColor: style.border }]}>
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
    borderWidth: 1,
  },
  text: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
