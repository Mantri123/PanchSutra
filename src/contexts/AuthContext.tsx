// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { auth, db } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const demoUserProfiles = [
    { email: 'patient@demo.com', name: 'Rahul Sharma', phone: '+91-9876543210', role: 'patient' },
    { email: 'doctor@demo.com', name: 'Dr. Priya Patel', phone: '+91-9876543220', role: 'doctor' },
    { email: 'admin@demo.com', name: 'Admin User', phone: '+91-9876543230', role: 'admin' }
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (userData: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const appUser = { id: firebaseUser.uid, ...userDocSnap.data() } as User;
          setUser(appUser);
          localStorage.setItem('panchsutra_user', JSON.stringify(appUser));
        } else {
          const demoProfile = demoUserProfiles.find(p => p.email === firebaseUser.email);
          if (demoProfile) {
            await setDoc(userDocRef, { ...demoProfile, createdAt: serverTimestamp() });
            const appUser = { id: firebaseUser.uid, ...demoProfile } as User;
            setUser(appUser);
            localStorage.setItem('panchsutra_user', JSON.stringify(appUser));
          }
        }
      } else {
        setUser(null);
        localStorage.removeItem('panchsutra_user');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting isLoading to false after profile is fetched
      return { success: true, message: "Login successful" };
    } catch (error: any) {
      console.error("Firebase login error:", error.code);
      setIsLoading(false);
      // *** THIS IS THE CHANGE ***
      // We now return a user-friendly message for common errors.
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        return { success: false, message: "Invalid email or password." };
      }
      return { success: false, message: "An unexpected error occurred. Please try again." };
    }
  };

  const signup = async (userData: any) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const firebaseUser = userCredential.user;

      const { password, confirmPassword, ...userProfile } = userData;
      userProfile.createdAt = serverTimestamp();

      await setDoc(doc(db, "users", firebaseUser.uid), userProfile);
      // onAuthStateChanged will handle the rest
      return { success: true, message: "Signup successful" };
    } catch (error: any) {
      console.error("Firebase signup error:", error.code);
      setIsLoading(false);
      // Provide a user-friendly message for a common signup error.
      if (error.code === 'auth/email-already-in-use') {
          return { success: false, message: 'This email address is already registered.' };
      }
      return { success: false, message: "An unexpected error occurred during signup." };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: "Password reset email sent." };
    } catch (error: any) {
      console.error("Firebase forgot password error:", error);
      return { success: false, message: "Failed to send reset email. Please check the address." };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, forgotPassword, isLoading }}>
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