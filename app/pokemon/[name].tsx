import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  ImageSourcePropType,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PokemonHabitatBackground, getPokemonHabitatLabel } from '../../src/components/PokemonHabitatBackground';
import { PokemonRarityBadge } from '../../src/components/PokemonRarityBadge';
import { PokemonTypeBadge } from '../../src/components/PokemonTypeBadge';
import { useFavorites } from '../../src/context/FavoritesContext';
import { usePokemonDetail } from '../../src/hooks/usePokemonDetail';
import { getPokemonRarity } from '../../src/utils/pokemonRarity';

const TYPE_ACCENTS: Record<string, string> = {
  normal: '#cbd5e1', fire: '#ff9a52', water: '#65c9ef', electric: '#f5d55e',
  grass: '#80d49a', ice: '#a5e6ec', fighting: '#f18a81', poison: '#c18ae6',
  ground: '#e4bc79', flying: '#a5c9f7', psychic: '#ed9bd1', bug: '#b5cc69',
  rock: '#c5b68a', ghost: '#b29ae7', dragon: '#a89af2', dark: '#9da8b6',
  steel: '#b5c8d1', fairy: '#f3afd0',
};

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'ATTACK',
  defense: 'DEFENSE',
  'special-attack': 'SP. ATTACK',
  'special-defense': 'SP. DEFENSE',
  speed: 'SPEED',
};

function formatMeasure(value: number): string {
  return (value / 10).toFixed(1).replace(/\.0$/, '');
}

