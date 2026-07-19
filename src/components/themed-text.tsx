import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, Palette } from '@/constants/theme';

export function ThemedText({ style, ...rest }: TextProps) {
  return <Text style={[styles.default, style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    color: Palette.text,
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
});
