import { Link } from 'expo-router';
import React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFavorites } from '../context/FavoritesContext';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { getPokemonRarity } from '../utils/pokemonRarity';
import { PokemonRarityBadge } from './PokemonRarityBadge';
import { PokemonTypeBadge } from './PokemonTypeBadge';

interface PokemonCardProps {
  name: string;
}

const screenWidth = Dimensions.get('window').width;
const isTwoColumn = screenWidth > 680;
const cardWidth = isTwoColumn ? (screenWidth - 48) / 2 : screenWidth - 32;

const TYPE_COLORS: Record<string, { start: string; end: string; glow: string }> = {
  fire: { start: '#f97316', end: '#fb923c', glow: '#fef3c7' },
  water: { start: '#3b82f6', end: '#38bdf8', glow: '#dbeafe' },
  grass: { start: '#22c55e', end: '#4ade80', glow: '#dcfce7' },
  electric: { start: '#facc15', end: '#fef08a', glow: '#fef9c3' },
  ice: { start: '#67e8f9', end: '#93c5fd', glow: '#ecfeff' },
  psychic: { start: '#ec4899', end: '#c084fc', glow: '#fdf2f8' },
  dark: { start: '#374151', end: '#64748b', glow: '#e5e7eb' },
  dragon: { start: '#4f46e5', end: '#8b5cf6', glow: '#e0e7ff' },
  normal: { start: '#94a3b8', end: '#cbd5e1', glow: '#f8fafc' },
  bug: { start: '#84cc16', end: '#bef264', glow: '#f7fee7' },
  ground: { start: '#d97706', end: '#fbbf24', glow: '#fffbeb' },
  poison: { start: '#a855f7', end: '#c084fc', glow: '#faf5ff' },
  flying: { start: '#60a5fa', end: '#a5b4fc', glow: '#eff6ff' },
  fairy: { start: '#f472b6', end: '#f9a8d4', glow: '#fdf2f8' },
  fighting: { start: '#ef4444', end: '#fca5a5', glow: '#fef2f2' },
  rock: { start: '#a16207', end: '#fbbf24', glow: '#fffbeb' },
  ghost: { start: '#7c3aed', end: '#a78bfa', glow: '#f3e8ff' },
  steel: { start: '#64748b', end: '#cbd5e1', glow: '#f8fafc' },
};

function getThemeForTypes(types: string[]) {
  const primaryType = types[0] ?? 'normal';
  return TYPE_COLORS[primaryType] ?? TYPE_COLORS.normal;
}

export function PokemonCard({ name }: PokemonCardProps) {
  const { pokemon } = usePokemonDetail(name);
  const { isFavorite, toggleFavorite } = useFavorites();
  const rarity = pokemon ? getPokemonRarity(pokemon.id) : 'NORMAL';
  const colors = pokemon ? getThemeForTypes(pokemon.types.map((item) => item.type.name)) : TYPE_COLORS.normal;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 7,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const favorite = isFavorite(name);

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <Link href={{ pathname: '/pokemon/[name]', params: { name } }} asChild>
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.pressable}>
          <View
            style={[
              styles.card,
              {
                width: cardWidth,
                backgroundColor: '#111827',
                shadowColor: colors.glow,
              },
            ]}
          >
            <View style={[styles.glow, { backgroundColor: colors.start, opacity: 0.75 }]} />
            <View style={[styles.highlight, { backgroundColor: colors.end, opacity: 0.45 }]} />

            <View style={styles.headerRow}>
              <Text style={styles.number}>#{pokemon ? String(pokemon.id).padStart(3, '0') : '...'}</Text>
              <Pressable
                onPress={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  toggleFavorite(name);
                }}
                style={styles.favoriteButton}
              >
                <Text style={styles.favoriteText}>{favorite ? '★' : '☆'}</Text>
              </Pressable>
            </View>

            <View style={styles.imageWrap}>
              {pokemon?.sprites?.front_default ? (
                <Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} resizeMode="contain" />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>No image</Text>
                </View>
              )}
            </View>

            <Text style={styles.name}>{name}</Text>

            <View style={styles.badgesRow}>
              <PokemonRarityBadge rarity={rarity} />
            </View>

            <View style={styles.typesRow}>
              {pokemon?.types?.map((item) => (
                <PokemonTypeBadge key={`${name}-${item.type.name}`} type={item.type.name} />
              ))}
            </View>
          </View>
        </Pressable>
      </Link>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  pressable: {
    alignSelf: 'flex-start',
  },
  card: {
    borderRadius: 24,
    minHeight: 260,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  highlight: {
    position: 'absolute',
    right: -20,
    top: -18,
    width: 110,
    height: 110,
    borderRadius: 55,
    opacity: 0.45,
  },
  headerRow: {
    position: 'relative',
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  number: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  favoriteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(17,24,39,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  favoriteText: {
    fontSize: 18,
    color: '#facc15',
    includeFontPadding: false,
  },
  imageWrap: {
    position: 'relative',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    height: 118,
  },
  image: {
    width: 110,
    height: 110,
  },
  placeholder: {
    width: 110,
    height: 110,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#dbeafe',
    fontSize: 12,
  },
  name: {
    position: 'relative',
    zIndex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  badgesRow: {
    position: 'relative',
    zIndex: 1,
    marginTop: 4,
    marginBottom: 8,
  },
  typesRow: {
    position: 'relative',
    zIndex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
