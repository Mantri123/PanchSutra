import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, Loader2, ArrowLeft } from 'lucide-react';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { useApp } from '../../contexts/AppContext';

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  therapyId: string;
  date: string;
  time: string;
  status: string;
}

interface User {
  id: string;
  name: string;
}

const AdminAppointments: React.FC = () => {
  const { therapies } = useApp();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all users to map IDs to names
        const usersSnapshot = await getDocs(collection(db, "users"));
        setUsers(usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User)));

        // Fetch all upcoming appointments
        const today = format(new Date(), 'yyyy-MM-dd');
        const appointmentsQuery = query(
            collection(db, "appointments"), 
            where("date", ">=", today),
            orderBy("date"),
            orderBy("time")
        );
        const appointmentSnapshot = await getDocs(appointmentsQuery);
        setAppointments(appointmentSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Appointment)));

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getUserName = (userId: string) => users.find(u => u.id === userId)?.name || 'Unknown';

  // Group appointments by date
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const date = appointment.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/admin/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mb-4 group">
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scheduled Appointments</h1>
          <p className="text-gray-600">A complete overview of all upcoming sessions.</p>
        </div>

        {isLoading ? (
            <div className="text-center py-20"><Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600"/></div>
        ) : (
            <div className="space-y-8">
                {Object.keys(groupedAppointments).length === 0 && (
                    <div className="text-center bg-white rounded-xl p-12 shadow-md">
                        <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700">No Upcoming Appointments</h3>
                        <p className="text-gray-500">There are currently no sessions scheduled.</p>
                    </div>
                )}
                {Object.keys(groupedAppointments).map(date => (
                    <div key={date}>
                        <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b-2 border-blue-200 mb-4">
                            {format(new Date(date), 'EEEE, MMMM dd, yyyy')}
                        </h2>
                        <div className="space-y-4">
                            {groupedAppointments[date].map(app => {
                                const therapy = therapies.find(t => t.id === app.therapyId);
                                return (
                                    <div key={app.id} className="bg-white rounded-xl shadow-md border p-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-lg text-gray-900">{therapy?.name}</p>
                                            <p className="text-sm text-gray-600 flex items-center mt-1">
                                                <User className="h-4 w-4 mr-2" />
                                                Patient: {getUserName(app.patientId)}
                                            </p>
                                            <p className="text-sm text-gray-600 flex items-center">
                                                <User className="h-4 w-4 mr-2" />
                                                Doctor: {getUserName(app.doctorId)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold flex items-center"><Clock className="h-4 w-4 mr-2"/>{app.time}</p>
                                            <span className={`mt-1 inline-block px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                                app.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;