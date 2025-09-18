import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import PatientDashboard from './pages/patient/PatientDashboard';
import TherapyCatalog from './pages/patient/TherapyCatalog';
import TherapyDetail from './pages/patient/TherapyDetail';
import Schedule from './pages/patient/Schedule';
import MySessions from './pages/patient/MySessions';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ 
  children, 
  roles = [] 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Landing />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}/dashboard`} replace />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to={`/${user.role}/dashboard`} replace />} />

        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute roles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patient/therapies" element={
          <ProtectedRoute roles={['patient']}>
            <TherapyCatalog />
          </ProtectedRoute>
        } />
        <Route path="/patient/therapy/:therapyId" element={
          <ProtectedRoute roles={['patient']}>
            <TherapyDetail />
          </ProtectedRoute>
        } />
        <Route path="/patient/schedule" element={
          <ProtectedRoute roles={['patient']}>
            <Schedule />
          </ProtectedRoute>
        } />
        <Route path="/patient/my-sessions" element={
          <ProtectedRoute roles={['patient']}>
            <MySessions />
          </ProtectedRoute>
        } />

        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute roles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor/patients" element={
          <ProtectedRoute roles={['doctor']}>
            <DoctorPatients />
          </ProtectedRoute>
        } />
        <Route path="/doctor/schedule" element={
          <ProtectedRoute roles={['doctor']}>
            <DoctorSchedule />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />

        {/* Common Routes */}
        <Route path="/notifications" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Notifications</h1>
                <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
                  <p className="text-gray-600 text-center">No notifications yet.</p>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
                <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
                  <p className="text-gray-600 text-center">Profile page is under development.</p>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        } />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;