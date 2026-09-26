import React from 'react';
import { StyleSheet, View } from 'react-native';

type HabitatKey =
  | 'forest' | 'ocean' | 'volcano' | 'mountain' | 'astral' | 'storm'
  | 'meadow' | 'industrial' | 'desert' | 'glacier' | 'haunted' | 'toxic';

interface HabitatStyle {
  label: string;
  sky: string;
  horizon: string;
  foreground: string;
  accent: string;
  motif: 'peaks' | 'waves' | 'trees' | 'bolts' | 'crystals' | 'fog' | 'dunes' | 'leaves';
}

const HABITAT_BY_TYPE: Record<string, HabitatKey> = {
  fire: 'volcano', water: 'ocean', grass: 'forest', electric: 'storm',
  ice: 'glacier', psychic: 'astral', ghost: 'haunted', dark: 'haunted',
  dragon: 'mountain', ground: 'desert', rock: 'mountain', fairy: 'meadow',
  flying: 'storm', steel: 'industrial', poison: 'toxic', bug: 'forest',
  fighting: 'mountain', normal: 'meadow',
};

const HABITATS: Record<HabitatKey, HabitatStyle> = {
  forest: { label: 'FOREST CANOPY', sky: '#102b26', horizon: '#1d5845', foreground: '#143b32', accent: '#a3e6a0', motif: 'trees' },
  ocean: { label: 'ABYSSAL CURRENT', sky: '#0b2941', horizon: '#12617a', foreground: '#103b58', accent: '#8be3ed', motif: 'waves' },
  volcano: { label: 'VOLCANIC RIDGE', sky: '#331a20', horizon: '#a34429', foreground: '#5b2824', accent: '#ffc36b', motif: 'peaks' },
  mountain: { label: 'CLOUDSPIRE PEAKS', sky: '#17263e', horizon: '#415b82', foreground: '#253651', accent: '#a7c8ef', motif: 'peaks' },
  astral: { label: 'ASTRAL VEIL', sky: '#241a3b', horizon: '#563b76', foreground: '#33244e', accent: '#e4b6ff', motif: 'crystals' },
  storm: { label: 'TEMPEST SKY', sky: '#172c43', horizon: '#395876', foreground: '#263a54', accent: '#f4d768', motif: 'bolts' },
  meadow: { label: 'ENCHANTED GLADE', sky: '#233443', horizon: '#477b64', foreground: '#285b4b', accent: '#ffc8e2', motif: 'leaves' },
  industrial: { label: 'IRONWORKS', sky: '#1a2932', horizon: '#405765', foreground: '#293b45', accent: '#a9d5da', motif: 'peaks' },
  desert: { label: 'EMBER DUNES', sky: '#432b28', horizon: '#ac7045', foreground: '#795039', accent: '#ffd28a', motif: 'dunes' },
  glacier: { label: 'GLACIAL FRONTIER', sky: '#183342', horizon: '#5797a8', foreground: '#285365', accent: '#c7f2f4', motif: 'peaks' },
  haunted: { label: 'HAUNTED HOLLOW', sky: '#171b36', horizon: '#343454', foreground: '#25243e', accent: '#c8a9ef', motif: 'fog' },
  toxic: { label: 'TOXIC FOGBANK', sky: '#252039', horizon: '#634581', foreground: '#3a2a50', accent: '#d5e67c', motif: 'fog' },
};

export function getPokemonHabitatLabel(primaryType: string): string {
  const habitatKey = HABITAT_BY_TYPE[primaryType.toLowerCase()] ?? 'mountain';
  return HABITATS[habitatKey].label;
}

