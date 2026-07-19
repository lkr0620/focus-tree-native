import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { supabase } from '@/lib/supabase';

type User = {
  email: string;
  name: string;
};

type AuthResult = {
  error?: string;
  needsEmailConfirmation?: boolean;
  success: boolean;
};

type AuthContextValue = {
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  signUp: (email: string, password: string, nickname?: string) => Promise<AuthResult>;
  user: User | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getNameFromEmail(email: string) {
  const [name] = email.split('@');
  return name ? name.trim() : '숨 쉬는 나';
}

function toUser(session: { user: { email?: string; user_metadata?: { nickname?: string } } } | null | undefined): User | null {
  const email = session?.user.email;
  if (!email) {
    return null;
  }

  const nickname = session?.user.user_metadata?.nickname;
  return { email, name: nickname && nickname.trim() ? nickname.trim() : getNameFromEmail(email) };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(toUser(data.session));
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toUser(session));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      login: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        return error ? { error: error.message, success: false } : { success: true };
      },
      logout: () => {
        supabase.auth.signOut();
      },
      signUp: async (email, password, nickname) => {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: nickname?.trim() ? { data: { nickname: nickname.trim() } } : undefined,
        });

        if (error) {
          return { error: error.message, success: false };
        }

        return { needsEmailConfirmation: !data.session, success: true };
      },
      user,
    }),
    [isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
