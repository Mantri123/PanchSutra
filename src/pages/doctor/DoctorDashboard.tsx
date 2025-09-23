import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, Bell, Activity, Star, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { format, isToday } from 'date-fns';

interface Appointment {
  id: string;
  patientId: string;
  therapyId: string;
  time: string;
  duration: number;
  status: string;
  date: string;
}

interface Patient {
    id: string;
    name: string;
}

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { therapies, notifications } = useApp();
  
  // State for live data
  const [patientCount, setPatientCount] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchStaticData = async () => {
        const patientsQuery = query(collection(db, "users"), where("role", "==", "patient"));
        const patientSnapshot = await getDocs(patientsQuery);
        setPatients(patientSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name } as Patient)));
        setPatientCount(patientSnapshot.size);
    };

    fetchStaticData();

    // Set up a real-time listener for today's appointments
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const appointmentsQuery = query(
      collection(db, "appointments"), 
      where("doctorId", "==", user.id),
      where("date", "==", todayStr)
    );

    const unsubscribe = onSnapshot(appointmentsQuery, (querySnapshot) => {
      const appointmentList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Appointment));
      // Filter out completed ones for the main view
      setTodayAppointments(appointmentList.filter(apt => apt.status !== 'completed'));
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [user]);
  
  const getPatientName = (patientId: string) => {
      return patients.find(p => p.id === patientId)?.name || 'Unknown Patient';
  }

  const unreadNotifications = notifications.filter(n => !n.isRead && n.userId === user?.id).length;

  const stats = [
    {
      title: "Today's Patients",
      value: todayAppointments.length.toString(),
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      change: '+3 from yesterday'
    },
    {
      title: 'Total Patients',
      value: patientCount.toString(),
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      change: '+12 this month'
    },
    {
      title: 'Sessions Completed',
      value: '25', // Placeholder, would need another query
      icon: CheckCircle,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      change: '98% success rate'
    },
    {
      title: 'Average Rating',
      value: '4.9', // Placeholder
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      change: 'Based on 124 reviews'
    }
  ];
  
  const quickActions = [
    {
      title: 'View Patients',
      description: 'Manage patient records',
      icon: Users,
      link: '/doctor/patients',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Full Schedule',
      description: 'View your weekly calendar',
      icon: Calendar,
      link: '/doctor/schedule',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      title: 'Session Notes',
      description: 'Add therapy notes',
      icon: Activity,
      link: '/doctor/sessions',
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const mockFeedback = [
      { name: 'Rahul Sharma', comment: "Feeling much more relaxed after the session!", rating: 5 },
      { name: 'Priya Singh', comment: "The process was explained very well. Thank you!", rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-in slide-in-from-top-5 duration-700">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Good morning, {user?.name}! 👨‍⚕️
          </h1>
          <p className="text-gray-600 text-lg">
            Ready to help your patients on their wellness journey today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-in slide-in-from-bottom-5 duration-700`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} p-4 rounded-xl`}>
                  <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Schedule */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 animate-in slide-in-from-left-5 duration-700 delay-300">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Today's Schedule</h2>
                <Link
                  to="/doctor/schedule"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  View Full Schedule
                </Link>
              </div>
              
              {isLoading ? (
                  <div className="text-center py-12"><Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600"/></div>
              ) : todayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todayAppointments.slice(0, 4).map((appointment) => {
                    const therapy = therapies.find(t => t.id === appointment.therapyId);
                    return (
                      <div 
                        key={appointment.id} 
                        className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Clock className="h-7 w-7 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{therapy?.name}</h3>
                            <p className="text-gray-600">{getPatientName(appointment.patientId)}</p>
                            <p className="text-sm text-gray-500">{appointment.time} - {appointment.duration} min</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-lg">No appointments scheduled for today.</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 animate-in slide-in-from-left-5 duration-700 delay-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="group block p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600">{action.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 animate-in slide-in-from-right-5 duration-700 delay-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Overview</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Patient Satisfaction</span>
                    <span className="font-bold text-blue-600">98%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full" style={{width: '98%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Session Success Rate</span>
                    <span className="font-bold text-green-600">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full" style={{width: '95%'}}></div></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 animate-in slide-in-from-right-5 duration-700 delay-500">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Patient Feedback</h2>
                <div className="space-y-4">
                    {mockFeedback.map((fb, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-center mb-1">
                                <p className="font-semibold text-sm text-gray-800 mr-2">{fb.name}</p>
                                <div className="flex items-center">
                                    {[...Array(fb.rating)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">"{fb.comment}"</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 animate-in slide-in-from-right-5 duration-700 delay-700">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Tip</h2>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Patient Communication</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Always explain the therapy process to patients before starting. This builds trust and improves treatment outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

