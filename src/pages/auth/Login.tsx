import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [error, setError] = useState('');
  const { login, setupRecaptcha, sendOtp, verifyOtp, isLoading } = useAuth();
  
  // State for Email Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // State for Phone Login
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  // Set up the reCAPTCHA verifier once
  useEffect(() => {
    const setup = async () => {
        const verifier = await setupRecaptcha('recaptcha-container');
        setRecaptchaVerifier(verifier);
    };
    setup();
  }, [setupRecaptcha]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    const { success, message } = await login(email, password);
    if (!success) {
      setError(message);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!recaptchaVerifier) {
        setError('reCAPTCHA not ready. Please wait a moment and try again.');
        return;
    }
    if (phone.length < 10) {
      setError('Please enter a valid phone number with country code (e.g., +91XXXXXXXXXX)');
      return;
    }
    const result = await sendOtp(phone, recaptchaVerifier);
    if (result) {
      setConfirmationResult(result);
      setShowOtpInput(true);
    } else {
      setError('Failed to send OTP. Please check the phone number or try again.');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!confirmationResult || !otp) {
      setError('Something went wrong. Please try sending the OTP again.');
      return;
    }
    const { success, message } = await verifyOtp(confirmationResult, otp);
    if (!success) {
      setError(message);
    }
  };
  
  const demoCredentials = [
    { role: 'Patient', email: 'patient@demo.com', password: 'demo123', color: 'bg-green-50 border-green-200 hover:bg-green-100' },
    { role: 'Doctor', email: 'doctor@demo.com', password: 'demo123', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
    { role: 'Receptionist', email: 'admin@demo.com', password: '123456', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100' }
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

          <div className="mt-8 flex justify-center bg-gray-100 rounded-xl p-1">
            <button onClick={() => setLoginType('email')} className={`w-1/2 py-2 rounded-lg font-semibold transition-all ${loginType === 'email' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'}`}>
              Email
            </button>
            <button onClick={() => setLoginType('phone')} className={`w-1/2 py-2 rounded-lg font-semibold transition-all ${loginType === 'phone' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'}`}>
              Phone
            </button>
          </div>
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {loginType === 'email' && (
            <form className="mt-6 space-y-6" onSubmit={handleEmailSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="Enter your email" />
                </div>
              </div>
              <div>
                <label htmlFor="password"className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="Enter your password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>
              
              {/* --- THIS IS THE CHANGE --- */}
              <div className="flex items-center justify-end">
                  <div className="text-sm">
                      <Link
                          to="/forgot-password"
                          className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                      >
                          Forgot your password?
                      </Link>
                  </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold">
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In'}
              </button>
            </form>
          )}

          {loginType === 'phone' && (
            <form className="mt-6 space-y-6" onSubmit={!showOtpInput ? handlePhoneSubmit : handleOtpSubmit}>
              {!showOtpInput ? (
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">Enter OTP</label>
                  <input id="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="6-digit code" />
                </div>
              )}
              <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold">
                 {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (showOtpInput ? 'Verify OTP' : 'Send OTP')}
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm font-semibold text-gray-700 mb-4">Demo Credentials</p>
            <div className="space-y-3">
              {demoCredentials.map((cred, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-center text-xs font-medium text-gray-600">{cred.role}</div>
                  <button
                    onClick={() => {
                      setLoginType('email');
                      setEmail(cred.email);
                      setPassword(cred.password);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs border rounded-lg transition-all duration-300 transform hover:scale-105 ${cred.color}`}
                  >
                    <div className="font-semibold">Email: <span className="opacity-75">{cred.email}</span></div>
                    <div className="font-semibold">Password: <span className="opacity-75">{cred.password}</span></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;