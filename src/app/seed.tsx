import { router } from 'expo-router';
import { ScrollView, StyleSheet, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, AvatarMenu, BackHeaderRow } from '@/components/app-header';
import { SeedIcon } from '@/components/detox-icons';
import { useDetox } from '@/components/detox-context';
import { usePreferences } from '@/components/preferences-context';
import { ThemedText } from '@/components/themed-text';
import { seedNames, seedOptions, treeNames } from '@/constants/seeds';
import { BottomTabInset, Fonts, Palette, Spacing } from '@/constants/theme';

const copy = {
  ko: { next: '다음', subtitle: '씨앗마다 자라나는 나무가 달라요', title: '어떤 씨앗을 심을까요?', treeSuffix: '(으)로 자라요' },
  en: { next: 'Next', subtitle: 'Each seed grows into a different tree', title: 'Which seed will you plant?', treeSuffix: '' },
} as const;

export default function SeedScreen() {
  const { language } = usePreferences();
  const { selectedSeedId, selectSeed } = useDetox();
  const text = copy[language];

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <AppHeader right={<AvatarMenu />} />
        <BackHeaderRow onBack={() => router.back()} subtitle={text.subtitle} title={text.title} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.grid}>
              {seedOptions.map(seed => {
                const isSelected = selectedSeedId === seed.id;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={seed.id}
                    onPress={() => selectSeed(seed.id)}
                    style={({ pressed }) => [styles.card, isSelected && styles.cardSelected, pressed && styles.pressed]}>
                    <SeedIcon seedId={seed.id} size={46} />
                    <ThemedText style={styles.seedLabel}>{seedNames[language][seed.id]}</ThemedText>
                    <ThemedText style={styles.treeLabel}>
                      {treeNames[language][seed.id]}
                      {text.treeSuffix}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            disabled={!selectedSeedId}
            onPress={() => router.push('/goal')}
            style={({ pressed }) => [styles.nextButton, !selectedSeedId && styles.nextButtonDisabled, pressed && styles.pressed]}>
            <ThemedText style={styles.nextText}>{text.next}</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Palette.bg,
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: BottomTabInset + 40,
    width: '100%',
  },
  content: {
    maxWidth: 430,
    paddingHorizontal: Spacing.three,
    paddingTop: 18,
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  card: {
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderColor: 'transparent',
    borderRadius: 18,
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 18,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    width: '47%',
  },
  cardSelected: {
    borderColor: Palette.primary,
  },
  seedLabel: {
    color: Palette.text,
    fontFamily: Fonts?.display,
    fontSize: 15,
    marginTop: 10,
  },
  treeLabel: {
    color: Palette.textSoft,
    fontSize: 11.5,
    marginTop: 2,
  },
  footer: {
    backgroundColor: Palette.bg,
    paddingBottom: 20,
    paddingHorizontal: Spacing.three,
    paddingTop: 8,
  },
  nextButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Palette.primary,
    borderRadius: 16,
    justifyContent: 'center',
    maxWidth: 430,
    minHeight: 56,
    shadowColor: 'rgba(123,174,127,0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 18,
    width: '100%',
  },
  nextButtonDisabled: {
    backgroundColor: '#DDD6C8',
    shadowOpacity: 0,
  },
  nextText: {
    color: '#FFFFFF',
    fontFamily: Fonts?.display,
    fontSize: 16,
  },
  pressed: {
    opacity: 0.82,
  },
});