export function PokemonHabitatBackground({
  name,
  primaryType,
  accent,
}: {
  name: string;
  primaryType: string;
  accent: string;
}) {
  const habitatKey = HABITAT_BY_TYPE[primaryType.toLowerCase()] ?? 'mountain';
  const palette = HABITATS[habitatKey];
  const isLegendary = /mew|mewtwo|lugia|ho-oh|rayquaza|kyogre|groudon|dialga|palkia|giratina|arceus|zekrom|reshiram|xerneas|yveltal|solgaleo|lunala|latios|latias/.test(name.toLowerCase());

  return (
    <View
      style={[
        styles.backdrop,
        {
          backgroundColor: palette.sky,
          borderColor: isLegendary ? accent : `${palette.accent}88`,
        },
      ]}
    >
      <View style={[styles.horizon, { backgroundColor: palette.horizon }]} />
      <View style={[styles.foreground, { backgroundColor: palette.foreground }]} />
      <View style={[styles.halo, { backgroundColor: isLegendary ? accent : palette.accent }]} />
      <View style={[styles.ridge, styles.ridgeBack, { borderBottomColor: palette.horizon }]} />
      <View style={[styles.ridge, styles.ridgeFront, { borderBottomColor: palette.foreground }]} />
      {palette.motif === 'waves' && <View style={styles.waveMotif} />}
      {palette.motif === 'trees' && <View style={styles.treeMotif} />}
      {palette.motif === 'bolts' && <View style={[styles.boltMotif, { borderColor: palette.accent }]} />}
      {palette.motif === 'crystals' && <View style={[styles.crystalMotif, { borderColor: palette.accent }]} />}
      {palette.motif === 'fog' && <View style={styles.fogMotif} />}
      {palette.motif === 'dunes' && <View style={styles.duneMotif} />}
      {palette.motif === 'leaves' && <View style={[styles.leafMotif, { borderColor: palette.accent }]} />}
      <View style={[styles.ring, { borderColor: palette.accent, opacity: isLegendary ? 0.75 : 0.4 }]} />
      <View style={styles.particleOne} />
      <View style={styles.particleTwo} />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  horizon: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '20%',
    height: '45%',
    opacity: 0.62,
  },
  foreground: {
    position: 'absolute',
    left: -30,
    right: -30,
    bottom: -80,
    height: '48%',
    borderRadius: 160,
    opacity: 0.72,
  },
  halo: {
    position: 'absolute',
    top: -26,
    right: -22,
    width: 190,
    height: 190,
    borderRadius: 95,
    opacity: 0.14,
  },
  ring: {
    position: 'absolute',
    width: 180,
    height: 180,
    right: -48,
    bottom: -60,
    borderWidth: 1.5,
    borderRadius: 90,
  },
  ridge: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 110,
    borderRightWidth: 110,
    borderBottomWidth: 130,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    opacity: 0.34,
  },
  ridgeBack: { left: -42, bottom: '14%' },
  ridgeFront: { right: -55, bottom: '9%', transform: [{ scale: 0.82 }] },
  waveMotif: {
    position: 'absolute', left: -20, right: -20, bottom: '17%', height: 52,
    borderTopWidth: 2, borderTopColor: 'rgba(194,242,255,0.38)', borderRadius: 80,
  },
  treeMotif: {
    position: 'absolute', left: 20, bottom: '12%', width: 26, height: 92,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    backgroundColor: 'rgba(8,35,31,0.44)', transform: [{ skewY: '-8deg' }],
  },
  boltMotif: {
    position: 'absolute', top: '17%', right: '17%', width: 25, height: 72,
    borderRightWidth: 3, transform: [{ skewX: '-25deg' }, { rotate: '12deg' }], opacity: 0.72,
  },
  crystalMotif: {
    position: 'absolute', right: '15%', bottom: '15%', width: 42, height: 96,
    borderLeftWidth: 2, borderRightWidth: 2, borderTopWidth: 1,
    transform: [{ skewY: '-12deg' }], opacity: 0.5,
  },
  fogMotif: {
    position: 'absolute', left: '-10%', right: '-10%', bottom: '23%', height: 44,
    borderRadius: 30, backgroundColor: 'rgba(213,197,245,0.12)', transform: [{ skewY: '-5deg' }],
  },
  duneMotif: {
    position: 'absolute', left: '-15%', right: '-15%', bottom: '17%', height: 38,
    borderTopWidth: 2, borderTopColor: 'rgba(255,219,165,0.48)', borderRadius: 90,
  },
  leafMotif: {
    position: 'absolute', right: '17%', top: '20%', width: 34, height: 54,
    borderWidth: 1.5, borderTopLeftRadius: 28, borderBottomRightRadius: 28,
    transform: [{ rotate: '35deg' }], opacity: 0.62,
  },
  particleOne: {
    position: 'absolute', top: '23%', left: '20%', width: 5, height: 5,
    borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.7)',
  },
  particleTwo: {
    position: 'absolute', top: '38%', right: '30%', width: 3, height: 3,
    borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.58)',
  },
});
