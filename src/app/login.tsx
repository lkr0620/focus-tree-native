import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/components/auth-context';
import { usePreferences } from '@/components/preferences-context';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const { language } = usePreferences();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const text = {
    en: {
      create: 'Create Account',
      email: 'Email',
      error: 'Please enter your email and password.',
      footer: "Carry today's small pause into tomorrow's forest.",
      login: 'Log In',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      subtitle: 'Log in to keep growing your forest and records.',
      title: 'Return to Your Breath',
    },
    ko: {
      create: '계정 만들기',
      email: '이메일',
      error: '이메일과 비밀번호를 입력해주세요.',
      footer: '오늘의 작은 멈춤을 내일의 숲으로 이어가요.',
      login: '로그인',
      password: '비밀번호',
      passwordPlaceholder: '비밀번호를 입력하세요',
      subtitle: '나의 숲과 기록을 이어가려면 로그인해주세요.',
      title: '다시 숨으로 돌아오기',
    },
  }[language];

  const handleLogin = () => {
    const didLogin = login(email, password);

    if (!didLogin) {
      setErrorMessage(text.error);
      return;
    }

    setErrorMessage('');
    router.replace('/');
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <SymbolView name={{ ios: 'leaf', android: 'eco', web: 'eco' }} tintColor="#4B6D51" size={22} />
            <ThemedText style={styles.logoText}>Soom</ThemedText>
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
            <SymbolView name={{ ios: 'xmark', android: 'close', web: 'close' }} tintColor="#243126" size={21} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.heroMark}>
            <SymbolView name={{ ios: 'person.fill', android: 'person', web: 'person' }} tintColor="#FFFFFF" size={34} />
          </View>

          <View style={styles.copy}>
            <ThemedText style={styles.title}>{text.title}</ThemedText>
            <ThemedText style={styles.subtitle}>{text.subtitle}</ThemedText>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>{text.email}</ThemedText>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={text => {
                  setEmail(text);
                  setErrorMessage('');
                }}
                placeholder="soom@example.com"
                placeholderTextColor="#9BA49A"
                style={styles.input}
                value={email}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>{text.password}</ThemedText>
              <TextInput
                onChangeText={text => {
                  setPassword(text);
                  setErrorMessage('');
                }}
                placeholder={text.passwordPlaceholder}
                placeholderTextColor="#9BA49A"
                secureTextEntry
                style={styles.input}
                value={password}
              />
            </View>

            {errorMessage ? <ThemedText style={styles.errorText}>{errorMessage}</ThemedText> : null}

            <Pressable accessibilityRole="button" onPress={handleLogin} style={({ pressed }) => [styles.loginButton, pressed && styles.pressed]}>
              <ThemedText style={styles.loginText}>{text.login}</ThemedText>
            </Pressable>

            <Pressable accessibilityRole="button" style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <SymbolView name={{ ios: 'person.badge.plus', android: 'person_add', web: 'person_add' }} tintColor="#4B6D51" size={18} />
              <ThemedText style={styles.secondaryText}>{text.create}</ThemedText>
            </Pressable>
          </View>

          <ThemedText style={styles.footerText}>{text.footer}</ThemedText>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FBFCF8',
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: '#ECEFE8',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 18,
    paddingHorizontal: Spacing.three,
    paddingTop: 14,
  },
  logoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  logoText: {
    color: '#4B6D51',
    fontSize: 18,
    fontWeight: '900',
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 19,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  content: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    maxWidth: 430,
    paddingBottom: 42,
    paddingHorizontal: Spacing.three,
    width: '100%',
  },
  heroMark: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#4B6D51',
    borderRadius: 38,
    height: 76,
    justifyContent: 'center',
    marginBottom: 26,
    shadowColor: '#36523B',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    width: 76,
  },
  copy: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    color: '#101A12',
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 34,
    textAlign: 'center',
  },
  subtitle: {
    color: '#657066',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D6E2D1',
    borderRadius: 8,
    borderWidth: 1,
    padding: 22,
    shadowColor: '#A9BBA4',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#4B6D51',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F0F5EC',
    borderColor: '#D1DEC9',
    borderWidth: 1,
    borderRadius: 8,
    color: '#101A12',
    fontSize: 15,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: '#7A5B4B',
    borderRadius: 999,
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 52,
  },
  errorText: {
    color: '#A14E3F',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 10,
    marginTop: -2,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  secondaryButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48,
  },
  secondaryText: {
    color: '#4B6D51',
    fontSize: 14,
    fontWeight: '900',
  },
  footerText: {
    color: '#8D968C',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 24,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.82,
  },
});
