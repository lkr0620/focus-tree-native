import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

export type AppLanguage = 'ko' | 'en';

type PreferencesContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<AppLanguage>('ko');
  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }

  return context;
}
