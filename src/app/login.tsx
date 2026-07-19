import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/components/auth-context';
import { SproutIcon } from '@/components/detox-icons';
import { usePreferences } from '@/components/preferences-context';
import { ThemedText } from '@/components/themed-text';
import { Fonts, Palette, Spacing } from '@/constants/theme';

const ERROR_TRANSLATIONS: Record<string, { en: string; ko: string }> = {
  'Invalid login credentials': {
    en: 'Incorrect email or password.',
    ko: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },
  'User already registered': {
    en: 'An account with this email already exists.',
    ko: '이미 가입된 이메일입니다.',
  },
};

const copy = {
  ko: {
    brand: '새싹 다이어리',
    checkEmail: '가입 확인 메일을 보냈어요. 메일함을 확인한 뒤 로그인해주세요.',
    confirmPassword: '비밀번호 확인',
    email: '이메일',
    error: '필수 항목을 모두 입력해주세요.',
    footer: '가입만 해도 마음이 편안해져요',
    login: '로그인',
    loginCta: '로그인',
    mismatch: '비밀번호가 일치하지 않습니다.',
    nickname: '닉네임',
    password: '비밀번호',
    signup: '회원가입',
    signupCta: '회원가입하고 시작하기',
    subtitle: '오늘도 나만의 시간을 심어볼까요?',
  },
  en: {
    brand: 'Sprout Diary',
    checkEmail: 'Almost there! Check your inbox to confirm your account, then log in.',
    confirmPassword: 'Confirm Password',
    email: 'Email',
    error: 'Please fill in every field.',
    footer: 'Just signing up brings a little peace of mind',
    login: 'Log In',
    loginCta: 'Log In',
    mismatch: 'Passwords do not match.',
    nickname: 'Nickname',
    password: 'Password',
    signup: 'Sign Up',
    signupCta: 'Sign up and get started',
    subtitle: 'Shall we plant some time for yourself today?',
  },
} as const;

