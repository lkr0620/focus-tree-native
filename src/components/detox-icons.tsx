import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { getSeedOption, type SeedId } from '@/constants/seeds';
import { Palette } from '@/constants/theme';

// Small hand-tuned sprout mark used as the brand logo — a ring-colored badge holding a stem and
// two leaves, with an optional soil-toned base at larger sizes. Ported from the design's three
// hand-placed instances (22 / 64 / 88px) rather than a single formula, since the source design
// tuned each size individually instead of deriving them from one.
const SPROUT_PRESETS = {
  sm: { badge: 22, stemW: 1.5, stemH: 8, stemBottom: 3, leafW: 8, leafH: 6, leafBottom: 5, base: null },
  md: {
    badge: 64,
    stemW: 2,
    stemH: 16,
    stemBottom: 16,
    leafW: 15,
    leafH: 10,
    leafBottom: 24,
    base: { w: 12, h: 9, bottom: 13 },
  },
  lg: {
    badge: 88,
    stemW: 2.5,
    stemH: 22,
    stemBottom: 26,
    leafW: 20,
    leafH: 14,
    leafBottom: 40,
    base: { w: 16, h: 12, bottom: 22 },
  },
} as const;

export function SproutIcon({ variant = 'sm', animated = false }: { variant?: keyof typeof SPROUT_PRESETS; animated?: boolean }) {
  const preset = SPROUT_PRESETS[variant];
  const offset = useSharedValue(0);

  useEffect(() => {
    if (!animated) {
      return;
    }

    offset.value = withRepeat(withTiming(-4, { duration: 1700, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [animated]);

  const bobStyle = useAnimatedStyle(() => ({ transform: [{ translateY: offset.value }] }));

  return (
    <Animated.View style={[{ width: preset.badge, height: preset.badge, borderRadius: preset.badge / 2, backgroundColor: Palette.ring }, animated && bobStyle]}>
      <View
        style={{
          position: 'absolute',
          left: preset.badge / 2 - preset.stemW / 2,
          bottom: preset.stemBottom,
          width: preset.stemW,
          height: preset.stemH,
          backgroundColor: Palette.primaryDark,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: preset.badge / 2 - preset.leafW * 0.85,
          bottom: preset.leafBottom,
          width: preset.leafW,
          height: preset.leafH,
          backgroundColor: Palette.primary,
          borderTopLeftRadius: 0,
          borderTopRightRadius: preset.leafH,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: preset.leafH,
          transform: [{ rotate: '4deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: preset.badge / 2 + preset.leafW * 0.02,
          bottom: preset.leafBottom,
          width: preset.leafW,
          height: preset.leafH,
          backgroundColor: Palette.primaryDark,
          borderTopLeftRadius: preset.leafH,
          borderTopRightRadius: 0,
          borderBottomRightRadius: preset.leafH,
          borderBottomLeftRadius: 0,
          transform: [{ rotate: '-4deg' }],
        }}
      />
      {preset.base ? (
        <View
          style={{
            position: 'absolute',
            left: preset.badge / 2 - preset.base.w / 2,
            bottom: preset.base.bottom,
            width: preset.base.w,
            height: preset.base.h,
            backgroundColor: Palette.brown,
            borderRadius: preset.base.h / 2,
          }}
        />
      ) : null}
    </Animated.View>
  );
}

// A specific seed's icon: two colored leaves plus a fruit-toned seed body. Unlike SproutIcon,
// this one is a genuine size formula (ported from the design's `seedIconParts`) since every
// instance in the source used the same proportions, just at different pixel sizes.
export function SeedIcon({ seedId, size }: { seedId: SeedId; size: number }) {
  const seed = getSeedOption(seedId);
  const leafW = size * 0.62;
  const leafH = size * 0.42;
  const bodyW = size * 0.5;
  const bodyH = size * 0.36;
  const leafBottom = size * 0.7 * 0.62;
  const bodyBottom = size * 0.7 * 0.32;

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <View
        style={{
          position: 'absolute',
          left: size / 2 - leafW * 0.88,
          bottom: leafBottom,
          width: leafW,
          height: leafH,
          backgroundColor: seed.canopy2,
          borderTopLeftRadius: 0,
          borderTopRightRadius: leafH,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: leafH,
          transform: [{ rotate: '4deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: size / 2 + leafW * 0.02,
          bottom: leafBottom,
          width: leafW,
          height: leafH,
          backgroundColor: seed.canopy,
          borderTopLeftRadius: leafH,
          borderTopRightRadius: 0,
          borderBottomRightRadius: leafH,
          borderBottomLeftRadius: 0,
          transform: [{ rotate: '-4deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: size / 2 - bodyW / 2,
          bottom: bodyBottom,
          width: bodyW,
          height: bodyH,
          backgroundColor: seed.fruit,
          borderRadius: Math.min(bodyW, bodyH) / 2,
        }}
      />
    </View>
  );
}

const FRUIT_SPOTS = [
  { dx: -0.22, dy: 0.1 },
  { dx: 0.18, dy: -0.05 },
  { dx: 0.02, dy: 0.24 },
] as const;

// The tree shown on the growing screen: trunk + two overlapping canopy circles that grow with
// `progress` (0-100), plus up to three fruit dots once the canopy fills in past 55%. Withered
// trees render a single grayed, tilted canopy instead.
export function GrowingTree({ seedId, progress, status, size = 220 }: { seedId: SeedId; progress: number; status: 'growing' | 'withered'; size?: number }) {
  const seed = getSeedOption(seedId);
  const withered = status === 'withered';
  const p = Math.max(0.32, progress / 100);
  const trunkH = Math.round(14 + p * 90);
  const canopyD = Math.round(26 + p * 130);
  const sway = useSharedValue(0);

  useEffect(() => {
    if (withered) {
      return;
    }

    sway.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [withered]);

  const backSway = useAnimatedStyle(() => ({ transform: [{ rotate: `${(sway.value - 0.5) * 4}deg` }] }));
  const frontSway = useAnimatedStyle(() => ({ transform: [{ rotate: `${(0.5 - sway.value) * 4}deg` }] }));

  const groundY = 14;
  const canopyCenterY = groundY + trunkH - canopyD * 0.28 + canopyD / 2;
  const canopyCenterX = size / 2;
  const frontD = canopyD * 0.82;

  const showFruits = !withered && progress >= 55;

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <View
        style={{
          position: 'absolute',
          left: canopyCenterX - 50,
          bottom: 2,
          width: 100,
          height: 18,
          borderRadius: 999,
          backgroundColor: 'rgba(140,110,84,0.14)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: canopyCenterX - 7,
          bottom: groundY,
          width: 14,
          height: trunkH,
          borderRadius: 4,
          backgroundColor: withered ? '#A68A6B' : Palette.brown,
        }}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: canopyCenterX - canopyD / 2,
            bottom: canopyCenterY - canopyD / 2,
            width: canopyD,
            height: canopyD,
            borderRadius: canopyD / 2,
            backgroundColor: withered ? '#C7B79C' : seed.canopy2,
            opacity: withered ? 0.85 : 1,
          },
          withered ? { transform: [{ rotate: '-8deg' }, { scaleY: 0.85 }] } : backSway,
        ]}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: canopyCenterX - frontD / 2 - canopyD * 0.14,
            bottom: canopyCenterY - frontD / 2 + canopyD * 0.06,
            width: frontD,
            height: frontD,
            borderRadius: frontD / 2,
            backgroundColor: withered ? '#D8CBB2' : seed.canopy,
            opacity: withered ? 0.85 : 1,
          },
          withered ? { transform: [{ rotate: '-8deg' }, { scaleY: 0.85 }] } : frontSway,
        ]}
      />
      {showFruits
        ? FRUIT_SPOTS.map((spot, index) => (
            <View
              key={index}
              style={{
                position: 'absolute',
                left: canopyCenterX + spot.dx * canopyD - 5,
                bottom: canopyCenterY + spot.dy * canopyD - 5,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: seed.fruit,
              }}
            />
          ))
        : null}
    </View>
  );
}

// The decorative canopy backdrop for the garden (monthly calendar) screen — a big, static
// two-layer circle behind the day-fruit grid, plus trunk and ground. Unlike GrowingTree, this one
// never changes shape; only the fruit overlay (rendered by the caller) varies.
export function GardenTreeBackdrop({ size = 300 }: { size?: number }) {
  const center = size / 2;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View
        style={{
          position: 'absolute',
          left: center - 130,
          top: center - 130,
          width: 260,
          height: 260,
          borderRadius: 130,
          backgroundColor: Palette.primaryDark,
          opacity: 0.18,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: center - 114 - 3,
          top: center - 114 - 7,
          width: 228,
          height: 228,
          borderRadius: 114,
          backgroundColor: Palette.primary,
          opacity: 0.14,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: center - 11,
          bottom: -38,
          width: 22,
          height: 60,
          borderRadius: 6,
          backgroundColor: Palette.brown,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: center - 45,
          bottom: -46,
          width: 90,
          height: 16,
          borderRadius: 999,
          backgroundColor: 'rgba(140,110,84,0.16)',
        }}
      />
    </View>
  );
}

export type CalendarFruit = {
  day: number;
  left: number;
  top: number;
  size: number;
  opacity: number;
  background: string;
  borderWidth: number;
  borderColor: string;
  borderStyle: 'solid' | 'dashed';
  rotateDeg: number;
  isToday: boolean;
};

export type GardenDayEntry = { day: number; seedId: SeedId; status: 'success' | 'withered' };

const PENDING_BORDER = 'rgba(140,110,84,0.4)';

// Places one dot per day-of-month onto the garden canopy in a disk (not grid) layout, so the
// month reads as a single round canopy full of fruit rather than a spreadsheet. Ported from the
// design's `buildTreeFruits` square-to-disk mapping. Successful days use that day's own seed
// colors (fruit fill, canopy ring) so the calendar shows what was actually planted, not just
// done-vs-not.
export function buildCalendarFruits(daysInMonth: number, todayDay: number, entries: GardenDayEntry[], size = 300): CalendarFruit[] {
  const cols = 7;
  const center = size / 2;
  const canopyR = (size / 300) * 128;
  const squareToDisk = (u: number, v: number): [number, number] => [
    u * Math.sqrt(Math.max(0, 1 - (v * v) / 2)),
    v * Math.sqrt(Math.max(0, 1 - (u * u) / 2)),
  ];

  const fruits: CalendarFruit[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const col = (day - 1) % cols;
    const row = Math.floor((day - 1) / cols);
    const u = (col - 3) / 3.3;
    const v = (row - 2) / 2.6;
    const [x, y] = squareToDisk(u, v);
    const left = center + x * canopyR;
    const top = center + y * canopyR;
    const isToday = day === todayDay;
    const entry = entries.find(e => e.day === day);

    let background = 'transparent';
    let size2 = 9;
    let opacity = 0.4;
    let borderWidth = 1.5;
    let borderColor = PENDING_BORDER;
    let borderStyle: 'solid' | 'dashed' = 'dashed';
    let rotateDeg = 0;

    if (entry) {
      const entrySeed = getSeedOption(entry.seedId);

      if (entry.status === 'success') {
        background = entrySeed.fruit;
        size2 = 15;
        opacity = 1;
        borderWidth = 2;
        borderColor = entrySeed.canopy2;
        borderStyle = 'solid';
      } else {
        background = '#8F7A5E';
        size2 = 12;
        opacity = 0.75;
        borderWidth = 0;
        rotateDeg = 14;
      }
    } else if (isToday) {
      background = Palette.accent;
      size2 = 12;
      opacity = 1;
      borderWidth = 0;
    }

    fruits.push({ day, left, top, size: size2, opacity, background, borderWidth, borderColor, borderStyle, rotateDeg, isToday });
  }

  return fruits;
}
