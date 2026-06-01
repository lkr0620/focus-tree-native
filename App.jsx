import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AppState, ScrollView, SafeAreaView } from 'react-native';

export default function App() {
  // 상태 관리
  const [screen, setScreen] = useState('setup'); // 'setup', 'focus', 'completed', 'failed'
  const [timeInput, setTimeInput] = useState(30); // 기본값: 30분
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [growthStage, setGrowthStage] = useState(0); // 0-5: 성장 단계
  const [isFailed, setIsFailed] = useState(false);
  const appState = useRef(AppState.currentState);
  const timerRef = useRef(null);

  // 타이머 시작
  const startFocus = () => {
    if (timeInput <= 0) {
      alert('1분 이상 설정하세요');
      return;
    }
    const seconds = timeInput * 60;
    setTotalSeconds(seconds);
    setRemainingSeconds(seconds);
    setGrowthStage(0);
    setIsFailed(false);
    setScreen('focus');
  };

  // 성장 단계 계산
  const calculateGrowthStage = (elapsed, total) => {
    const progress = elapsed / total;
    if (progress < 0.1) return 0;
    if (progress < 0.35) return 1;
    if (progress < 0.6) return 2;
    if (progress < 0.85) return 3;
    if (progress < 1) return 4;
    return 5;
  };

  // AppState 감시 (감옥 로직)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'background' &&
        screen === 'focus' &&
        !isFailed
      ) {
        // 앱이 백그라운드로 갔을 때 실패 처리
        setIsFailed(true);
        setScreen('failed');
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [screen, isFailed]);

  // 메인 타이머
  useEffect(() => {
    if (screen !== 'focus' || isFailed) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setScreen('completed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [screen, isFailed]);

  // 경과시간에 따른 성장 단계 업데이트
  useEffect(() => {
    if (screen === 'focus' && totalSeconds > 0) {
      const elapsed = totalSeconds - remainingSeconds;
      setGrowthStage(calculateGrowthStage(elapsed, totalSeconds));
    }
  }, [remainingSeconds, totalSeconds, screen]);

  // 시간 포맷
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 식물 렌더링
  const PlantStage = ({ stage, isFailed }) => {
    const plantEmojis = [
      '🌱',
      '🌿',
      '🌾',
      '🌳',
      '🌲',
      '✨🌲✨',
    ];

    const emoji = isFailed ? '🍂' : plantEmojis[Math.min(stage, 5)];
    const opacity = isFailed ? 0.6 : 1;

    return (
      <Text style={[styles.plantEmoji, { opacity }]}>
        {emoji}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 셋업 화면 */}
      {screen === 'setup' && (
        <ScrollView style={styles.screenContent} contentContainerStyle={styles.centerContent}>
          <View style={styles.setupCard}>
            <Text style={styles.title}>🌱 Focus Tracker</Text>
            <Text style={styles.subtitle}>스마트폰 없이 집중하는 시간을 가져보세요</Text>

            <Text style={styles.label}>집중 시간 설정 (분)</Text>
            
            <View style={styles.presetButtons}>
              <TouchableOpacity 
                style={[styles.presetBtn, timeInput === 15 && styles.presetBtnActive]}
                onPress={() => setTimeInput(15)}
              >
                <Text style={[styles.presetBtnText, timeInput === 15 && styles.presetBtnTextActive]}>15분</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.presetBtn, timeInput === 30 && styles.presetBtnActive]}
                onPress={() => setTimeInput(30)}
              >
                <Text style={[styles.presetBtnText, timeInput === 30 && styles.presetBtnTextActive]}>30분</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.presetButtons}>
              <TouchableOpacity 
                style={[styles.presetBtn, timeInput === 60 && styles.presetBtnActive]}
                onPress={() => setTimeInput(60)}
              >
                <Text style={[styles.presetBtnText, timeInput === 60 && styles.presetBtnTextActive]}>1시간</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.presetBtn, timeInput === 120 && styles.presetBtnActive]}
                onPress={() => setTimeInput(120)}
              >
                <Text style={[styles.presetBtnText, timeInput === 120 && styles.presetBtnTextActive]}>2시간</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={startFocus}>
              <Text style={styles.buttonText}>🎯 집중 시작</Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>💡 팁:</Text>
              <Text style={styles.infoText}>이 앱을 닫거나 다른 앱으로 전환하면 식물이 시들어집니다!</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* 포커스 화면 */}
      {screen === 'focus' && (
        <View style={styles.screenContent}>
          <View style={styles.timerBox}>
            <Text style={styles.timerText}>{formatTime(remainingSeconds)}</Text>
          </View>

          <PlantStage stage={growthStage} isFailed={isFailed} />

          <Text style={styles.statusTitle}>집중력을 유지하세요</Text>
          <Text style={styles.statusText}>
            {isFailed ? '⚠️ 다른 앱을 켜셨습니다!' : '🌱 식물이 자라고 있습니다...'}
          </Text>
        </View>
      )}

      {/* 완료 화면 */}
      {screen === 'completed' && (
        <ScrollView style={styles.screenContent} contentContainerStyle={styles.centerContent}>
          <View style={styles.resultCard}>
            <Text style={styles.resultEmoji}>✨🌲✨</Text>
            <Text style={styles.resultTitle}>완료했어요!</Text>
            <Text style={styles.resultText}>아름다운 나무가 자라났습니다.</Text>
            <Text style={styles.resultTime}>
              {`${timeInput}분 동안 성공적으로 집중했습니다!`}
            </Text>
            
            <TouchableOpacity style={styles.button} onPress={() => setScreen('setup')}>
              <Text style={styles.buttonText}>🔄 다시 시작</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* 실패 화면 */}
      {screen === 'failed' && (
        <ScrollView style={styles.screenContent} contentContainerStyle={styles.centerContent}>
          <View style={styles.resultCard}>
            <Text style={styles.resultEmoji}>💀🌿</Text>
            <Text style={styles.resultTitle}>집중 실패...</Text>
            <Text style={styles.resultText}>식물이 시들어버렸습니다.</Text>
            <Text style={styles.resultTime}>
              {`${Math.floor((totalSeconds - remainingSeconds) / 60)}분 동안 집중했습니다.`}
            </Text>
            
            <TouchableOpacity style={styles.button} onPress={() => setScreen('setup')}>
              <Text style={styles.buttonText}>🔄 다시 도전</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  screenContent: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  setupCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
  },
  presetButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
    width: '100%',
  },
  presetBtn: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  presetBtnActive: {
    backgroundColor: '#34d399',
    borderColor: '#10b981',
  },
  presetBtnText: {
    color: '#1f2937',
    fontWeight: '500',
    fontSize: 14,
  },
  presetBtnTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    width: '100%',
  },
  infoTitle: {
    color: '#78350f',
    fontWeight: '600',
    marginBottom: 5,
  },
  infoText: {
    color: '#78350f',
    fontSize: 13,
    lineHeight: 18,
  },
  timerBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 20,
    marginTop: 30,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#10b981',
    fontFamily: 'Courier New',
    letterSpacing: 2,
  },
  plantEmoji: {
    fontSize: 80,
    marginVertical: 30,
    textAlign: 'center',
  },
  statusTitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    width: '100%',
    alignItems: 'center',
  },
  resultEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultTime: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 30,
    textAlign: 'center',
  },
});