export default function LoginScreen() {
  const { login, signUp } = useAuth();
  const { language } = usePreferences();
  const [loginMode, setLoginMode] = useState<'login' | 'signup'>('login');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const text = copy[language];

  const describeError = (message: string) => ERROR_TRANSLATIONS[message]?.[language] ?? message;
  const clearMessages = () => {
    setErrorMessage('');
    setNoticeMessage('');
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    if (loginMode === 'login') {
      if (!email.trim() || !password.trim()) {
        setErrorMessage(text.error);
        return;
      }

      clearMessages();
      setIsSubmitting(true);
      const result = await login(email, password);
      setIsSubmitting(false);

      if (!result.success) {
        setErrorMessage(result.error ? describeError(result.error) : text.error);
        return;
      }

      router.replace('/');
      return;
    }

    if (!nickname.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage(text.error);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(text.mismatch);
      return;
    }

    clearMessages();
    setIsSubmitting(true);
    const result = await signUp(email, password, nickname);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error ? describeError(result.error) : text.error);
      return;
    }

    if (result.needsEmailConfirmation) {
      setNoticeMessage(text.checkEmail);
      return;
    }

    router.replace('/');
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <SproutIcon variant="sm" />
            <ThemedText style={styles.logoText}>{text.brand}</ThemedText>
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
            <ThemedText style={styles.closeText}>✕</ThemedText>
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.hero}>
            <SproutIcon variant="lg" animated />
            <ThemedText style={styles.brandTitle}>{text.brand}</ThemedText>
            <ThemedText style={styles.subtitle}>{text.subtitle}</ThemedText>
          </View>

          <View style={styles.tabRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setLoginMode('login');
                clearMessages();
              }}
              style={[styles.tabButton, loginMode === 'login' && styles.tabButtonActive]}>
              <ThemedText style={[styles.tabText, loginMode === 'login' && styles.tabTextActive]}>{text.login}</ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setLoginMode('signup');
                clearMessages();
              }}
              style={[styles.tabButton, loginMode === 'signup' && styles.tabButtonActive]}>
              <ThemedText style={[styles.tabText, loginMode === 'signup' && styles.tabTextActive]}>{text.signup}</ThemedText>
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            {loginMode === 'signup' ? (
              <TextInput
                autoCapitalize="none"
                onChangeText={value => {
                  setNickname(value);
                  clearMessages();
                }}
                placeholder={text.nickname}
                placeholderTextColor={Palette.mutedLight}
                style={styles.input}
                value={nickname}
              />
            ) : null}
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={value => {
                setEmail(value);
                clearMessages();
              }}
              placeholder={text.email}
              placeholderTextColor={Palette.mutedLight}
              style={styles.input}
              value={email}
            />
            <TextInput
              onChangeText={value => {
                setPassword(value);
                clearMessages();
              }}
              placeholder={text.password}
              placeholderTextColor={Palette.mutedLight}
              secureTextEntry
              style={styles.input}
              value={password}
            />
            {loginMode === 'signup' ? (
              <TextInput
                onChangeText={value => {
                  setConfirmPassword(value);
                  clearMessages();
                }}
                placeholder={text.confirmPassword}
                placeholderTextColor={Palette.mutedLight}
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
              />
            ) : null}
          </View>

          {errorMessage ? <ThemedText style={styles.errorText}>{errorMessage}</ThemedText> : null}
          {noticeMessage ? <ThemedText style={styles.noticeText}>{noticeMessage}</ThemedText> : null}

          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={handleSubmit}
            style={({ pressed }) => [styles.ctaButton, (pressed || isSubmitting) && styles.pressed]}>
            <ThemedText style={styles.ctaText}>{loginMode === 'signup' ? text.signupCta : text.loginCta}</ThemedText>
          </Pressable>
          <ThemedText style={styles.footerText}>{text.footer}</ThemedText>
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
  header: {
    alignItems: 'center',
    borderBottomColor: Palette.ring,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 14,
    paddingHorizontal: Spacing.three,
    paddingTop: 12,
  },
  logoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  logoText: {
    color: Palette.textSoft,
    fontFamily: Fonts?.display,
    fontSize: 13,
  },
  closeButton: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  closeText: {
    color: Palette.textSoft,
    fontSize: 16,
  },
  content: {
    alignSelf: 'center',
    flex: 1,
    maxWidth: 430,
    paddingHorizontal: 28,
    paddingTop: 8,
    width: '100%',
  },
  hero: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 20,
  },
  brandTitle: {
    color: Palette.text,
    fontFamily: Fonts?.display,
    fontSize: 26,
    marginTop: 4,
  },
  subtitle: {
    color: Palette.textSoft,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  tabRow: {
    backgroundColor: Palette.ring,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 6,
    marginBottom: 18,
    padding: 4,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    paddingVertical: 10,
  },
  tabButtonActive: {
    backgroundColor: Palette.surface,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabText: {
    color: Palette.textSoft,
    fontFamily: Fonts?.display,
    fontSize: 13.5,
  },
  tabTextActive: {
    color: Palette.text,
  },
  inputGroup: {
    gap: 12,
  },
  input: {
    backgroundColor: '#FCFAF5',
    borderColor: Palette.ring,
    borderRadius: 14,
    borderWidth: 1,
    color: Palette.text,
    fontSize: 14,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  errorText: {
    color: Palette.danger,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 10,
  },
  noticeText: {
    color: Palette.primaryDark,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 10,
  },
  ctaButton: {
    alignItems: 'center',
    backgroundColor: Palette.primary,
    borderRadius: 16,
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 52,
    shadowColor: 'rgba(123,174,127,0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 18,
  },
  ctaText: {
    color: '#FFFFFF',
    fontFamily: Fonts?.display,
    fontSize: 16,
  },
  footerText: {
    color: Palette.textSoft,
    fontSize: 12,
    marginBottom: 16,
    marginTop: 14,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.82,
  },
});
