import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, TrendingUp, Bell, Heart, MessageCircle, CheckCircle, XCircle, AlertTriangle, Send, Mic, MicOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { format } from 'date-fns';

// TypeScript declarations for Speech Recognition API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { sessions, notifications, therapies, appointments } = useApp();
  
  // New state for chat and time slot management (persisted in localStorage)
  const [showChat, setShowChat] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem('patient_showChat');
      if (raw === null) return true; // default to expanded
      return raw === 'true';
    } catch (e) {
      return true;
    }
  });
  const [chatMessage, setChatMessage] = useState('');
  const [showTimeSlots, setShowTimeSlots] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem('patient_showTimeSlots');
      if (raw === null) return true; // default to expanded
      return raw === 'true';
    } catch (e) {
      return true;
    }
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [showAlerts, setShowAlerts] = useState(true);
  
  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const userSessions = sessions.filter(s => s.patientId === user?.id);
  const userAppointments = appointments.filter(a => a.patientId === user?.id);
  const upcomingAppointment = userAppointments
    .filter(a => a.status === 'confirmed' || a.status === 'pending')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const completedSessions = userSessions.filter(s => s.status === 'completed').length;
  const unreadNotifications = notifications.filter(n => !n.isRead && n.userId === user?.id).length;

  // Mock data for time slots and chat
  const availableTimeSlots = [
    { id: '1', time: '09:00 AM', date: '2024-01-20', available: true },
    { id: '2', time: '10:30 AM', date: '2024-01-20', available: true },
    { id: '3', time: '02:00 PM', date: '2024-01-20', available: false },
    { id: '4', time: '03:30 PM', date: '2024-01-20', available: true },
    { id: '5', time: '09:00 AM', date: '2024-01-21', available: true },
    { id: '6', time: '11:00 AM', date: '2024-01-21', available: true },
  ];

  const chatMessages = [
    { id: '1', sender: 'doctor', message: 'Hello! How are you feeling today?', timestamp: '10:30 AM' },
    { id: '2', sender: 'patient', message: 'I am feeling much better, thank you!', timestamp: '10:32 AM' },
    { id: '3', sender: 'doctor', message: 'That\'s great to hear. Remember to drink plenty of water.', timestamp: '10:35 AM' },
  ];

  const upcomingTherapyAlerts = [
    { id: '1', message: 'Your Panchakarma therapy is scheduled in 2 days', type: 'warning', daysLeft: 2 },
    { id: '2', message: 'Abhyanga session tomorrow at 10:00 AM', type: 'info', daysLeft: 1 },
  ];

  // Wellness Journey removed per request

  const stats = [
    {
      title: 'Total Sessions',
      value: userSessions.length.toString(),
      icon: Calendar,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      change: '+2 this month'
    },
    {
      title: 'Completed',
      value: completedSessions.toString(),
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      change: `${Math.round((completedSessions / Math.max(userSessions.length, 1)) * 100)}% completion rate`
    },
    {
      title: 'Upcoming',
      value: userAppointments.filter(a => a.status === 'confirmed').length.toString(),
      icon: Clock,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      change: 'Next: Today'
    },
    {
      title: 'Wellness Score',
      value: '85%',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      change: '+5% from last month'
    }
  ];

  // Voice recognition setup
  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatMessage((prev: string) => prev + transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // Persist chat/time slot visibility preferences
  React.useEffect(() => {
    try {
      localStorage.setItem('patient_showChat', showChat ? 'true' : 'false');
    } catch (e) {
      // ignore storage errors
    }
  }, [showChat]);

  React.useEffect(() => {
    try {
      localStorage.setItem('patient_showTimeSlots', showTimeSlots ? 'true' : 'false');
    } catch (e) {
      // ignore storage errors
    }
  }, [showTimeSlots]);

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-in slide-in-from-top-5 duration-700">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's your wellness dashboard. Track your progress and manage your treatments.
          </p>
        </div>

        {/* Upcoming Therapy Alerts */}
        {showAlerts && upcomingTherapyAlerts.length > 0 && (
          <div className="mb-6 space-y-3">
            {upcomingTherapyAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border-l-4 ${
                  alert.type === 'warning' 
                    ? 'bg-orange-50 border-orange-400 text-orange-800' 
                    : 'bg-blue-50 border-blue-400 text-blue-800'
                } animate-in slide-in-from-top-5 duration-700`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-semibold">{alert.message}</span>
                  </div>
                  <button
                    onClick={() => setShowAlerts(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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
            {/* Next Appointment Card */}
            {upcomingAppointment && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl animate-in slide-in-from-left-5 duration-700 delay-300">
                <h2 className="text-2xl font-bold mb-6">Next Appointment</h2>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {therapies.find(t => t.id === upcomingAppointment.therapyId)?.name}
                      </h3>
                      <p className="text-blue-100 mt-2 text-lg">
                        {format(new Date(upcomingAppointment.date), 'EEEE, MMMM dd, yyyy')}
                      </p>
                      <p className="text-blue-100 text-lg">at {upcomingAppointment.time}</p>
                      <p className="text-blue-200 text-sm mt-2">Dr. Priya Patel</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">
                        {upcomingAppointment.duration}min
                      </p>
                      <p className="text-blue-200 text-sm">Duration</p>
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-4">
                    <Link
                      to={`/patient/therapy/${upcomingAppointment.therapyId}`}
                      className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                    >
                      View Details
                    </Link>
                    <button className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30">
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Doctor Communication & Time Slot Management */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 animate-in slide-in-from-left-5 duration-700 delay-600">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Doctor Communication & Scheduling</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Chat with Doctor */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                      Chat with Dr. Priya Patel
                    </h3>
                    <button
                      onClick={() => setShowChat(!showChat)}
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      {showChat ? 'Hide Chat' : 'Open Chat'}
                    </button>
                  </div>
                  
                  {showChat && (
                    <div className="border border-gray-200 rounded-xl p-4 h-64 flex flex-col">
                      <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                        {chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs p-3 rounded-lg ${
                                msg.sender === 'patient'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs opacity-75 mt-1">{msg.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          placeholder="Type your message or use voice..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          onClick={isListening ? stopListening : startListening}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            isListening 
                              ? 'bg-red-600 text-white hover:bg-red-700' 
                              : 'bg-gray-600 text-white hover:bg-gray-700'
                          }`}
                          title={isListening ? 'Stop listening' : 'Start voice input'}
                        >
                          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => {
                            if (chatMessage.trim()) {
                              // Add message logic here
                              setChatMessage('');
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                      {isListening && (
                        <div className="text-center text-sm text-red-600 animate-pulse">
                          🎤 Listening... Speak now
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Time Slot Management */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-green-600" />
                      Manage Time Slots
                    </h3>
                    <button
                      onClick={() => setShowTimeSlots(!showTimeSlots)}
                      className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                    >
                      {showTimeSlots ? 'Hide Slots' : 'View Slots'}
                    </button>
                  </div>
                  
                  {showTimeSlots && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {availableTimeSlots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedTimeSlot(slot.id)}
                            disabled={!slot.available}
                            className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                              slot.available
                                ? selectedTimeSlot === slot.id
                                  ? 'border-green-500 bg-green-50 text-green-700'
                                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <div className="text-sm font-semibold">{slot.time}</div>
                            <div className="text-xs">{slot.date}</div>
                          </button>
                        ))}
                      </div>
                      
                      {selectedTimeSlot && (
                        <div className="flex space-x-2">
                          <button className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept Slot
                          </button>
                          <button className="flex-1 flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                            <Clock className="h-4 w-4 mr-2" />
                            Reschedule
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Wellness Journey removed */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 animate-in slide-in-from-right-5 duration-700 delay-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Progress Overview</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Wellness Goals</span>
                    <span className="font-bold text-blue-600">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '85%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Treatment Plan</span>
                    <span className="font-bold text-green-600">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-1000 ease-out delay-200" style={{width: '60%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Session Completion</span>
                    <span className="font-bold text-purple-600">{Math.round((completedSessions / Math.max(userSessions.length, 1)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-1000 ease-out delay-400" style={{width: `${Math.round((completedSessions / Math.max(userSessions.length, 1)) * 100)}%`}}></div>
                  </div>
                </div>
              </div>
              <Link
                to="/patient/reports"
                className="mt-6 block text-center py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-semibold"
              >
                View Detailed Reports
              </Link>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 animate-in slide-in-from-right-5 duration-700 delay-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Notifications</h2>
                {unreadNotifications > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </div>
              
              {notifications.filter(n => n.userId === user?.id).slice(0, 3).length > 0 ? (
                <div className="space-y-4">
                  {notifications.filter(n => n.userId === user?.id).slice(0, 3).map((notification, _index) => (
                    <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Bell className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {format(new Date(notification.createdAt), 'MMM dd, HH:mm')}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No notifications yet.</p>
              )}
              
              <Link
                to="/notifications"
                className="mt-6 block text-center py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-semibold"
              >
                View All Notifications
              </Link>
            </div>

            {/* Health Tips removed per request */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;