import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, Star, Filter, Search, Heart, ArrowRight, Calendar } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const TherapyCatalog: React.FC = () => {
  const { therapies } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const categories = ['all', ...new Set(therapies.map(t => t.category))];

  const filteredTherapies = therapies.filter(therapy => {
    const matchesSearch = therapy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || therapy.category === selectedCategory;
    const matchesPrice = priceRange === 'all' ||
                        (priceRange === 'low' && therapy.cost < 2000) ||
                        (priceRange === 'medium' && therapy.cost >= 2000 && therapy.cost < 5000) ||
                        (priceRange === 'high' && therapy.cost >= 5000);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-in slide-in-from-top-5 duration-700">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Therapy Catalog</h1>
          <p className="text-gray-600 text-lg">
            Discover authentic Panchakarma therapies tailored for your wellness journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8 animate-in slide-in-from-top-5 duration-700 delay-200">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search therapies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              >
                <option value="all">All Prices</option>
                <option value="low">Under ₹2,000</option>
                <option value="medium">₹2,000 - ₹5,000</option>
                <option value="high">₹5,000+</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange('all');
              }}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              <Filter className="h-5 w-5 inline mr-2" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 animate-in slide-in-from-left-5 duration-700 delay-300">
          <p className="text-gray-600 font-medium">
            Showing {filteredTherapies.length} of {therapies.length} therapies
          </p>
        </div>

        {/* Therapy Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTherapies.map((therapy, index) => (
            <div
              key={therapy.id}
              className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group animate-in slide-in-from-bottom-5 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Therapy Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={therapy.image}
                  alt={therapy.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-full shadow-lg">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold">4.8</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {therapy.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-blue-600 font-bold text-lg">₹{therapy.cost}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {therapy.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{therapy.description}</p>

                {/* Details */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{therapy.duration} min</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-lg font-bold text-blue-600">₹{therapy.cost}</p>
                  </div>
                </div>

                {/* Benefits Preview */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {therapy.benefits.slice(0, 2).map((benefit, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {benefit}
                      </span>
                    ))}
                    {therapy.benefits.length > 2 && (
                      <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">
                        +{therapy.benefits.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Link
                    to={`/patient/therapy/${therapy.id}`}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/patient/schedule?therapy=${therapy.id}`}
                    className="bg-blue-100 text-blue-600 py-3 px-4 rounded-xl hover:bg-blue-200 transition-colors font-semibold"
                  >
                    <Calendar className="h-5 w-5" />
                  </Link>
                  <button className="p-3 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:text-red-500 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTherapies.length === 0 && (
          <div className="text-center py-16 animate-in fade-in-50 duration-700">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Therapies Found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse all available therapies.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange('all');
              }}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Show All Therapies
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white animate-in slide-in-from-bottom-5 duration-700 delay-600">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Need Personalized Recommendations?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
              Our Ayurvedic experts can create a customized treatment plan based on your unique constitution and health goals.
            </p>
            <Link
              to="/patient/consultation"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Schedule Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyCatalog;