export const seedOptions = [
  { id: 'apple', canopy: '#9BC48E', canopy2: '#7BAE7F', fruit: '#E4785A' },
  { id: 'cherry', canopy: '#F6C9D6', canopy2: '#F3B0C3', fruit: '#E88BAE' },
  { id: 'pine', canopy: '#6FA382', canopy2: '#5C8C6E', fruit: '#4F7C63' },
  { id: 'maple', canopy: '#EFC073', canopy2: '#E7A64A', fruit: '#C97C3D' },
] as const;

export type SeedId = (typeof seedOptions)[number]['id'];

export const seedNames = {
  ko: { apple: '사과씨앗', cherry: '벚꽃씨앗', pine: '소나무씨앗', maple: '단풍씨앗' },
  en: { apple: 'Apple Seed', cherry: 'Cherry Blossom Seed', pine: 'Pine Seed', maple: 'Maple Seed' },
} as const;

export const treeNames = {
  ko: { apple: '사과나무', cherry: '벚나무', pine: '소나무', maple: '단풍나무' },
  en: { apple: 'Apple Tree', cherry: 'Cherry Tree', pine: 'Pine', maple: 'Maple Tree' },
} as const;

export function getSeedOption(id: SeedId) {
  return seedOptions.find(seed => seed.id === id) ?? seedOptions[0];
}

// The whole app runs on one rule: don't check your phone for this many minutes and the tree
// finishes growing. Checking early withers it.
export const TARGET_MINUTES = 120;

export type GrowthStatus = 'idle' | 'growing' | 'done' | 'withered';

// Pure derivation from raw timestamps so any screen can compute live status/elapsed time from
// its own tick without duplicating the rule. `witheredAt` freezes elapsed time at the moment the
// phone was checked; otherwise elapsed keeps counting up to TARGET_MINUTES against `now`.
export function deriveGrowthStatus(startedAt: number | null, witheredAt: number | null, now: number): GrowthStatus {
  if (witheredAt) return 'withered';
  if (!startedAt) return 'idle';
  return (now - startedAt) / 60000 >= TARGET_MINUTES ? 'done' : 'growing';
}

export function elapsedMinutesFor(startedAt: number | null, witheredAt: number | null, now: number): number {
  if (!startedAt) return 0;
  const end = witheredAt ?? now;
  return Math.min(TARGET_MINUTES, Math.max(0, (end - startedAt) / 60000));
}

// Growth reads in three stages as the 2-hour window elapses.
export function growthStageIndex(progressPercent: number): 0 | 1 | 2 {
  if (progressPercent >= 66) return 2;
  if (progressPercent >= 33) return 1;
  return 0;
}

export function formatElapsed(minutes: number, language: 'ko' | 'en' = 'ko') {
  const totalMinutes = Math.max(0, Math.round(minutes));
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if (language === 'en') {
    return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
  }

  return h > 0 ? `${h}시간 ${String(m).padStart(2, '0')}분` : `${m}분`;
}

// "HH:MM" countdown display for the in-progress ring.
export function formatCountdown(minutes: number) {
  const totalSeconds = Math.max(0, Math.round(minutes * 60));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
