import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, TrendingUp, Bell, Plus, ArrowRight, Heart, Activity, Star, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { format } from 'date-fns';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { sessions, notifications, therapies, appointments } = useApp();

  const userSessions = sessions.filter(s => s.patientId === user?.id);
  const userAppointments = appointments.filter(a => a.patientId === user?.id);
  const upcomingAppointment = userAppointments
    .filter(a => a.status === 'confirmed' || a.status === 'pending')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const completedSessions = userSessions.filter(s => s.status === 'completed').length;
  const unreadNotifications = notifications.filter(n => !n.isRead && n.userId === user?.id).length;

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

  const quickActions = [
    {
      title: 'Book New Therapy',
      description: 'Explore and book new treatments',
      icon: Plus,
      link: '/patient/therapies',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'View My Sessions',
      description: 'Check your upcoming appointments',
      icon: Calendar,
      link: '/patient/my-sessions',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      title: 'Progress Reports',
      description: 'Track your wellness journey',
      icon: Activity,
      link: '/patient/reports',
      color: 'from-green-500 to-emerald-600'
    }
  ];

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
            {upcomingAppointment ? (
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
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 animate-in slide-in-from-left-5 duration-700 delay-300">
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Upcoming Appointments</h3>
                  <p className="text-gray-600 mb-8 text-lg">Ready to book your next wellness session?</p>
                  <Link
                    to="/patient/therapies"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Browse Therapies
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            )}

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

            {/* Recent Sessions */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 animate-in slide-in-from-left-5 duration-700 delay-700">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Recent Sessions</h2>
                <Link
                  to="/patient/my-sessions"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  View All
                </Link>
              </div>
              
              {userSessions.length > 0 ? (
                <div className="space-y-4">
                  {userSessions.slice(0, 3).map((session, index) => {
                    const therapy = therapies.find(t => t.id === session.therapyId);
                    return (
                      <div 
                        key={session.id} 
                        className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Heart className="h-7 w-7 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{therapy?.name}</h3>
                            <p className="text-gray-600">
                              {format(new Date(session.date), 'MMM dd, yyyy')} at {session.startTime}
                            </p>
                            <p className="text-sm text-gray-500">Dr. Priya Patel</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            session.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : session.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : session.status === 'in-progress'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {session.status === 'completed' ? 'Completed' : 
                             session.status === 'scheduled' ? 'Scheduled' : 
                             session.status === 'in-progress' ? 'In Progress' :
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
                  <p className="text-lg">No sessions yet. Book your first therapy to get started!</p>
                </div>
              )}
            </div>
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
                  {notifications.filter(n => n.userId === user?.id).slice(0, 3).map((notification, index) => (
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

            {/* Health Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 animate-in slide-in-from-right-5 duration-700 delay-700">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Wellness Tip</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Hydration Reminder</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Drink warm water with lemon in the morning to kickstart your digestive fire (Agni).
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

export default PatientDashboard;