import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, User, Eye, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Define a more detailed Patient interface for this component
interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient';
  dateOfBirth?: string;
  height?: number; // in cm
  weight?: number; // in kg
}

const DoctorPatients: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return;
      setIsLoading(true);

      // In a real app, you'd have a dedicated subcollection of patients for each doctor.
      // For this hackathon, we'll fetch all patients and display them.
      const patientsQuery = query(collection(db, "users"), where("role", "==", "patient"));
      
      try {
        const querySnapshot = await getDocs(patientsQuery);
        const patientList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Patient));
        setPatients(patientList);
      } catch (error) {
        console.error("Error fetching patients: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [user]);

  const calculateAge = (dob: string | undefined): number | string => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredPatients = patients.filter(patient => {
    return patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patient.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-in slide-in-from-top-5 duration-700">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Patients</h1>
          <p className="text-gray-600">View your patient records and treatment history</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8 animate-in slide-in-from-top-5 duration-700 delay-200">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </div>
            <button 
                onClick={() => setSearchTerm('')}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
            >
                <Filter className="h-5 w-5 inline mr-2" />
                Clear Search
            </button>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading && <div className="text-center py-16"><Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" /></div>}

        {/* Patients Grid */}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient, index) => (
              <div
                key={patient.id}
                className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-in slide-in-from-bottom-5 duration-700"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-gray-900">{patient.name}</h3>
                        <p className="text-md text-gray-600">Age: {calculateAge(patient.dateOfBirth)}</p>
                    </div>
                </div>

                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border">
                    <div className="flex justify-between items-center text-sm text-gray-700">
                        <span className="font-semibold">Height:</span>
                        <span>{patient.height ? `${patient.height} cm` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-700">
                        <span className="font-semibold">Weight:</span>
                        <span>{patient.weight ? `${patient.weight} kg` : 'N/A'}</span>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && filteredPatients.length === 0 && (
          <div className="text-center py-16 animate-in fade-in-50 duration-700">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Patients Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search criteria.' : 'No patients have been added to the system yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatients;

