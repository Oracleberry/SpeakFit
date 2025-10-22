import React, { createContext, useState, useContext, ReactNode } from 'react';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';

interface AuthContextType {
  isLoggedIn: boolean;
  user: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 一時的に常にログイン状態にする（Firebase無効化のため）
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState<string | null>('test-user');

  // 一時的なダミー関数（Firebase無効化のため）
  const login = async (email: string, password: string): Promise<boolean> => {
    // 常にログイン成功
    setIsLoggedIn(true);
    setUser(email);
    return true;
  };

  const register = async (username: string, password: string, email: string): Promise<boolean> => {
    // 常に登録成功
    setIsLoggedIn(true);
    setUser(email);
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
