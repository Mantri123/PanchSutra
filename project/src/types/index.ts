export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Patient extends User {
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  medicalHistory: string[];
  currentTherapies: string[];
  constitution?: 'vata' | 'pitta' | 'kapha' | 'mixed';
  allergies?: string[];
}

export interface Doctor extends User {
  specialization: string[];
  experience: number;
  qualification: string;
  registrationNumber: string;
  licenseNumber: string;
  availability: TimeSlot[];
  patients: string[];
  consultationFee: number;
  languages: string[];
  bio: string;
  verified: boolean;
}

export interface Admin extends User {
  permissions: string[];
  managedCenters: string[];
  department: string;
}

export interface Therapy {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  cost: number;
  category: string;
  precautions: string[];
  benefits: string[];
  image: string;
  contraindications: string[];
  steps: string[];
  equipment: string[];
}

export interface Session {
  id: string;
  patientId: string;
  doctorId: string;
  therapyId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  vitals?: {
    bloodPressure?: string;
    pulse?: string;
    temperature?: string;
    weight?: string;
  };
  feedback?: {
    rating: number;
    comments: string;
    symptoms: string[];
    sideEffects: string[];
  };
  cost: number;
  centerId: string;
  roomNumber?: string;
}

export interface TherapyPlan {
  id: string;
  patientId: string;
  doctorId: string;
  therapies: {
    therapyId: string;
    sessions: number;
    frequency: string;
    duration: number;
    completed: number;
  }[];
  startDate: string;
  endDate: string;
  goals: string[];
  status: 'active' | 'completed' | 'paused';
  notes: string;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reminder' | 'booking' | 'system' | 'feedback' | 'appointment';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Center {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  facilities: string[];
  operatingHours: {
    [key: string]: { open: string; close: string; };
  };
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  equipment: string[];
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  therapyId: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  centerId: string;
  roomId?: string;
}