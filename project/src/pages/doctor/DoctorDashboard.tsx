import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, TrendingUp, Bell, Activity, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { format, isToday } from 'date-fns';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { sessions, appointments, notifications, therapies } = useApp();

  const doctorSessions = sessions.filter(s => s.doctorId === user?.id);
  const doctorAppointments = appointments.filter(a => a.doctorId === user?.id);
  const todayAppointments = doctorAppointments.filter(a => isToday(new Date(a.date)));
  const unreadNotifications = notifications.filter(n => !n.isRead && n.userId === user?.id).length;

  const stats = [
    {
      title: 'Today\'s Patients',
      value: todayAppointments.length.toString(),
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      change: '+3 from yesterday'
    },
    {
      title: 'Total Patients',
      value: new Set(doctorSessions.map(s => s.patientId)).size.toString(),
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      change: '+12 this month'
    },
    {
      title: 'Sessions Completed',
      value: doctorSessions.filter(s => s.status === 'completed').length.toString(),
      icon: CheckCircle,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      change: '98% success rate'
    },
    {
      title: 'Average Rating',
      value: '4.9',
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
      title: 'Today\'s Schedule',
      description: 'View today\'s appointments',
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
              
              {todayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todayAppointments.slice(0, 4).map((appointment, index) => {
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
                            <p className="text-gray-600">Patient ID: {appointment.patientId}</p>
                            <p className="text-sm text-gray-500">{appointment.time} - {appointment.duration} min</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status === 'confirmed' ? 'Confirmed' : 
                             appointment.status === 'pending' ? 'Pending' : 
                             'Cancelled'}
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
            {/* Performance Overview */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 animate-in slide-in-from-right-5 duration-700 delay-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Overview</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Patient Satisfaction</span>
                    <span className="font-bold text-blue-600">98%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '98%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Session Success Rate</span>
                    <span className="font-bold text-green-600">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-1000 ease-out delay-200" style={{width: '95%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Monthly Target</span>
                    <span className="font-bold text-purple-600">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-1000 ease-out delay-400" style={{width: '87%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 animate-in slide-in-from-right-5 duration-700 delay-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                {unreadNotifications > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </div>
              
              {notifications.filter(n => n.userId === user?.id).slice(0, 3).length > 0 ? (
                <div className="space-y-4">
                  {notifications.filter(n => n.userId === user?.id).slice(0, 3).map((notification) => (
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

            {/* Professional Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 animate-in slide-in-from-right-5 duration-700 delay-700">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Professional Tip</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
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
    </div>
  );
};

export default DoctorDashboard;