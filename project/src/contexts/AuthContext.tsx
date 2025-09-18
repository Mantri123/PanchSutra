import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Patient, Doctor, Admin } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<User> & { password: string; confirmPassword?: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demo purposes
const mockUsers: (Patient | Doctor | Admin)[] = [
  {
    id: '1',
    email: 'patient@demo.com',
    password: 'demo123',
    name: 'Rahul Sharma',
    phone: '+91-9876543210',
    role: 'patient',
    createdAt: '2024-01-15T00:00:00Z',
    dateOfBirth: '1985-06-15',
    address: '123 MG Road, Delhi',
    emergencyContact: '+91-9876543211',
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
    currentTherapies: ['abhyanga', 'shirodhara'],
    constitution: 'vata',
    allergies: ['Nuts', 'Shellfish']
  } as Patient & { password: string },
  {
    id: '2',
    email: 'doctor@demo.com',
    password: 'demo123',
    name: 'Dr. Priya Patel',
    phone: '+91-9876543220',
    role: 'doctor',
    createdAt: '2024-01-10T00:00:00Z',
    specialization: ['Panchakarma', 'Ayurvedic Medicine', 'Pulse Diagnosis'],
    experience: 8,
    qualification: 'BAMS, MD (Panchakarma)',
    registrationNumber: 'AYU12345',
    licenseNumber: 'DL12345678',
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Saturday', startTime: '09:00', endTime: '14:00', isAvailable: true }
    ],
    patients: ['1', '3', '4'],
    consultationFee: 1500,
    languages: ['English', 'Hindi', 'Gujarati'],
    bio: 'Experienced Ayurvedic practitioner specializing in Panchakarma therapies with over 8 years of clinical experience.',
    verified: true
  } as Doctor & { password: string },
  {
    id: '3',
    email: 'admin@demo.com',
    password: 'demo123',
    name: 'Admin User',
    phone: '+91-9876543230',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    permissions: ['manage_users', 'manage_bookings', 'view_reports', 'manage_centers'],
    managedCenters: ['center1', 'center2'],
    department: 'Operations'
  } as Admin & { password: string }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('panchsutra_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && (u as any).password === password);
    
    if (foundUser) {
      const userWithoutPassword = { ...foundUser };
      delete (userWithoutPassword as any).password;
      setUser(userWithoutPassword);
      localStorage.setItem('panchsutra_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (userData: Partial<User> & { password: string; confirmPassword?: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }

    let newUser: User;

    if (userData.role === 'doctor') {
      newUser = {
        id: Date.now().toString(),
        email: userData.email!,
        name: userData.name!,
        phone: userData.phone!,
        role: 'doctor',
        createdAt: new Date().toISOString(),
        specialization: (userData as any).specialization || ['General Ayurveda'],
        experience: (userData as any).experience || 0,
        qualification: (userData as any).qualification || '',
        registrationNumber: (userData as any).registrationNumber || '',
        licenseNumber: (userData as any).licenseNumber || '',
        availability: [],
        patients: [],
        consultationFee: (userData as any).consultationFee || 1000,
        languages: (userData as any).languages || ['English'],
        bio: (userData as any).bio || '',
        verified: false
      } as Doctor;
    } else {
      newUser = {
        id: Date.now().toString(),
        email: userData.email!,
        name: userData.name!,
        phone: userData.phone!,
        role: userData.role || 'patient',
        createdAt: new Date().toISOString()
      };

      if (userData.role === 'patient') {
        (newUser as Patient).dateOfBirth = (userData as any).dateOfBirth || '';
        (newUser as Patient).address = (userData as any).address || '';
        (newUser as Patient).emergencyContact = (userData as any).emergencyContact || '';
        (newUser as Patient).medicalHistory = [];
        (newUser as Patient).currentTherapies = [];
      }
    }

    setUser(newUser);
    localStorage.setItem('panchsutra_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('panchsutra_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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