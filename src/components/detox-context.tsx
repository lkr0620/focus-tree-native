import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { deriveGrowthStatus, TARGET_MINUTES, type GrowthStatus, type SeedId } from '@/constants/seeds';

import { useAuth } from './auth-context';

export type { GrowthStatus };

export type GardenEntry = {
  id: string;
  seedId: SeedId;
  elapsedMinutes: number;
  status: 'success' | 'withered';
  date: string; // ISO 'YYYY-MM-DD'
};

type DetoxStorage = {
  selectedSeedId: SeedId | null;
  startedAt: number | null;
  witheredAt: number | null;
  garden: GardenEntry[];
};

type DetoxContextValue = {
  isLoaded: boolean;
  selectedSeedId: SeedId | null;
  startedAt: number | null;
  witheredAt: number | null;
  growthStatus: GrowthStatus;
  garden: GardenEntry[];
  selectSeed: (id: SeedId) => void;
  startGrowing: () => void;
  checkPhone: () => void;
  plantInGarden: () => void;
  startNewDay: () => void;
};

const DetoxContext = createContext<DetoxContextValue | null>(null);

function storageKeyFor(email: string) {
  return `soom:detox:${email}`;
}

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function DetoxProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [selectedSeedId, setSelectedSeedId] = useState<SeedId | null>(null);
  // `startedAt` is the anchor for a growing (or since-completed) session; status is derived from
  // it and `witheredAt` rather than stored directly, so a stale session picked back up after the
  // app was closed for a while resolves correctly on its own (elapsed time past TARGET_MINUTES
  // just reads as "done", exactly as if the app had stayed open).
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [witheredAt, setWitheredAt] = useState<number | null>(null);
  const [garden, setGarden] = useState<GardenEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoaded(false);

    if (!user?.email) {
      setSelectedSeedId(null);
      setStartedAt(null);
      setWitheredAt(null);
      setGarden([]);
      setIsLoaded(true);
      return;
    }

    AsyncStorage.getItem(storageKeyFor(user.email))
      .then(raw => {
        if (!isMounted) {
          return;
        }

        const parsed: DetoxStorage = raw ? JSON.parse(raw) : { selectedSeedId: null, startedAt: null, witheredAt: null, garden: [] };

        setSelectedSeedId(parsed.selectedSeedId ?? null);
        setStartedAt(parsed.startedAt ?? null);
        setWitheredAt(parsed.witheredAt ?? null);
        setGarden(parsed.garden ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) {
          setIsLoaded(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  useEffect(() => {
    if (!isLoaded || !user?.email) {
      return;
    }

    const payload: DetoxStorage = { selectedSeedId, startedAt, witheredAt, garden };
    AsyncStorage.setItem(storageKeyFor(user.email), JSON.stringify(payload)).catch(() => {});
  }, [selectedSeedId, startedAt, witheredAt, garden, isLoaded, user?.email]);

  const growthStatus = deriveGrowthStatus(startedAt, witheredAt, Date.now());

  // Re-renders once a second while growing so `growthStatus` and any elapsed-time display stay
  // live, and self-stops the moment status leaves 'growing' (including the automatic flip to
  // 'done' once TARGET_MINUTES is reached).
  const [, forceTick] = useState(0);
  useEffect(() => {
    if (growthStatus !== 'growing') {
      return;
    }

    const interval = setInterval(() => forceTick(tick => tick + 1), 1000);
    return () => clearInterval(interval);
  }, [growthStatus]);

  const selectSeed = (id: SeedId) => setSelectedSeedId(id);

  const startGrowing = () => {
    setStartedAt(Date.now());
    setWitheredAt(null);
  };

  // The app can't detect a real phone unlock, so "checking your phone" is a self-report: tapping
  // this button is the honest confession that breaks the streak, same as the design's own
  // 📵 지금 폰 확인하기 button.
  const checkPhone = () => {
    if (growthStatus !== 'growing') {
      return;
    }

    setWitheredAt(Date.now());
  };

  const plantInGarden = () => {
    if (!selectedSeedId || growthStatus !== 'done') {
      return;
    }

    const entry: GardenEntry = {
      id: `${todayKey()}-${selectedSeedId}`,
      seedId: selectedSeedId,
      elapsedMinutes: TARGET_MINUTES,
      status: 'success',
      date: todayKey(),
    };

    setGarden(current => [entry, ...current.filter(existing => existing.date !== entry.date)]);
    setSelectedSeedId(null);
    setStartedAt(null);
    setWitheredAt(null);
  };

  const startNewDay = () => {
    setSelectedSeedId(null);
    setStartedAt(null);
    setWitheredAt(null);
  };

  const value: DetoxContextValue = {
    isLoaded,
    selectedSeedId,
    startedAt,
    witheredAt,
    growthStatus,
    garden,
    selectSeed,
    startGrowing,
    checkPhone,
    plantInGarden,
    startNewDay,
  };

  return <DetoxContext.Provider value={value}>{children}</DetoxContext.Provider>;
}

export function useDetox() {
  const context = useContext(DetoxContext);

  if (!context) {
    throw new Error('useDetox must be used within DetoxProvider');
  }

  return context;
}
