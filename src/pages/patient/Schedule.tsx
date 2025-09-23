import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, User, MapPin, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

const Schedule: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { therapies, centers, getAvailableSlots, bookAppointment } = useApp();
  const { user } = useAuth();
  
  const selectedTherapyId = searchParams.get('therapy');
  const selectedTherapy = therapies.find(t => t.id === selectedTherapyId);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(centers[0]?.id || '');
  const [selectedDoctor] = useState('2'); // Mock doctor ID
  const [step, setStep] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  const weekStart = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const availableSlots = selectedDate ? getAvailableSlots(selectedDoctor, format(selectedDate, 'yyyy-MM-dd')) : [];

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };

  const handleBooking = async () => {
    if (!selectedTherapy || !selectedDate || !selectedTime || !user) return;
    
    setIsBooking(true);
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    bookAppointment({
      patientId: user.id,
      doctorId: selectedDoctor,
      therapyId: selectedTherapy.id,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      duration: selectedTherapy.duration,
      status: 'confirmed',
      centerId: selectedCenter
    });
    
    setIsBooking(false);
    navigate('/patient/dashboard');
  }

  if (!selectedTherapy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Therapy Not Selected</h2>
          <p className="text-gray-600 mb-6">Please select a therapy to schedule an appointment.</p>
          <button
            onClick={() => navigate('/patient/therapies')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Browse Therapies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-in slide-in-from-top-5 duration-700">
          <button
            onClick={() => navigate('/patient/therapies')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Therapies
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Appointment</h1>
          <p className="text-gray-600">Book your {selectedTherapy.name} session</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 animate-in slide-in-from-top-5 duration-700 delay-200">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <p className="text-sm text-gray-600">
              Step {step} of 3: {step === 1 ? 'Select Date' : step === 2 ? 'Choose Time' : 'Confirm Booking'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Booking Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 animate-in slide-in-from-left-5 duration-700 delay-300">
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Date</h2>
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {weekDays.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(day)}
                        disabled={day < new Date()}
                        className={`p-4 rounded-xl text-center transition-all duration-300 ${
                          isSameDay(day, selectedDate)
                            ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                            : day < new Date()
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md'
                        }`}
                      >
                        <div className="text-xs font-medium">
                          {format(day, 'EEE')}
                        </div>
                        <div className="text-lg font-bold mt-1">
                          {format(day, 'd')}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!selectedDate}
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Continue to Time Selection
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Time Slot</h2>
                  <div className="mb-6">
                    <p className="text-gray-600">
                      Selected Date: <span className="font-semibold text-blue-600">
                        {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                      </span>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`p-4 rounded-xl text-center transition-all duration-300 ${
                          selectedTime === slot
                            ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                            : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md'
                        }`}
                      >
                        <Clock className="h-5 w-5 mx-auto mb-1" />
                        <div className="font-semibold">{slot}</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors font-semibold"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!selectedTime}
                      className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Review Booking
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Booking</h2>
                  
                  <div className="space-y-6 mb-8">
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="font-bold text-gray-900 mb-4">Booking Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Therapy:</span>
                          <span className="font-semibold">{selectedTherapy.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-semibold">{format(selectedDate, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-semibold">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-semibold">{selectedTherapy.duration} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Doctor:</span>
                          <span className="font-semibold">Dr. Priya Patel</span>
                        </div>
                        <div className="flex justify-between border-t border-blue-200 pt-3">
                          <span className="text-gray-600">Total Cost:</span>
                          <span className="text-xl font-bold text-blue-600">₹{selectedTherapy.cost}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors font-semibold"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleBooking}
                      disabled={isBooking}
                      className="flex-1 flex items-center justify-center py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {isBooking ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Booking...
                        </>
                      ) : (
                        <>
                          <Check className="h-5 w-5 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Therapy Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 animate-in slide-in-from-right-5 duration-700 delay-300">
              <img
                src={selectedTherapy.image}
                alt={selectedTherapy.name}
                className="w-full h-32 object-cover rounded-xl mb-4"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedTherapy.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{selectedTherapy.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{selectedTherapy.duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-semibold text-blue-600">₹{selectedTherapy.cost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold">{selectedTherapy.category}</span>
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 animate-in slide-in-from-right-5 duration-700 delay-500">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Practitioner</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">DP</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Dr. Priya Patel</p>
                  <p className="text-sm text-gray-600">8 years experience</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialization:</span>
                  <span className="font-medium">Panchakarma</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-medium">4.9/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Languages:</span>
                  <span className="font-medium">English, Hindi</span>
                </div>
              </div>
            </div>

            {/* Center Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 animate-in slide-in-from-right-5 duration-700 delay-700">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Treatment Center</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{centers[0]?.name}</p>
                    <p className="text-sm text-gray-600">{centers[0]?.address}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Phone:</strong> {centers[0]?.phone}</p>
                  <p><strong>Email:</strong> {centers[0]?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;