import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, X, Loader2, Mail, Phone, User as UserIcon } from 'lucide-react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
  dateOfBirth?: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'patient' as 'patient' | 'doctor' | 'admin',
    dateOfBirth: '',
    height: '',
    weight: '',
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const usersCollectionRef = collection(db, "users");
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as User)));
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingUser(true);
    setModalError('');

    if (!newUser.name || !newUser.email || !newUser.phone) {
        setModalError('Please fill in name, email, and phone.');
        setIsCreatingUser(false);
        return;
    }

    try {
      const userProfile: any = {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: serverTimestamp(),
      };

      if (newUser.role === 'patient') {
        userProfile.dateOfBirth = newUser.dateOfBirth || null;
        userProfile.height = newUser.height ? parseFloat(newUser.height) : null;
        userProfile.weight = newUser.weight ? parseFloat(newUser.weight) : null;
      }

      const docRef = await addDoc(collection(db, "users"), userProfile);
      setUsers(prevUsers => [...prevUsers, { ...userProfile, id: docRef.id } as User]);
      
      setIsAddUserModalOpen(false);
      setNewUser({ name: '', email: '', phone: '', role: 'patient', dateOfBirth: '', height: '', weight: '' });

    } catch (error: any) {
        setModalError(error.message || 'Failed to create user.');
    } finally {
        setIsCreatingUser(false);
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
              <p className="text-gray-600">Manage patients, doctors, and receptionist users</p>
            </div>
            <button 
              onClick={() => setIsAddUserModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg"
            >
              <Plus className="h-5 w-5 inline mr-2" />
              Add User
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                >
                    <option value="all">All Roles</option>
                    <option value="patient">Patients</option>
                    <option value="doctor">Doctors</option>
                    <option value="admin">Receptionists</option>
                </select>
                <button 
                    onClick={() => { setSearchTerm(''); setFilterRole('all'); }}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
                >
                    <Filter className="h-5 w-5 inline mr-2" />
                    Clear Filters
                </button>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-blue-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User Details</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={3} className="text-center py-16"><Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" /></td></tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-blue-50">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {user.role === 'patient' && user.dateOfBirth ? `Age: ${calculateAge(user.dateOfBirth)}` : null}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                                            user.role === 'patient' ? 'bg-green-100 text-green-800' :
                                            user.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                                            'bg-purple-100 text-purple-800'
                                        }`}>{user.role}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                      <div className="flex items-center"><Mail className="h-4 w-4 mr-2" />{user.email}</div>
                                      <div className="flex items-center mt-1"><Phone className="h-4 w-4 mr-2" />{user.phone}</div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
      
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
                <button onClick={() => setIsAddUserModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                </button>
            </div>
            
            {modalError && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{modalError}</p>}
            
            <form onSubmit={handleCreateUser}>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input type="text" name="name" value={newUser.name} onChange={handleNewUserChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="Enter full name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input type="email" name="email" value={newUser.email} onChange={handleNewUserChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="Enter email" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input type="tel" name="phone" value={newUser.phone} onChange={handleNewUserChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="Enter phone number" />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <select name="role" value={newUser.role} onChange={handleNewUserChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl">
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Receptionist</option>
                  </select>
                </div>

                {newUser.role === 'patient' && (
                  <>
                    <div className="pt-2">
                      <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                      <input type="date" name="dateOfBirth" value={newUser.dateOfBirth} onChange={handleNewUserChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="height" className="block text-sm font-semibold text-gray-700 mb-2">Height (cm)</label>
                        <input type="number" name="height" value={newUser.height} onChange={handleNewUserChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="e.g., 175" />
                      </div>
                      <div>
                        <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
                        <input type="number" name="weight" value={newUser.weight} onChange={handleNewUserChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="e.g., 70" />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={isCreatingUser} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50">
                  {isCreatingUser ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

