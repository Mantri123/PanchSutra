import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { AppProvider } from './contexts/AppContext.tsx';
import Layout from './components/Layout/Layout.tsx';
import Landing from './pages/Landing.tsx';
import Login from './pages/auth/Login.tsx';
import Signup from './pages/auth/Signup.tsx';
import ForgotPassword from './pages/auth/ForgotPassword.tsx';
import PatientDashboard from './pages/patient/PatientDashboard.tsx';
import TherapyCatalog from './pages/patient/TherapyCatalog.tsx';
import TherapyDetail from './pages/patient/TherapyDetail.tsx';
import Schedule from './pages/patient/Schedule.tsx';
import MySessions from './pages/patient/MySessions.tsx';
import DoctorDashboard from './pages/doctor/DoctorDashboard.tsx';
import DoctorPatients from './pages/doctor/DoctorPatients.tsx';
import DoctorSchedule from './pages/doctor/DoctorSchedule.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import AdminUsers from './pages/admin/AdminUsers.tsx';
import AdminSchedule from './pages/admin/AdminSchedule';
import AdminAppointments from './pages/admin/AdminAppointments'; // Import new page


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
      <Route path="/admin/schedule" element={
  <ProtectedRoute roles={['admin']}>
    <AdminSchedule />
  </ProtectedRoute>
} />
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Landing />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}/dashboard`} replace />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to={`/${user.role}/dashboard`} replace />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to={`/${user.role}/dashboard`} replace />} />

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
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/schedule" element={<ProtectedRoute roles={['admin']}><AdminSchedule /></ProtectedRoute>} />
        <Route path="/admin/appointments" element={<ProtectedRoute roles={['admin']}><AdminAppointments /></ProtectedRoute>} /> {/* Add new route */}


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

