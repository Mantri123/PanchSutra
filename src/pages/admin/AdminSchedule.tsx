import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

// Define types for users needed on this page
interface SelectUser {
  id: string;
  name: string;
}

const AdminSchedule: React.FC = () => {
  const navigate = useNavigate();
  const { therapies } = useApp();

  const [patients, setPatients] = useState<SelectUser[]>([]);
  const [doctors, setDoctors] = useState<SelectUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTherapy, setSelectedTherapy] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');

  // Fetch patients and doctors
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const usersRef = collection(db, "users");
        
        const patientQuery = query(usersRef, where("role", "==", "patient"));
        const patientSnapshot = await getDocs(patientQuery);
        setPatients(patientSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));

        const doctorQuery = query(usersRef, where("role", "==", "doctor"));
        const doctorSnapshot = await getDocs(doctorQuery);
        setDoctors(doctorSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));

      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mock available slots - in a real app, this would check doctor's specific availability
  const availableSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];
  
  const weekStart = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleBooking = async () => {
    if (!selectedPatient || !selectedDoctor || !selectedTherapy || !selectedDate || !selectedTime) {
        setError("Please fill out all fields to book an appointment.");
        return;
    }
    setError('');
    setIsBooking(true);

    try {
        const therapyDetails = therapies.find(t => t.id === selectedTherapy);
        if (!therapyDetails) {
            throw new Error("Selected therapy not found.");
        }

        await addDoc(collection(db, "appointments"), {
            patientId: selectedPatient,
            doctorId: selectedDoctor,
            therapyId: selectedTherapy,
            date: format(selectedDate, 'yyyy-MM-dd'),
            time: selectedTime,
            duration: therapyDetails.duration,
            status: 'confirmed',
            createdAt: serverTimestamp(),
        });

        // On success, navigate back to the dashboard
        navigate('/admin/dashboard');

    } catch (err) {
        setError("Failed to book appointment. Please try again.");
        console.error(err);
    } finally {
        setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/admin/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mb-4 group">
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Appointment</h1>
          <p className="text-gray-600">Book a new session for a patient with an available doctor.</p>
        </div>

        {isLoading ? (
            <div className="text-center py-16"><Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" /></div>
        ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 grid md:grid-cols-2 gap-8">
                {/* Left Side - Selection */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Patient</label>
                        <select value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)} className="w-full p-3 border rounded-lg">
                            <option value="">-- Choose a patient --</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Doctor</label>
                        <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} className="w-full p-3 border rounded-lg">
                            <option value="">-- Choose a doctor --</option>
                            {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Therapy</label>
                        <select value={selectedTherapy} onChange={e => setSelectedTherapy(e.target.value)} className="w-full p-3 border rounded-lg">
                            <option value="">-- Choose a therapy --</option>
                            {therapies.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div className="pt-4">
                        <button onClick={handleBooking} disabled={isBooking} className="w-full flex justify-center items-center py-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold disabled:opacity-50">
                            {isBooking ? <Loader2 className="animate-spin h-5 w-5" /> : 'Confirm & Book Appointment'}
                        </button>
                        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                    </div>
                </div>

                {/* Right Side - Date & Time */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
                        <div className="grid grid-cols-7 gap-1">
                            {weekDays.map((day, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedDate(day)}
                                    className={`p-2 rounded-lg text-center ${isSameDay(day, selectedDate) ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}`}
                                >
                                    <div className="text-xs">{format(day, 'EEE')}</div>
                                    <div className="font-bold">{format(day, 'd')}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Time</label>
                        <div className="grid grid-cols-4 gap-2">
                            {availableSlots.map(slot => (
                                <button
                                    key={slot}
                                    onClick={() => setSelectedTime(slot)}
                                    className={`p-2 rounded-lg text-center ${selectedTime === slot ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-blue-50'}`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminSchedule;
