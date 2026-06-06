import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const settings = [
  {
    title: '위젯 알림',
    body: '새로운 나무를 발견할 수 있을 때 부드럽게 알려줍니다.',
    enabled: true,
  },
  {
    title: '연속 달성 배지',
    body: '위젯에 매일의 연속 달성 기록을 표시합니다.',
    enabled: true,
  },
  {
    title: '꽃나무 학습 카드',
    body: '각 꽃나무에 대한 짧은 지식을 보여줍니다.',
    enabled: true,
  },
];

export default function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <ThemedText style={styles.kicker}>포커스 숲</ThemedText>
            <ThemedText style={styles.title}>설정</ThemedText>

            <View style={styles.panel}>
              {settings.map(item => (
                <View key={item.title} style={styles.settingRow}>
                  <View style={styles.settingCopy}>
                    <ThemedText style={styles.settingTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.settingBody}>{item.body}</ThemedText>
                  </View>
                  <Switch
                    value={item.enabled}
                    trackColor={{ false: '#E5DED6', true: '#9ED7B8' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFF8F3',
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: BottomTabInset + 104,
    paddingHorizontal: Spacing.three,
  },
  content: {
    maxWidth: MaxContentWidth,
    paddingTop: Spacing.four,
    width: '100%',
  },
  kicker: {
    color: '#8A6F62',
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    color: '#0E0B08',
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 40,
    marginBottom: Spacing.four,
    marginTop: Spacing.two,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: Spacing.three,
  },
  settingRow: {
    alignItems: 'center',
    borderBottomColor: '#F0E5DC',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
  },
  settingCopy: {
    flex: 1,
  },
  settingTitle: {
    color: '#0E0B08',
    fontSize: 17,
    fontWeight: '900',
  },
  settingBody: {
    color: '#8A6F62',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 4,
  },
});
