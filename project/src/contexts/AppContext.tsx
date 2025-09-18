import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Therapy, Session, Notification, Center, TherapyPlan, Appointment, Room } from '../types';

interface AppContextType {
  therapies: Therapy[];
  sessions: Session[];
  appointments: Appointment[];
  notifications: Notification[];
  centers: Center[];
  therapyPlans: TherapyPlan[];
  bookSession: (session: Omit<Session, 'id'>) => void;
  bookAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateSession: (sessionId: string, updates: Partial<Session>) => void;
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  getAvailableSlots: (doctorId: string, date: string) => string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockTherapies: Therapy[] = [
  {
    id: 'abhyanga',
    name: 'Abhyanga',
    description: 'Full body oil massage with warm herbal oils to rejuvenate and detoxify the body.',
    duration: 60,
    cost: 2500,
    category: 'Massage Therapy',
    precautions: ['Avoid heavy meals 2 hours before', 'Inform about skin allergies', 'Wear comfortable clothing'],
    benefits: ['Improves circulation', 'Reduces stress', 'Nourishes skin', 'Enhances immunity'],
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg',
    contraindications: ['Fever', 'Skin infections', 'Open wounds', 'Recent surgery'],
    steps: [
      'Preparation with herbal oils',
      'Full body massage in systematic strokes',
      'Steam therapy (optional)',
      'Rest period',
      'Post-therapy care instructions'
    ],
    equipment: ['Massage table', 'Herbal oils', 'Towels', 'Steam chamber']
  },
  {
    id: 'shirodhara',
    name: 'Shirodhara',
    description: 'Continuous pouring of warm oil on the forehead to calm the mind and nervous system.',
    duration: 45,
    cost: 3500,
    category: 'Head Therapy',
    precautions: ['Empty stomach preferred', 'Avoid alcohol 24 hours before', 'Remove contact lenses'],
    benefits: ['Reduces anxiety', 'Improves sleep', 'Mental clarity', 'Stress relief'],
    image: 'https://images.pexels.com/photos/3757943/pexels-photo-3757943.jpeg',
    contraindications: ['Head injuries', 'Severe depression', 'Pregnancy (1st trimester)', 'Scalp infections'],
    steps: [
      'Patient positioning',
      'Oil temperature check',
      'Continuous oil pouring',
      'Gentle head massage',
      'Rest and recovery'
    ],
    equipment: ['Shirodhara table', 'Oil vessel', 'Medicated oils', 'Towels']
  },
  {
    id: 'swedana',
    name: 'Swedana',
    description: 'Herbal steam therapy to eliminate toxins and improve circulation.',
    duration: 30,
    cost: 1800,
    category: 'Steam Therapy',
    precautions: ['Stay hydrated', 'Inform about heart conditions', 'Remove jewelry'],
    benefits: ['Detoxification', 'Pain relief', 'Improved flexibility', 'Better circulation'],
    image: 'https://images.pexels.com/photos/3757944/pexels-photo-3757944.jpeg',
    contraindications: ['Pregnancy', 'Heart disease', 'High fever', 'Severe weakness'],
    steps: [
      'Pre-therapy assessment',
      'Herbal steam preparation',
      'Gradual steam exposure',
      'Monitoring vital signs',
      'Cool down period'
    ],
    equipment: ['Steam chamber', 'Herbal decoctions', 'Towels', 'Monitoring equipment']
  },
  {
    id: 'panchakarma',
    name: 'Panchakarma Package',
    description: 'Complete detoxification program including all five cleansing procedures.',
    duration: 180,
    cost: 15000,
    category: 'Complete Package',
    precautions: ['Medical consultation required', 'Follow dietary guidelines', 'Complete health assessment'],
    benefits: ['Complete detox', 'Hormonal balance', 'Immunity boost', 'Mental clarity'],
    image: 'https://images.pexels.com/photos/3757945/pexels-photo-3757945.jpeg',
    contraindications: ['Severe illness', 'Recent surgery', 'Pregnancy', 'Severe mental disorders'],
    steps: [
      'Initial consultation and assessment',
      'Preparatory procedures (Purvakarma)',
      'Main procedures (Pradhanakarma)',
      'Post-therapy care (Paschatkarma)',
      'Follow-up consultations'
    ],
    equipment: ['Multiple therapy rooms', 'Specialized equipment', 'Herbal medicines', 'Monitoring devices']
  },
  {
    id: 'nasya',
    name: 'Nasya',
    description: 'Nasal administration of medicated oils to treat respiratory and neurological disorders.',
    duration: 20,
    cost: 1200,
    category: 'Nasal Therapy',
    precautions: ['Clear nasal passages', 'No cold symptoms', 'Avoid food 1 hour before'],
    benefits: ['Clear sinuses', 'Improved breathing', 'Mental clarity', 'Headache relief'],
    image: 'https://images.pexels.com/photos/3757946/pexels-photo-3757946.jpeg',
    contraindications: ['Nasal bleeding', 'Severe cold', 'Nasal polyps', 'Recent nasal surgery'],
    steps: [
      'Nasal examination',
      'Oil preparation',
      'Gentle nasal administration',
      'Post-therapy rest',
      'Aftercare instructions'
    ],
    equipment: ['Nasal drops', 'Medicated oils', 'Examination tools', 'Tissues']
  },
  {
    id: 'basti',
    name: 'Basti',
    description: 'Medicated enemas to cleanse the colon and balance Vata dosha.',
    duration: 40,
    cost: 2800,
    category: 'Colon Therapy',
    precautions: ['Empty stomach required', 'Follow preparation guidelines', 'Proper hydration'],
    benefits: ['Digestive health', 'Pain relief', 'Nervous system balance', 'Toxin elimination'],
    image: 'https://images.pexels.com/photos/3757947/pexels-photo-3757947.jpeg',
    contraindications: ['Diarrhea', 'Rectal bleeding', 'Severe weakness', 'Inflammatory bowel disease'],
    steps: [
      'Pre-therapy preparation',
      'Medicated enema administration',
      'Retention period',
      'Evacuation',
      'Post-therapy care'
    ],
    equipment: ['Enema equipment', 'Medicated oils', 'Monitoring devices', 'Privacy screens']
  }
];

const mockCenters: Center[] = [
  {
    id: 'center1',
    name: 'PanchSutra Delhi Center',
    address: '123 Connaught Place, New Delhi - 110001',
    phone: '+91-11-23456789',
    email: 'delhi@panchsutra.com',
    facilities: ['Steam Room', 'Massage Rooms', 'Consultation Rooms', 'Pharmacy', 'Reception'],
    operatingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '08:00', close: '18:00' },
      sunday: { open: '10:00', close: '16:00' }
    },
    rooms: [
      { id: 'room1', name: 'Therapy Room 1', type: 'Massage', capacity: 1, equipment: ['Massage table', 'Oil warmer'], isAvailable: true },
      { id: 'room2', name: 'Therapy Room 2', type: 'Steam', capacity: 1, equipment: ['Steam chamber', 'Towels'], isAvailable: true },
      { id: 'room3', name: 'Consultation Room 1', type: 'Consultation', capacity: 2, equipment: ['Desk', 'Examination bed'], isAvailable: true }
    ]
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [therapies] = useState<Therapy[]>(mockTherapies);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [centers] = useState<Center[]>(mockCenters);
  const [therapyPlans] = useState<TherapyPlan[]>([]);

  const bookSession = (session: Omit<Session, 'id'>) => {
    const newSession: Session = {
      ...session,
      id: Date.now().toString()
    };
    setSessions(prev => [...prev, newSession]);
    
    // Add notification
    addNotification({
      userId: session.patientId,
      title: 'Session Booked Successfully',
      message: `Your ${therapies.find(t => t.id === session.therapyId)?.name} session has been booked for ${session.date}`,
      type: 'booking',
      isRead: false
    });
  };

  const bookAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString()
    };
    setAppointments(prev => [...prev, newAppointment]);
    
    // Add notifications for both patient and doctor
    addNotification({
      userId: appointment.patientId,
      title: 'Appointment Booked',
      message: `Your appointment has been scheduled for ${appointment.date} at ${appointment.time}`,
      type: 'appointment',
      isRead: false
    });
    
    addNotification({
      userId: appointment.doctorId,
      title: 'New Appointment',
      message: `New appointment scheduled for ${appointment.date} at ${appointment.time}`,
      type: 'appointment',
      isRead: false
    });
  };

  const updateSession = (sessionId: string, updates: Partial<Session>) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, ...updates } : session
    ));
  };

  const updateAppointment = (appointmentId: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === appointmentId ? { ...appointment, ...updates } : appointment
    ));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const getAvailableSlots = (doctorId: string, date: string): string[] => {
    // Mock available slots - in real app, this would check doctor availability and existing bookings
    const slots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];
    
    // Filter out booked slots
    const bookedSlots = appointments
      .filter(apt => apt.doctorId === doctorId && apt.date === date)
      .map(apt => apt.time);
    
    return slots.filter(slot => !bookedSlots.includes(slot));
  };

  return (
    <AppContext.Provider value={{
      therapies,
      sessions,
      appointments,
      notifications,
      centers,
      therapyPlans,
      bookSession,
      bookAppointment,
      updateSession,
      updateAppointment,
      addNotification,
      markNotificationAsRead,
      getAvailableSlots
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};