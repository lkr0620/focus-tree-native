import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Spacing } from '@/constants/theme';

const settings = [
  {
    title: '집중 알림',
    body: '예약한 집중 시간이 가까워지면 부드럽게 알려줘요.',
    enabled: true,
    icon: { ios: 'bell.fill', android: 'notifications', web: 'notifications' },
  },
  {
    title: '연속 성공 배지',
    body: '매일의 기록과 보상 배지를 홈 화면에 표시해요.',
    enabled: true,
    icon: { ios: 'flame.fill', android: 'local_fire_department', web: 'local_fire_department' },
  },
  {
    title: '나무 학습 카드',
    body: '수집한 나무의 사진, 계절, 짧은 이야기를 보여줘요.',
    enabled: true,
    icon: { ios: 'book.fill', android: 'menu_book', web: 'menu_book' },
  },
] as const;

const goalOptions = [
  { label: '오늘 목표', value: '3시간' },
  { label: '휴식 간격', value: '25분' },
  { label: '방해 앱', value: '7개' },
] as const;

export default function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View>
                <ThemedText style={styles.eyebrow}>SETTINGS</ThemedText>
                <ThemedText style={styles.title}>설정</ThemedText>
              </View>
              <View style={styles.headerIcon}>
                <SymbolView name={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }} tintColor="#204C35" size={24} />
              </View>
            </View>

            <View style={styles.profileCard}>
              <View style={styles.profileMark}>
                <SymbolView name={{ ios: 'leaf.fill', android: 'eco', web: 'eco' }} tintColor="#FFFFFF" size={26} />
              </View>
              <View style={styles.profileCopy}>
                <ThemedText style={styles.profileTitle}>Focus Tree</ThemedText>
                <ThemedText style={styles.profileBody}>오늘도 조용히 숲을 키우는 중이에요.</ThemedText>
              </View>
              <View style={styles.scorePill}>
                <ThemedText style={styles.scoreText}>Lv. 5</ThemedText>
              </View>
            </View>

            <View style={styles.goalGrid}>
              {goalOptions.map(item => (
                <View key={item.label} style={styles.goalCard}>
                  <ThemedText style={styles.goalValue}>{item.value}</ThemedText>
                  <ThemedText style={styles.goalLabel}>{item.label}</ThemedText>
                </View>
              ))}
            </View>

            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>환경 설정</ThemedText>
              <ThemedText style={styles.sectionHint}>3개 켜짐</ThemedText>
            </View>

            <View style={styles.panel}>
              {settings.map((item, index) => (
                <View key={item.title} style={[styles.settingRow, index === settings.length - 1 && styles.lastRow]}>
                  <View style={styles.settingIcon}>
                    <SymbolView name={item.icon} tintColor="#204C35" size={21} />
                  </View>
                  <View style={styles.settingCopy}>
                    <ThemedText style={styles.settingTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.settingBody}>{item.body}</ThemedText>
                  </View>
                  <Switch
                    value={item.enabled}
                    trackColor={{ false: '#DCE5DC', true: '#7EC69A' }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#DCE5DC"
                  />
                </View>
              ))}
            </View>

            <Pressable style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}>
              <View style={styles.actionIcon}>
                <SymbolView name={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }} tintColor="#173C2A" size={22} />
              </View>
              <View style={styles.actionCopy}>
                <ThemedText style={styles.actionTitle}>이번 주 리포트 보기</ThemedText>
                <ThemedText style={styles.actionBody}>집중 패턴과 가장 잘 자란 나무를 확인해요.</ThemedText>
              </View>
              <SymbolView name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} tintColor="#6B7B70" size={22} />
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F4F7F0',
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: BottomTabInset + 104,
    paddingHorizontal: Spacing.three,
    width: '100%',
  },
  content: {
    maxWidth: 430,
    paddingTop: Spacing.four,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  eyebrow: {
    color: '#6D8174',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  title: {
    color: '#132318',
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 39,
  },
  headerIcon: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    shadowColor: '#25422F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    width: 48,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#173C2A',
    borderRadius: 30,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
    padding: 18,
  },
  profileMark: {
    alignItems: 'center',
    backgroundColor: '#2F7A4E',
    borderRadius: 22,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  profileCopy: {
    flex: 1,
  },
  profileTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  profileBody: {
    color: '#CFE2D5',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  scorePill: {
    backgroundColor: '#EAF5EF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  scoreText: {
    color: '#173C2A',
    fontSize: 12,
    fontWeight: '900',
  },
  goalGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    flex: 1,
    minHeight: 86,
    padding: 14,
  },
  goalValue: {
    color: '#132318',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6,
  },
  goalLabel: {
    color: '#68786E',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#132318',
    fontSize: 20,
    fontWeight: '900',
  },
  sectionHint: {
    color: '#6D8174',
    fontSize: 13,
    fontWeight: '800',
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    marginBottom: 14,
    paddingHorizontal: 14,
  },
  settingRow: {
    alignItems: 'center',
    borderBottomColor: '#E8EFE8',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    alignItems: 'center',
    backgroundColor: '#EAF5EF',
    borderRadius: 17,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  settingCopy: {
    flex: 1,
  },
  settingTitle: {
    color: '#132318',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  settingBody: {
    color: '#65766B',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  actionCard: {
    alignItems: 'center',
    backgroundColor: '#DFF2E6',
    borderRadius: 26,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  actionIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 17,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  actionCopy: {
    flex: 1,
  },
  actionTitle: {
    color: '#132318',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  actionBody: {
    color: '#5D6F63',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  pressed: {
    opacity: 0.82,
  },
});
