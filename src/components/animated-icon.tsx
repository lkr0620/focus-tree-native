import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { Palette } from '@/constants/theme';

const DURATION = 600;

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, DURATION);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return <Animated.View style={styles.backgroundSolidColor} />;
}

const styles = StyleSheet.create({
  backgroundSolidColor: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Palette.paper,
    zIndex: 1000,
  },
});
