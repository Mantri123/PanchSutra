import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, User, Calendar, Phone, Mail, Eye, Plus, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { format } from 'date-fns';

const DoctorPatients: React.FC = () => {
  const { user } = useAuth();
  const { sessions, appointments } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock patient data - in real app, this would come from API
  const mockPatients = [
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91-9876543210',
      age: 38,
      constitution: 'Vata',
      lastVisit: '2024-01-15',
      totalSessions: 12,
      status: 'active'
    },
    {
      id: '3',
      name: 'Priya Singh',
      email: 'priya@example.com',
      phone: '+91-9876543213',
      age: 32,
      constitution: 'Pitta',
      lastVisit: '2024-01-10',
      totalSessions: 8,
      status: 'active'
    },
    {
      id: '4',
      name: 'Amit Kumar',
      email: 'amit@example.com',
      phone: '+91-9876543214',
      age: 45,
      constitution: 'Kapha',
      lastVisit: '2023-12-20',
      totalSessions: 15,
      status: 'inactive'
    }
  ];

  const doctorPatients = mockPatients.filter(p => 
    sessions.some(s => s.doctorId === user?.id && s.patientId === p.id) ||
    appointments.some(a => a.doctorId === user?.id && a.patientId === p.id)
  );

  const filteredPatients = doctorPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-in slide-in-from-top-5 duration-700">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Patients</h1>
          <p className="text-gray-600">Manage your patient records and treatment history</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8 animate-in slide-in-from-top-5 duration-700 delay-200">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            >
              <option value="all">All Patients</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold">
              <Filter className="h-5 w-5 inline mr-2" />
              Advanced Filters
            </button>
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient, index) => (
            <div
              key={patient.id}
              className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-in slide-in-from-bottom-5 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">Age: {patient.age}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  patient.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {patient.status}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {patient.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {patient.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  Constitution: {patient.constitution}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Last visit: {format(new Date(patient.lastVisit), 'MMM dd, yyyy')}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{patient.totalSessions}</p>
                  <p className="text-xs text-gray-600">Total Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">4.8</p>
                  <p className="text-xs text-gray-600">Avg Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">92%</p>
                  <p className="text-xs text-gray-600">Compliance</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Link
                  to={`/doctor/patient/${patient.id}`}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors text-center font-semibold"
                >
                  <Eye className="h-4 w-4 inline mr-1" />
                  View Details
                </Link>
                <button className="p-2 border border-gray-300 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-colors">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPatients.length === 0 && (
          <div className="text-center py-16 animate-in fade-in-50 duration-700">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Patients Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search criteria.' : 'You haven\'t treated any patients yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatients;