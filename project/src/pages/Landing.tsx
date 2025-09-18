import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star, Users, Calendar, Shield, Heart, Leaf, Award, Clock } from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Book your Panchakarma sessions with just a few clicks'
    },
    {
      icon: Users,
      title: 'Expert Doctors',
      description: 'Certified Ayurvedic practitioners with years of experience'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Your health data is protected with enterprise-grade security'
    },
    {
      icon: Heart,
      title: 'Personalized Care',
      description: 'Customized treatment plans based on your unique constitution'
    }
  ];

  const therapies = [
    {
      name: 'Abhyanga',
      description: 'Full body oil massage for rejuvenation',
      image: '#',
      price: 2500,
      duration: 60
    },
    {
      name: 'Shirodhara',
      description: 'Continuous oil pouring for mental peace',
      image: '#',
      price: 3500,
      duration: 45
    },
    {
      name: 'Panchakarma',
      description: 'Complete detoxification program',
      image: '#',
      price: 15000,
      duration: 180
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Patient',
      content: 'PanchSutra transformed my health journey. The doctors are amazing and the platform is so easy to use.',
      rating: 5,
      image: 'PS'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Patient',
      content: 'Best Panchakarma experience I have ever had. The personalized treatment plan worked wonders.',
      rating: 5,
      image: 'RK'
    },
    {
      name: 'Dr. Anita Patel',
      role: 'Ayurvedic Doctor',
      content: 'PanchSutra helps me manage my patients efficiently. The digital platform is a game-changer.',
      rating: 5,
      image: 'AP'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Patients' },
    { number: '50+', label: 'Expert Doctors' },
    { number: '25+', label: 'Therapy Types' },
    { number: '98%', label: 'Success Rate' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDAsIDAsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6 animate-in fade-in-50 duration-1000">
                <Award className="h-4 w-4 mr-2" />
                India's #1 Panchakarma Platform
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight animate-in slide-in-from-left-5 duration-1000">
                Experience the
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {' '}Power of{' '}
                </span>
                Panchakarma
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed animate-in slide-in-from-left-5 duration-1000 delay-200">
                Transform your health with authentic Ayurvedic treatments. Book sessions with certified practitioners and embark on your wellness journey.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in slide-in-from-left-5 duration-1000 delay-400">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Sign In
                </Link>
              </div>
            </div>
            
            <div className="relative animate-in slide-in-from-right-5 duration-1000 delay-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
              <img
                src="#"
                alt="Panchakarma Treatment"
                className="relative w-full h-96 object-cover rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl animate-in slide-in-from-bottom-5 duration-1000 delay-700">
                <div className="flex items-center space-x-3">
                  <Leaf className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-bold text-gray-900">100% Natural</p>
                    <p className="text-sm text-gray-600">Ayurvedic Treatments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PanchSutra?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine ancient Ayurvedic wisdom with modern technology to provide you with the best healthcare experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-white border border-blue-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-3 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Therapies Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Popular Therapies
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most sought-after Panchakarma treatments
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {therapies.map((therapy, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={therapy.image}
                    alt={therapy.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-lg">
                    <span className="text-blue-600 font-semibold">₹{therapy.price}</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {therapy.duration}min
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{therapy.name}</h3>
                  <p className="text-gray-600 mb-4">{therapy.description}</p>
                  <Link
                    to="/signup"
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                  >
                    Book Now
                    <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied patients who transformed their health with us
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {testimonial.image}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join PanchSutra today and discover the transformative power of authentic Ayurvedic treatments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/signup?role=doctor"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-700 rounded-xl hover:bg-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Join as Doctor
              <Users className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;