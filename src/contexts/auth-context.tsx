'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'user' | 'admin';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is the specific Gmail account for admin access.
const ADMIN_EMAIL = 'admin@gmail.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Mocking session check
    const sessionUser = sessionStorage.getItem('seatly-user');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, role: UserRole) => {
    // In a real app, you might validate the admin role against a backend.
    // For this mock, we trust the role from the login page, but double-check if the email matches.
    const finalRole = (role === 'admin' && email === ADMIN_EMAIL) ? 'admin' : 'user';

    const mockUser: User = {
      uid: 'mock-uid-' + Math.random(),
      email: email,
      displayName: email.split('@')[0],
      photoURL: `https://i.pravatar.cc/150?u=${email}`,
      role: finalRole,
    };
    setUser(mockUser);
    sessionStorage.setItem('seatly-user', JSON.stringify(mockUser));
    
    if (finalRole === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('seatly-user');
    router.push('/');
  };

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
