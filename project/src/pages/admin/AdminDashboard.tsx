import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, DollarSign, Activity, Bell, Settings, BarChart3, UserCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { isToday } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { sessions, appointments, notifications } = useApp();

  const todayAppointments = appointments.filter(a => isToday(new Date(a.date)));
  const totalRevenue = sessions.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.cost, 0);
  const unreadNotifications = notifications.filter(n => !n.isRead && n.userId === user?.id).length;

  const stats = [
    {
      title: 'Total Patients',
      value: '1,247',
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      change: '+12% from last month'
    },
    {
      title: 'Today\'s Sessions',
      value: todayAppointments.length.toString(),
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      change: '8 completed, 4 pending'
    },
    {
      title: 'Monthly Revenue',
      value: `₹${(totalRevenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      change: '+18% from last month'
    },
    {
      title: 'Active Doctors',
      value: '24',
      icon: UserCheck,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      change: '2 new this week'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'Add, edit, or remove users',
      icon: Users,
      link: '/admin/users',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Center Management',
      description: 'Manage therapy centers',
      icon: Settings,
      link: '/admin/centers',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      title: 'Analytics',
      description: 'View detailed reports',
      icon: BarChart3,
      link: '/admin/reports',
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const recentActivities = [
    { type: 'booking', message: 'New appointment booked by Rahul Sharma', time: '2 min ago' },
    { type: 'completion', message: 'Dr. Priya completed Abhyanga session', time: '15 min ago' },
    { type: 'registration', message: 'New doctor Dr. Amit registered', time: '1 hour ago' },
    { type: 'cancellation', message: 'Appointment cancelled by Priya Singh', time: '2 hours ago' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-in slide-in-from-top-5 duration-700">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Receptionist Dashboard 🏥
          </h1>
          <p className="text-gray-600 text-lg">
            Monitor and manage your PanchSutra platform operations.
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
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 animate-in slide-in-from-left-5 duration-700 delay-300">
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

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 animate-in slide-in-from-left-5 duration-700 delay-500">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Recent Activities</h2>
                <Link
                  to="/admin/activities"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all duration-300"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'booking' ? 'bg-green-100' :
                      activity.type === 'completion' ? 'bg-blue-100' :
                      activity.type === 'registration' ? 'bg-purple-100' :
                      'bg-red-100'
                    }`}>
                      <Activity className={`h-5 w-5 ${
                        activity.type === 'booking' ? 'text-green-600' :
                        activity.type === 'completion' ? 'text-blue-600' :
                        activity.type === 'registration' ? 'text-purple-600' :
                        'text-red-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Health */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 animate-in slide-in-from-right-5 duration-700 delay-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">System Health</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Server Uptime</span>
                    <span className="font-bold text-green-600">99.9%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '99.9%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Database Performance</span>
                    <span className="font-bold text-blue-600">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out delay-200" style={{width: '95%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">User Satisfaction</span>
                    <span className="font-bold text-purple-600">97%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-1000 ease-out delay-400" style={{width: '97%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 animate-in slide-in-from-right-5 duration-700 delay-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">System Alerts</h2>
                {unreadNotifications > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-900">System Update Complete</p>
                    <p className="text-xs text-green-700">All systems running smoothly</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Bell className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">New Doctor Registration</p>
                    <p className="text-xs text-blue-700">Dr. Amit Kumar pending approval</p>
                  </div>
                </div>
              </div>
              
              <Link
                to="/notifications"
                className="mt-6 block text-center py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-semibold"
              >
                View All Alerts
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 animate-in slide-in-from-right-5 duration-700 delay-700">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Active Centers:</span>
                  <span className="text-xl font-bold text-blue-600">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Therapies:</span>
                  <span className="text-xl font-bold text-green-600">25</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Success Rate:</span>
                  <span className="text-xl font-bold text-purple-600">98.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;