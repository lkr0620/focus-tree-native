import React, { useEffect, useState } from 'react';
import { Animated, Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const TOTAL_TIME = 25 * 60;

export default function HomeScreen() {
  const theme = useTheme();
  const [seconds, setSeconds] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sproutAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, seconds]);

  useEffect(() => {
    Animated.timing(sproutAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => setIsRunning(true));
  }, [sproutAnim]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = (seconds / TOTAL_TIME) * 100;

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.avatar, { borderColor: theme.backgroundSelected }]}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApk3o_rV4JiDmzsenFPD7VHRN9izDjG0BaBP03qTCmoeB1Keel5cuI6mXbxaTq0TxYODsjNuLeBlphk3n3xuby0IlmAeTqg1013beR0GCC5BDbc-AONVCKXlAIIO7vcaFTSb_lD1CFvkpjII5LpXvamQM74-a-G1RY-5yOkd8PHFzcqsOOlrKfMP_2Ase43rx2AeLtSDrqOzu4DPNuzweu0ai-ohNebn44wtUttNyHScbvbtyzOIbgJapeAxRwtLMRzQgwzFNFVb4',
                }}
                style={styles.avatarImage}
              />
            </View>
            <ThemedText style={styles.headerTitle}>Focus Forest</ThemedText>
          </View>
          <View style={[styles.starBadge, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText style={styles.starText}>1,240</ThemedText>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.sproutZone}>
            <Animated.View
              style={[
                styles.sproutContainer,
                {
                  opacity: sproutAnim,
                  transform: [
                    {
                      scale: sproutAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                },
              ]}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNuGV8cZqWzaUj3Zxf2M7DxilzKOi5yQ8ihN7XHT2BGCrqBRwJMw10LuNVenK3UYallXIvzxQEj0sfSmfjfxKPIGPhzWE8nqoUwPXc1Bb20UKnOC9rQEFMDr6WBR7a4qY3KVsVy7IHNemO95xRRTysBJ61dL5oUZh0drIBC1_Vuso22HYPl7Ia2Qj3sAzX0BsL_aSSIp4SBMEt0P-t6TqreThzhy-8zSZN3Ase0kpGThGZO8qO6gl16wum3yGBQ2Wd_rjWyXbvFBU',
                }}
                style={styles.sproutImage}
              />
            </Animated.View>
          </View>

          <View style={styles.messageSection}>
            <ThemedText style={styles.focusMessage}>Focus now</ThemedText>
            <ThemedText style={[styles.subMessage, { color: theme.textSecondary }]}>Your tree is growing.</ThemedText>
          </View>

          <View style={[styles.timerBox, { backgroundColor: theme.background }]}>
            <ThemedText style={styles.timerText}>
              {minutes}:{secs < 10 ? '0' : ''}
              {secs}
            </ThemedText>

            <View style={[styles.progressContainer, { backgroundColor: theme.backgroundSelected }]}>
              <Animated.View
                style={[
                  styles.progressBar,
                  { backgroundColor: theme.text },
                  { width: `${progress}%` },
                ]}
              />
            </View>
          </View>

          <ThemedText style={[styles.quote, { color: theme.textSecondary }]}>
            Small habits build big change.
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.giveUpButton} onPress={() => setShowConfirmModal(true)}>
            <ThemedText style={styles.giveUpLabel}>Give up</ThemedText>
            <View style={[styles.giveUpIcon, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText style={{ fontSize: 20 }}>T</ThemedText>
            </View>
          </Pressable>
          <ThemedText style={[styles.wiltNote, { color: theme.textSecondary }]}>Stopping early may reset progress.</ThemedText>
        </View>
      </SafeAreaView>

      <Modal transparent visible={showConfirmModal} animationType="fade" onRequestClose={() => setShowConfirmModal(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <ThemedText style={styles.modalEmoji}>!</ThemedText>
            <ThemedText style={styles.modalTitle}>Stop this session?</ThemedText>
            <ThemedText style={[styles.modalText, { color: theme.textSecondary }]}>If you stop now, this focus run ends.</ThemedText>

            <Pressable style={[styles.modalButton, { backgroundColor: theme.text }]} onPress={() => setShowConfirmModal(false)}>
              <ThemedText style={[styles.modalButtonText, { color: theme.background }]}>Keep focusing</ThemedText>
            </Pressable>

            <Pressable
              style={styles.modalCancelButton}
              onPress={() => {
                setIsRunning(false);
                setSeconds(TOTAL_TIME);
                setShowConfirmModal(false);
              }}>
              <ThemedText style={[styles.modalCancelText, { color: '#DC2626' }]}>Yes, stop now</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    marginBottom: Spacing.three,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  headerTitle: { fontSize: 24, fontWeight: '700' },
  starBadge: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, borderRadius: 20 },
  starText: { fontSize: 16, fontWeight: '600' },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.three },
  sproutZone: { width: 280, height: 280, justifyContent: 'center', alignItems: 'center' },
  sproutContainer: { width: 200, height: 200 },
  sproutImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  messageSection: { alignItems: 'center', gap: Spacing.one },
  focusMessage: { fontSize: 28, fontWeight: '700' },
  subMessage: { fontSize: 16, opacity: 0.8 },
  timerBox: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  timerText: { fontSize: 48, fontWeight: '700', fontFamily: 'monospace', letterSpacing: -1 },
  progressContainer: { width: 200, height: 12, borderRadius: 6, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 6 },
  quote: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginHorizontal: Spacing.three,
    marginTop: Spacing.three,
    lineHeight: 20,
  },
  footer: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.three },
  giveUpButton: { alignItems: 'center', gap: Spacing.one },
  giveUpLabel: { fontSize: 12, fontWeight: '600', opacity: 0.4 },
  giveUpIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wiltNote: { fontSize: 12, textAlign: 'center', opacity: 0.5 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    width: '80%',
    maxWidth: 400,
    borderRadius: Spacing.four,
    padding: Spacing.four,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.backgroundSelected,
  },
  modalEmoji: { fontSize: 40, marginBottom: Spacing.two },
  modalTitle: { fontSize: 24, fontWeight: '700', marginBottom: Spacing.one },
  modalText: { fontSize: 16, textAlign: 'center', marginBottom: Spacing.three, lineHeight: 22 },
  modalButton: {
    width: '100%',
    paddingVertical: Spacing.three,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  modalButtonText: { fontSize: 16, fontWeight: '600' },
  modalCancelButton: { width: '100%', paddingVertical: Spacing.two, borderRadius: 20 },
  modalCancelText: { fontSize: 16, textAlign: 'center', fontWeight: '500' },
});
