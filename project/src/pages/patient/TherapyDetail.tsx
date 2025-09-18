import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Star, Calendar, AlertTriangle, Check, ArrowLeft, Heart, Users, Shield, Award } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const TherapyDetail: React.FC = () => {
  const { therapyId } = useParams();
  const navigate = useNavigate();
  const { therapies } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const therapy = therapies.find(t => t.id === therapyId);

  if (!therapy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Therapy Not Found</h2>
          <p className="text-gray-600 mb-6">The therapy you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/patient/therapies')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Therapies
          </button>
        </div>
      </div>
    );
  }

  const handleBookSession = () => {
    navigate(`/patient/schedule?therapy=${therapy.id}`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'process', label: 'Process' },
    { id: 'precautions', label: 'Precautions' },
    { id: 'reviews', label: 'Reviews' }
  ];

  const mockReviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      date: '2024-01-15',
      comment: 'Amazing experience! The therapy was very relaxing and I felt rejuvenated afterwards. Dr. Patel was very professional.',
      verified: true
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      rating: 4,
      date: '2024-01-10',
      comment: 'Good treatment but the session was a bit longer than expected. Overall satisfied with the results.',
      verified: true
    },
    {
      id: 3,
      name: 'Anita Singh',
      rating: 5,
      date: '2024-01-05',
      comment: 'Highly recommended! This therapy helped me with my stress levels significantly. Will definitely book again.',
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/patient/therapies')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors group animate-in slide-in-from-left-5 duration-500"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Therapies
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden mb-8 animate-in slide-in-from-left-5 duration-700">
              <div className="relative h-64 md:h-80">
                <img
                  src={therapy.image}
                  alt={therapy.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
                  <div className="p-8 text-white w-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="bg-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
                        {therapy.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-semibold">4.8</span>
                        <span className="text-blue-100">(124 reviews)</span>
                      </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">{therapy.name}</h1>
                    <p className="text-xl text-gray-200 max-w-2xl">{therapy.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 mb-8 animate-in slide-in-from-left-5 duration-700 delay-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">About This Therapy</h3>
                      <p className="text-gray-700 leading-relaxed text-lg">{therapy.description}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                        <Clock className="h-10 w-10 text-blue-600 mb-3" />
                        <h4 className="font-bold text-gray-900 text-lg">Duration</h4>
                        <p className="text-gray-600 font-medium">{therapy.duration} minutes</p>
                      </div>
                      <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                        <DollarSign className="h-10 w-10 text-green-600 mb-3" />
                        <h4 className="font-bold text-gray-900 text-lg">Cost</h4>
                        <p className="text-gray-600 font-medium">₹{therapy.cost}</p>
                      </div>
                      <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                        <Users className="h-10 w-10 text-purple-600 mb-3" />
                        <h4 className="font-bold text-gray-900 text-lg">Practitioners</h4>
                        <p className="text-gray-600 font-medium">5 Available</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Benefits Tab */}
                {activeTab === 'benefits' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Health Benefits</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {therapy.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl border border-green-200">
                          <Check className="h-6 w-6 text-green-500 mt-0.5" />
                          <span className="text-gray-700 font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Process Tab */}
                {activeTab === 'process' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Therapy Process</h3>
                    <div className="space-y-4">
                      {therapy.steps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-gray-700 font-medium">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Precautions Tab */}
                {activeTab === 'precautions' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Before Your Session</h3>
                      <div className="space-y-4">
                        {therapy.precautions.map((precaution, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                            <AlertTriangle className="h-6 w-6 text-yellow-500 mt-0.5" />
                            <span className="text-gray-700 font-medium">{precaution}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Contraindications</h3>
                      <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                        <p className="text-red-800 font-bold mb-4 text-lg">This therapy is not recommended if you have:</p>
                        <div className="space-y-3">
                          {therapy.contraindications.map((contraindication, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                              <span className="text-red-700 font-medium">{contraindication}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold text-gray-900">Patient Reviews</h3>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-6 w-6 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-gray-600 font-semibold text-lg">4.8 out of 5</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {mockReviews.map((review) => (
                        <div key={review.id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 transition-colors">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {review.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <p className="font-bold text-gray-900">{review.name}</p>
                                  {review.verified && (
                                    <div className="flex items-center text-green-600">
                                      <Shield className="h-4 w-4 mr-1" />
                                      <span className="text-xs font-medium">Verified</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">{format(new Date(review.date), 'MMMM dd, yyyy')}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-5 w-5 ${
                                    star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 sticky top-8 animate-in slide-in-from-right-5 duration-700">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900">₹{therapy.cost}</div>
                <p className="text-gray-600 font-medium">per session</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Duration</span>
                  <span className="font-bold">{therapy.duration} min</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Category</span>
                  <span className="font-bold">{therapy.category}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600 font-medium">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-bold">4.8</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleBookSession}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Calendar className="h-5 w-5 inline mr-2" />
                  Book Session
                </button>
                <button className="w-full border-2 border-gray-300 text-gray-700 py-4 px-4 rounded-xl hover:border-red-300 hover:text-red-500 transition-colors font-semibold">
                  <Heart className="h-5 w-5 inline mr-2" />
                  Add to Wishlist
                </button>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 animate-in slide-in-from-right-5 duration-700 delay-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Available Practitioners</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">DP</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-bold text-gray-900">Dr. Priya Patel</p>
                      <Award className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">8 years experience • BAMS, MD</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">4.9</span>
                      <span className="text-sm text-gray-500">(89 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 animate-in slide-in-from-right-5 duration-700 delay-400">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Need Help?</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center space-x-3 text-blue-800">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">📞</span>
                  </div>
                  <div>
                    <p className="font-bold">Call Us</p>
                    <p>+91-11-23456789</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-blue-800">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">💬</span>
                  </div>
                  <div>
                    <p className="font-bold">Live Chat</p>
                    <p>Available 24/7</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-blue-800">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">📧</span>
                  </div>
                  <div>
                    <p className="font-bold">Email Support</p>
                    <p>support@panchsutra.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyDetail;