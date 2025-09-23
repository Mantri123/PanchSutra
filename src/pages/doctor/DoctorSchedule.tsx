import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, CheckCircle, XCircle, Loader2, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore';
import { format, addDays, startOfWeek, isSameDay, isToday } from 'date-fns';

// Define types for data used on this page
interface Appointment {
  id: string;
  patientId: string;
  therapyId: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

interface Patient {
    id: string;
    name: string;
}

const DoctorSchedule: React.FC = () => {
  const { user } = useAuth();
  const { therapies } = useApp(); // Therapies list from context is fine
  
  // State for live data
  const [doctorAppointments, setDoctorAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for UI
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  // Fetch Patients to map IDs to names
  useEffect(() => {
    const fetchPatients = async () => {
        const patientsQuery = query(collection(db, "users"), where("role", "==", "patient"));
        const patientSnapshot = await getDocs(patientsQuery);
        setPatients(patientSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name } as Patient)));
    };
    fetchPatients();
  }, []);

  // Set up a real-time listener for appointments
  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    const appointmentsQuery = query(collection(db, "appointments"), where("doctorId", "==", user.id));

    const unsubscribe = onSnapshot(appointmentsQuery, (querySnapshot) => {
      const appointmentsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Appointment));
      setDoctorAppointments(appointmentsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching appointments in real-time:", error);
      setIsLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [user]);

  const getAppointmentsForDate = (date: Date) => {
    return doctorAppointments.filter(apt => 
      isSameDay(new Date(apt.date), date) && apt.status !== 'completed' // Filter out completed appointments
    ).sort((a, b) => a.time.localeCompare(b.time));
  };

  const getPatientName = (patientId: string) => {
      return patients.find(p => p.id === patientId)?.name || 'Unknown';
  }

  const handleStatusUpdate = async (appointmentId: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    const appointmentRef = doc(db, "appointments", appointmentId);
    try {
      await updateDoc(appointmentRef, { status });
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];
  
  const weekStart = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Schedule</h1>
              <p className="text-gray-600">Manage your appointments and availability</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-xl border border-blue-200 p-1">
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'week' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'day' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600'
                  }`}
                >
                  Day
                </button>
              </div>
               <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg">
                  <Plus className="h-5 w-5 inline mr-2" />
                  Block Time
                </button>
            </div>
          </div>
        </div>

        {isLoading ? (
            <div className="text-center py-20"><Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" /></div>
        ) : viewMode === 'week' ? (
          /* Week View */
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-4 bg-blue-50 font-semibold text-gray-700">Time</div>
              {weekDays.map((day, index) => (
                <div key={index} className={`p-4 text-center font-semibold ${isToday(day) ? 'bg-blue-600 text-white' : 'bg-blue-50 text-gray-700'}`}>
                  <div className="text-sm">{format(day, 'EEE')}</div>
                  <div className="text-lg">{format(day, 'd')}</div>
                </div>
              ))}
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 border-b border-gray-100 hover:bg-blue-50">
                  <div className="p-4 bg-gray-50 font-medium text-gray-600 border-r">{time}</div>
                  {weekDays.map((day, dayIndex) => {
                    const appointment = getAppointmentsForDate(day).find(apt => apt.time === time);
                    return (
                      <div key={dayIndex} className="p-2 border-r border-gray-100 min-h-[4rem]">
                        {appointment && (
                          <div className={`p-2 rounded-lg text-xs ${
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            <div className="font-semibold truncate">{therapies.find(t => t.id === appointment.therapyId)?.name}</div>
                            <div className="truncate">{getPatientName(appointment.patientId)}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Day View */
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{format(selectedDate, 'EEEE, MMMM dd, yyyy')}</h2>
                <div className="flex space-x-2">
                    {weekDays.map((day, index) => (
                        <button key={index} onClick={() => setSelectedDate(day)} className={`px-3 py-2 rounded-lg text-center ${isSameDay(day, selectedDate) ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}`}>
                            <div className="text-xs">{format(day, 'EEE')}</div>
                            <div className="font-bold">{format(day, 'd')}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
              {getAppointmentsForDate(selectedDate).map((appointment) => {
                const therapy = therapies.find(t => t.id === appointment.therapyId);
                return (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Clock className="h-7 w-7 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{therapy?.name}</h3>
                        <p className="text-gray-600">{getPatientName(appointment.patientId)}</p>
                        <p className="text-sm text-gray-500">{appointment.time} - {appointment.duration} min</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {appointment.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatusUpdate(appointment.id, 'confirmed')} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200" title="Confirm Appointment">
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleStatusUpdate(appointment.id, 'cancelled')} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Cancel Appointment">
                            <XCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                          <button onClick={() => handleStatusUpdate(appointment.id, 'completed')} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200" title="Mark as Completed">
                              <Check className="h-5 w-5" />
                          </button>
                      )}
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                );
              })}
              {getAppointmentsForDate(selectedDate).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No appointments for this day.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSchedule;

