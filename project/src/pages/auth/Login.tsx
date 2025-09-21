import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'patient' | 'doctor' | 'admin'>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  // navigation handled at higher level after login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!emailOrPhone || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(emailOrPhone, password, accountType);
    if (success) {
      // Navigation will be handled by App.tsx based on user role
    } else {
      setError('Invalid credentials. Try demo credentials below.');
    }
  };

  const demoCredentials = [
  { role: 'Patient', email: 'patient@demo.com', phone: '+91-9876543210', password: 'demo123', color: 'bg-green-50 border-green-200 hover:bg-green-100' },
  { role: 'Doctor', email: 'doctor@demo.com', phone: '+91-9876543220', password: 'demo123', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
  { role: 'Receptionist', email: 'admin@demo.com', phone: '+91-9876543230', password: 'demo123', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-xl">PS</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your PanchSutra account</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl animate-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="accountType" className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  id="accountType"
                  name="accountType"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as 'patient' | 'doctor' | 'admin')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Receptionist</option>
                </select>
              </div>

              <div>
                <label htmlFor="emailOrPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address or Phone Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    id="emailOrPhone"
                    name="emailOrPhone"
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                    placeholder="Enter your email or phone number"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-semibold transition-colors">
                  Sign up here
                </Link>
              </p>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm font-semibold text-gray-700 mb-4">Demo Credentials</p>
            <div className="space-y-3">
              {demoCredentials.map((cred, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-center text-xs font-medium text-gray-600">{cred.role}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setEmailOrPhone(cred.email);
                        setPassword(cred.password);
                        setAccountType(cred.role.toLowerCase() as 'patient' | 'doctor' | 'admin');
                      }}
                      className={`text-left px-3 py-2 text-xs border rounded-lg transition-all duration-300 transform hover:scale-105 ${cred.color}`}
                    >
                      <div className="font-semibold">Email</div>
                      <div className="opacity-75">{cred.email}</div>
                    </button>
                    <button
                      onClick={() => {
                        setEmailOrPhone(cred.phone);
                        setPassword(cred.password);
                        setAccountType(cred.role.toLowerCase() as 'patient' | 'doctor' | 'admin');
                      }}
                      className={`text-left px-3 py-2 text-xs border rounded-lg transition-all duration-300 transform hover:scale-105 ${cred.color}`}
                    >
                      <div className="font-semibold">Phone</div>
                      <div className="opacity-75">{cred.phone}</div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;