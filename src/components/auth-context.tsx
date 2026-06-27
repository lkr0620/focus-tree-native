import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

type User = {
  email: string;
  name: string;
};

type AuthContextValue = {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  user: User | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getNameFromEmail(email: string) {
  const [name] = email.split('@');
  return name ? name.trim() : '숨 쉬는 나';
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      login: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail.includes('@') || password.trim().length < 1) {
          return false;
        }

        setUser({
          email: normalizedEmail,
          name: getNameFromEmail(normalizedEmail),
        });
        return true;
      },
      logout: () => setUser(null),
      user,
    }),
    [user]
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
