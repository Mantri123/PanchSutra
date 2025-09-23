import React, { useState } from 'react';
import { Calendar, Clock, User, Star, Filter, Eye, RotateCcw, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { format, isFuture, isPast } from 'date-fns';

const MySessions: React.FC = () => {
  const { user } = useAuth();
  const { sessions, appointments, therapies, updateAppointment } = useApp();
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const userSessions = sessions.filter(s => s.patientId === user?.id);
  const userAppointments = appointments.filter(a => a.patientId === user?.id);

  const allBookings = [
    ...userSessions.map(s => ({ ...s, type: 'session' })),
    ...userAppointments.map(a => ({ ...a, type: 'appointment' }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredBookings = allBookings.filter(booking => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'upcoming') return isFuture(new Date(booking.date));
    if (filterStatus === 'completed') return booking.status === 'completed';
    if (filterStatus === 'cancelled') return booking.status === 'cancelled';
    return booking.status === filterStatus;
  });

  const handleReschedule = (bookingId: string) => {
    console.log('Reschedule booking:', bookingId);
  };

  const handleCancel = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      updateAppointment(bookingId, { status: 'cancelled' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-in slide-in-from-top-5 duration-700">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Sessions</h1>
          <p className="text-gray-600">Track and manage your therapy appointments</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8 animate-in slide-in-from-top-5 duration-700 delay-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              >
                <option value="all">All Sessions</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  viewMode === 'calendar' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Calendar View
              </button>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        {viewMode === 'list' ? (
          <div className="space-y-6">
            {filteredBookings.map((booking, index) => {
              const therapy = therapies.find(t => t.id === booking.therapyId);
              const isUpcoming = isFuture(new Date(booking.date));
              
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-in slide-in-from-bottom-5 duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <img
                          src={therapy?.image}
                          alt={therapy?.name}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                        <div className="absolute -top-2 -right-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            booking.status === 'completed' ? 'bg-green-500 text-white' :
                            booking.status === 'confirmed' || booking.status === 'scheduled' ? 'bg-blue-500 text-white' :
                            booking.status === 'pending' ? 'bg-yellow-500 text-white' :
                            'bg-red-500 text-white'
                          }`}>
                            {booking.status === 'completed' ? '✓' :
                             booking.status === 'confirmed' || booking.status === 'scheduled' ? '●' :
                             booking.status === 'pending' ? '?' : '✕'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{therapy?.name}</h3>
                        <div className="flex items-center space-x-4 text-gray-600 mb-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="font-medium">{format(new Date(booking.date), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="font-medium">
                              {booking.type === 'appointment' ? booking.time : booking.startTime}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span className="font-medium">Dr. Priya Patel</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'confirmed' || booking.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status === 'confirmed' ? 'Confirmed' :
                             booking.status === 'scheduled' ? 'Scheduled' :
                             booking.status === 'completed' ? 'Completed' :
                             booking.status === 'pending' ? 'Pending' :
                             'Cancelled'}
                          </span>
                          <span className="text-sm text-gray-500">
                            Duration: {therapy?.duration} min
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      {isUpcoming && booking.status !== 'cancelled' && (
                        <>
                          <button
                            onClick={() => handleReschedule(booking.id)}
                            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                          >
                            <RotateCcw className="h-4 w-4 inline mr-1" />
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
                          >
                            <X className="h-4 w-4 inline mr-1" />
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'completed' && (
                        <button className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors font-medium">
                          <Star className="h-4 w-4 inline mr-1" />
                          Rate Session
                        </button>
                      )}
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                        <Eye className="h-4 w-4 inline mr-1" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredBookings.length === 0 && (
              <div className="text-center py-16 animate-in fade-in-50 duration-700">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Sessions Found</h3>
                <p className="text-gray-600 mb-6">
                  {filterStatus === 'all' 
                    ? "You haven't booked any sessions yet." 
                    : `No ${filterStatus} sessions found.`}
                </p>
                <Link
                  to="/patient/therapies"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  Browse Therapies
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 animate-in slide-in-from-bottom-5 duration-700 delay-400">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Calendar View</h2>
            <div className="text-center py-16 text-gray-500">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Calendar view coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySessions;