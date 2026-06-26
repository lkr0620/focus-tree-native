import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Spacing } from '@/constants/theme';

const stats = [
  { label: '이번 주 호흡', value: '8회' },
  { label: '총 집중 시간', value: '6시간 20분' },
  { label: '연속 기록', value: '5일' },
] as const;

export default function StatsScreen() {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View>
                <ThemedText style={styles.kicker}>SOOM REPORT</ThemedText>
                <ThemedText style={styles.title}>통계</ThemedText>
              </View>
              <View style={styles.headerIcon}>
                <SymbolView name={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }} tintColor="#4B6D51" size={24} />
              </View>
            </View>

            <View style={styles.panel}>
              {stats.map((item, index) => (
                <View key={item.label} style={[styles.row, index === stats.length - 1 && styles.lastRow]}>
                  <ThemedText style={styles.rowLabel}>{item.label}</ThemedText>
                  <ThemedText style={styles.rowValue}>{item.value}</ThemedText>
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
    backgroundColor: '#FAFBF7',
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
  kicker: {
    color: '#7D847D',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginBottom: 5,
  },
  title: {
    color: '#20221F',
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
    width: 48,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 18,
  },
  row: {
    alignItems: 'center',
    borderBottomColor: '#EEF0EA',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 70,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    color: '#687066',
    fontSize: 15,
    fontWeight: '800',
  },
  rowValue: {
    color: '#4B6D51',
    fontSize: 18,
    fontWeight: '900',
  },
});