function formatLabel(value: string): string {
  return value.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function StatBar({
  label,
  value,
  accent,
  animation,
}: {
  label: string;
  value: number;
  accent: string;
  animation: Animated.Value;
}) {
  return (
    <Animated.View style={[styles.statRow, { opacity: animation, transform: [{ translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] }]}>
      <View style={styles.statHeading}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <View style={styles.statTrack}>
        <View style={[styles.statFill, { width: `${Math.min((value / 255) * 100, 100)}%`, backgroundColor: accent }]} />
      </View>
    </Animated.View>
  );
}

export default function PokemonDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const { pokemon, loading, error } = usePokemonDetail(name);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { width } = useWindowDimensions();
  const cardAnimation = useRef(new Animated.Value(0)).current;
  const artworkAnimation = useRef(new Animated.Value(0)).current;
  const statAnimations = useRef(Array.from({ length: 6 }, () => new Animated.Value(0))).current;

  useEffect(() => {
    if (!pokemon) return;

    cardAnimation.setValue(0);
    artworkAnimation.setValue(0);
    statAnimations.forEach((animation) => animation.setValue(0));

    Animated.parallel([
      Animated.timing(cardAnimation, { toValue: 1, duration: 420, useNativeDriver: Platform.OS !== 'web' }),
      Animated.spring(artworkAnimation, { toValue: 1, speed: 1.2, bounciness: 4, useNativeDriver: Platform.OS !== 'web' }),
      Animated.stagger(
        60,
        statAnimations.map((animation) =>
          Animated.timing(animation, { toValue: 1, duration: 260, useNativeDriver: Platform.OS !== 'web' }),
        ),
      ),
    ]).start();
  }, [pokemon?.id, cardAnimation, artworkAnimation, statAnimations]);

  const primaryType = pokemon?.types[0]?.type.name ?? 'normal';
  const accent = TYPE_ACCENTS[primaryType] ?? '#f5a623';
  const rarity = pokemon ? getPokemonRarity(pokemon.id, pokemon.name) : 'NORMAL';
  const isLegendary = rarity === 'LEGENDARIO';
  const isFav = pokemon ? isFavorite(pokemon.name) : false;
  const cardWidth = Math.min(width - 32, 920);
  const heroHeight = width > 600 ? 410 : 350;
  const artworkSize = Math.min(width > 600 ? 350 : width * 0.74, 330);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#f5a623" />
        <Text style={styles.loadingText}>Consultando la Pokédex...</Text>
      </SafeAreaView>
    );
  }

  if (error || !pokemon) {
    return (
      <SafeAreaView style={styles.centered}>
        <Stack.Screen options={{ headerShown: false }} />
        <Pressable onPress={handleBack} style={styles.errorBackButton}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>PokeApi</Text>
        </Pressable>
        <Text style={styles.error}>{error ?? 'No se pudo cargar el Pokémon.'}</Text>
      </SafeAreaView>
    );
  }

  const artwork = pokemon.sprites.other?.['official-artwork']?.front_default ?? pokemon.sprites.front_default;
  const imageSource: ImageSourcePropType | null = artwork ? { uri: artwork } : null;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.pageWidth, { width: cardWidth }]}>
          <View style={styles.navigationRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver a PokeApi"
              onPress={handleBack}
              style={styles.backButton}
            >
              <Text style={styles.backArrow}>←</Text>
              <Text style={styles.backLabel}>PokeApi</Text>
            </Pressable>
            <Text style={styles.navigationCaption}>POKÉMON ARCHIVE</Text>
          </View>

          <Animated.View
            style={[
              styles.card,
              isLegendary && styles.legendaryCard,
              {
                opacity: cardAnimation,
                transform: [{ translateY: cardAnimation.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
              },
            ]}
          >
            <View style={[styles.hero, { height: heroHeight }]}>
              <PokemonHabitatBackground
                name={pokemon.name}
                primaryType={primaryType}
                accent={accent}
              />
              <View style={styles.heroTopRow}>
                <Text style={styles.pokedexNumber}>NO. {String(pokemon.id).padStart(3, '0')}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  onPress={() => toggleFavorite(pokemon.name)}
                  style={[styles.favoriteButton, isFav && styles.favoriteButtonActive]}
                >
                  <Text style={[styles.favoriteIcon, isFav && styles.favoriteIconActive]}>{isFav ? '★' : '☆'}</Text>
                </Pressable>
              </View>

              <View style={styles.heroTitleBlock}>
                <Text style={styles.heroEyebrow}>FIELD RECORD  /  {primaryType.toUpperCase()}</Text>
                <Text adjustsFontSizeToFit numberOfLines={1} style={styles.heroName}>
                  {pokemon.name.toUpperCase()}
                </Text>
                <Text style={styles.heroHabitat}>{getPokemonHabitatLabel(primaryType)}</Text>
              </View>

              {imageSource ? (
                <Animated.Image
                  accessibilityLabel={`${pokemon.name} official artwork`}
                  source={imageSource}
                  resizeMode="contain"
                  style={[
                    styles.artwork,
                    {
                      width: artworkSize,
                      height: artworkSize,
                      opacity: artworkAnimation,
                      transform: [{ scale: artworkAnimation.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] }) }],
                    },
                  ]}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>SIN IMAGEN</Text>
                </View>
              )}

              {isLegendary && (
                <View style={styles.legendarySparkles}>
                  <View style={styles.sparkleLarge} />
                  <View style={styles.sparkleSmall} />
                </View>
              )}
            </View>

            <View style={styles.cardBody}>
              <View style={styles.badgesRow}>
                <PokemonRarityBadge rarity={rarity} />
                {pokemon.types.map((item) => (
                  <PokemonTypeBadge key={`${pokemon.name}-${item.type.name}`} type={item.type.name} />
                ))}
              </View>

              <View style={styles.measureRow}>
                <View style={styles.measureCell}>
                  <Text style={styles.sectionEyebrow}>HEIGHT</Text>
                  <Text style={styles.measureValue}>{formatMeasure(pokemon.height)}<Text style={styles.measureUnit}> m</Text></Text>
                </View>
                <View style={styles.measureDivider} />
                <View style={styles.measureCell}>
                  <Text style={styles.sectionEyebrow}>WEIGHT</Text>
                  <Text style={styles.measureValue}>{formatMeasure(pokemon.weight)}<Text style={styles.measureUnit}> kg</Text></Text>
                </View>
                <View style={styles.measureDivider} />
                <View style={styles.measureCell}>
                  <Text style={styles.sectionEyebrow}>POKÉDEX</Text>
                  <Text style={styles.measureValue}>#{String(pokemon.id).padStart(3, '0')}</Text>
                </View>
              </View>

              <View style={styles.sectionHeading}>
                <Text style={styles.sectionTitle}>Abilities</Text>
                <Text style={styles.sectionEyebrow}>POKÉMON DATA</Text>
              </View>
              <View style={styles.abilitiesRow}>
                {pokemon.abilities.map((entry) => (
                  <View key={entry.ability.name} style={styles.abilityChip}>
                    <Text style={styles.abilityName}>{formatLabel(entry.ability.name)}</Text>
                    {entry.is_hidden && <Text style={styles.hiddenAbility}>HIDDEN</Text>}
                  </View>
                ))}
              </View>

              <View style={styles.sectionHeading}>
                <Text style={styles.sectionTitle}>Base stats</Text>
                <Text style={styles.sectionEyebrow}>BASE / 255</Text>
              </View>
              <View style={styles.statsPanel}>
                {pokemon.stats.map((stat, index) => (
                  <StatBar
                    key={`${pokemon.name}-${stat.stat.name}`}
                    label={STAT_LABELS[stat.stat.name] ?? formatLabel(stat.stat.name).toUpperCase()}
                    value={stat.base_stat}
                    accent={accent}
                    animation={statAnimations[index] ?? statAnimations[statAnimations.length - 1]}
                  />
                ))}
              </View>

              <Text style={styles.collectionCount}>YOUR COLLECTION  ·  {favorites.length} FAVORITES</Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080d17',
  },
  scrollContent: { alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 36 },
  pageWidth: { maxWidth: 920, alignSelf: 'center' },
  navigationRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { minHeight: 42, flexDirection: 'row', alignItems: 'center', paddingRight: 12 },
  errorBackButton: { minHeight: 44, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  backArrow: { color: '#f4f6fb', fontSize: 25, marginRight: 10, lineHeight: 29 },
  backLabel: { color: '#f4f6fb', fontSize: 15, fontWeight: '700' },
  navigationCaption: { color: '#8290a6', fontSize: 10, fontWeight: '700', letterSpacing: 1.4 },
  card: {
    overflow: 'hidden', backgroundColor: '#0e1522', borderRadius: 24,
    borderWidth: 1, borderColor: 'rgba(181,198,220,0.2)',
    elevation: 10,
  },
  legendaryCard: {
    borderColor: 'rgba(255,211,119,0.72)',
  },
  hero: { position: 'relative', overflow: 'hidden', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.12)' },
  heroTopRow: {
    zIndex: 2, position: 'absolute', top: 20, left: 22, right: 22,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  pokedexNumber: { color: 'rgba(255,255,255,0.82)', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  favoriteButton: {
    width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.44)', backgroundColor: 'rgba(6,13,24,0.38)',
  },
  favoriteButtonActive: { backgroundColor: 'rgba(255,211,119,0.2)', borderColor: '#ffd377' },
  favoriteIcon: { color: '#fff', fontSize: 23, lineHeight: 27 },
  favoriteIconActive: { color: '#ffd377' },
  heroTitleBlock: { position: 'absolute', zIndex: 2, top: 78, left: 24, right: 24 },
  heroEyebrow: { color: 'rgba(255,255,255,0.72)', fontSize: 9, fontWeight: '800', letterSpacing: 1.7 },
  heroName: {
    color: '#fff', fontSize: 34, fontWeight: '900', marginTop: 5,
  },
  heroHabitat: { color: 'rgba(255,255,255,0.78)', fontSize: 10, fontWeight: '700', letterSpacing: 1.4, marginTop: 4 },
  artwork: {
    position: 'absolute', zIndex: 1, bottom: 2, alignSelf: 'center',
  },
  imagePlaceholder: {
    position: 'absolute', alignSelf: 'center', bottom: 42, width: 170, height: 170,
    borderRadius: 85, borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(9,16,27,0.32)',
  },
  placeholderText: { color: '#dbeafe', fontSize: 11, fontWeight: '700' },
  legendarySparkles: { position: 'absolute', zIndex: 2, top: 118, right: 32, width: 54, height: 54, pointerEvents: 'none' },
  sparkleLarge: { position: 'absolute', top: 4, left: 20, width: 2, height: 34, backgroundColor: '#fff0bd', transform: [{ rotate: '45deg' }] },
  sparkleSmall: { position: 'absolute', top: 20, left: 4, width: 2, height: 20, backgroundColor: '#fff0bd', transform: [{ rotate: '-45deg' }] },
  cardBody: { paddingHorizontal: 24, paddingTop: 22, paddingBottom: 20 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 },
  measureRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 24,
    paddingVertical: 18, borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: 'rgba(174,191,214,0.15)',
  },
  measureCell: { flex: 1, alignItems: 'center', minWidth: 0 },
  measureDivider: { width: 1, height: 36, backgroundColor: 'rgba(174,191,214,0.18)' },
  sectionEyebrow: { color: '#8290a6', fontSize: 9, fontWeight: '800', letterSpacing: 1.3 },
  measureValue: { color: '#f5f7fb', fontSize: 20, fontWeight: '800', marginTop: 5 },
  measureUnit: { color: '#a5b0c0', fontSize: 12, fontWeight: '600' },
  sectionHeading: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { color: '#f5f7fb', fontSize: 18, fontWeight: '800' },
  abilitiesRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 25 },
  abilityChip: {
    minHeight: 36, flexDirection: 'row', alignItems: 'center', marginRight: 8, marginBottom: 8,
    paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(166,184,208,0.2)',
    backgroundColor: 'rgba(255,255,255,0.045)',
  },
  abilityName: { color: '#d9e2ef', fontSize: 11, fontWeight: '700' },
  hiddenAbility: { color: '#d7bd7b', fontSize: 8, fontWeight: '800', marginLeft: 8 },
  statsPanel: { paddingVertical: 4 },
  statRow: { marginBottom: 13 },
  statHeading: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  statLabel: { color: '#aab5c5', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  statValue: { color: '#f4f6fb', fontSize: 11, fontWeight: '800', fontVariant: ['tabular-nums'] },
  statTrack: { height: 5, borderRadius: 4, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)' },
  statFill: { height: '100%', borderRadius: 4 },
  collectionCount: { color: '#69778d', fontSize: 9, fontWeight: '800', letterSpacing: 1.1, marginTop: 10, textAlign: 'right' },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#080d17',
  },
  loadingText: { color: '#a5b0c0', fontSize: 13, marginTop: 14 },
  error: { color: '#fca5a5', fontSize: 16, textAlign: 'center', marginTop: 24 },
});
