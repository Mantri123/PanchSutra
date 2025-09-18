import React, { useState } from 'react';
import { Calendar, Clock, User, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { format, addDays, startOfWeek, isSameDay, isToday } from 'date-fns';

const DoctorSchedule: React.FC = () => {
  const { user } = useAuth();
  const { appointments, therapies, updateAppointment } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const doctorAppointments = appointments.filter(a => a.doctorId === user?.id);
  const weekStart = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getAppointmentsForDate = (date: Date) => {
    return doctorAppointments.filter(apt => 
      isSameDay(new Date(apt.date), date)
    ).sort((a, b) => a.time.localeCompare(b.time));
  };

  const handleStatusUpdate = (appointmentId: string, status: 'confirmed' | 'cancelled') => {
    updateAppointment(appointmentId, { status });
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-in slide-in-from-top-5 duration-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Schedule</h1>
              <p className="text-gray-600">Manage your appointments and availability</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-xl border border-blue-200 p-1">
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    viewMode === 'week' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    viewMode === 'day' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Day
                </button>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <Plus className="h-5 w-5 inline mr-2" />
                Block Time
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'week' ? (
          /* Week View */
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-700 delay-300">
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-4 bg-blue-50 font-semibold text-gray-700">Time</div>
              {weekDays.map((day, index) => (
                <div key={index} className={`p-4 text-center font-semibold ${
                  isToday(day) ? 'bg-blue-600 text-white' : 'bg-blue-50 text-gray-700'
                }`}>
                  <div className="text-sm">{format(day, 'EEE')}</div>
                  <div className="text-lg">{format(day, 'd')}</div>
                </div>
              ))}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <div className="p-4 bg-gray-50 font-medium text-gray-600 border-r border-gray-200">
                    {time}
                  </div>
                  {weekDays.map((day, dayIndex) => {
                    const dayAppointments = getAppointmentsForDate(day);
                    const appointment = dayAppointments.find(apt => apt.time === time);
                    
                    return (
                      <div key={dayIndex} className="p-2 border-r border-gray-100 min-h-16">
                        {appointment && (
                          <div className={`p-2 rounded-lg text-xs ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : appointment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            <div className="font-semibold truncate">
                              {therapies.find(t => t.id === appointment.therapyId)?.name}
                            </div>
                            <div className="truncate">Patient: {appointment.patientId}</div>
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
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 animate-in slide-in-from-left-5 duration-700 delay-300">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                      className="p-2 border border-gray-300 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                      className="p-2 border border-gray-300 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors"
                    >
                      →
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {getAppointmentsForDate(selectedDate).map((appointment, index) => {
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
                        <div className="flex items-center space-x-3">
                          {appointment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              >
                                <XCircle className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Calendar */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 animate-in slide-in-from-right-5 duration-700 delay-300">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Date Select</h3>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {weekDays.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`p-2 rounded-lg text-center transition-all duration-300 ${
                        isSameDay(day, selectedDate)
                          ? 'bg-blue-600 text-white shadow-lg'
                          : isToday(day)
                          ? 'bg-blue-100 text-blue-600 font-semibold'
                          : 'hover:bg-blue-50 text-gray-700'
                      }`}
                    >
                      <div className="text-xs">{format(day, 'EEE')}</div>
                      <div className="font-bold">{format(day, 'd')}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Today's Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 animate-in slide-in-from-right-5 duration-700 delay-500">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Appointments:</span>
                    <span className="font-bold text-blue-600">
                      {getAppointmentsForDate(new Date()).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confirmed:</span>
                    <span className="font-bold text-green-600">
                      {getAppointmentsForDate(new Date()).filter(a => a.status === 'confirmed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending:</span>
                    <span className="font-bold text-yellow-600">
                      {getAppointmentsForDate(new Date()).filter(a => a.status === 'pending').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Availability Settings */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 animate-in slide-in-from-right-5 duration-700 delay-700">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Availability Settings</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold">
                    <Edit className="h-5 w-5 inline mr-2" />
                    Edit Availability
                  </button>
                  <button className="w-full bg-white text-blue-600 py-3 px-4 rounded-xl border-2 border-blue-200 hover:bg-blue-50 transition-colors font-semibold">
                    <Plus className="h-5 w-5 inline mr-2" />
                    Add Break Time
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSchedule;