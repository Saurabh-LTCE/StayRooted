import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const mockExperiences = [
  {
    id: 1,
    title: "Farm-to-Table Cooking Class",
    location: "Kerala",
    price: 800,
    duration: "4 hours",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80",
    type: "Cooking",
    description: "Learn to cook authentic South Indian dishes using fresh ingredients from our organic farm.",
    rating: 4.8,
    reviews: 124,
    maxParticipants: 8,
    includes: ["All ingredients", "Recipe cards", "Farm tour", "Lunch"],
    host: "Priya's Organic Farm",
    difficulty: "Beginner"
  },
  {
    id: 2,
    title: "Traditional Pottery Workshop",
    location: "Rajasthan",
    price: 600,
    duration: "3 hours",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80",
    type: "Craft",
    description: "Master the ancient art of pottery making with local artisans in a traditional village setting.",
    rating: 4.9,
    reviews: 89,
    maxParticipants: 6,
    includes: ["Clay and tools", "Expert guidance", "Take home pottery", "Tea and snacks"],
    host: "Village Artisans Collective",
    difficulty: "All Levels"
  },
  {
    id: 3,
    title: "Village Heritage Walk",
    location: "Himachal Pradesh",
    price: 500,
    duration: "2 hours",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
    type: "Cultural",
    description: "Explore centuries-old temples, traditional houses, and local markets with a knowledgeable guide.",
    rating: 4.7,
    reviews: 156,
    maxParticipants: 12,
    includes: ["Expert guide", "Entrance fees", "Cultural insights", "Refreshments"],
    host: "Mountain Heritage Tours",
    difficulty: "Easy"
  },
  {
    id: 4,
    title: "Tea Plantation Tour & Tasting",
    location: "Assam",
    price: 700,
    duration: "3 hours",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    type: "Agricultural",
    description: "Discover the journey of tea from leaf to cup in a working tea estate with professional tasters.",
    rating: 4.6,
    reviews: 98,
    maxParticipants: 10,
    includes: ["Estate tour", "Tea tasting", "Lunch", "Tea samples"],
    host: "Golden Leaf Tea Estate",
    difficulty: "Easy"
  },
  {
    id: 5,
    title: "Desert Camel Safari",
    location: "Rajasthan",
    price: 1200,
    duration: "6 hours",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    type: "Adventure",
    description: "Experience the magic of the Thar Desert with an authentic camel safari and desert camping.",
    rating: 4.9,
    reviews: 203,
    maxParticipants: 15,
    includes: ["Camel ride", "Desert camping", "Traditional dinner", "Cultural performance"],
    host: "Desert Nomads",
    difficulty: "Moderate"
  },
  {
    id: 6,
    title: "Village Yoga & Meditation",
    location: "Goa",
    price: 400,
    duration: "1.5 hours",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80",
    type: "Wellness",
    description: "Practice yoga and meditation in a serene village setting surrounded by nature and tranquility.",
    rating: 4.8,
    reviews: 167,
    maxParticipants: 20,
    includes: ["Yoga mats", "Expert instructor", "Meditation session", "Herbal tea"],
    host: "Village Wellness Center",
    difficulty: "All Levels"
  }
];

const types = ['All', ...Array.from(new Set(mockExperiences.map(e => e.type)))];
const difficulties = ['All', 'Easy', 'Moderate', 'Beginner', 'All Levels'];

function Experiences() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: 'All',
    difficulty: 'All',
    priceRange: [0, 1500],
    searchQuery: '',
    location: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    participants: 1,
    specialRequests: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState('');
  const itemsPerPage = 6;

  // Filter experiences
  const filteredExperiences = mockExperiences.filter(experience => {
    if (filters.type !== 'All' && experience.type !== filters.type) return false;
    if (filters.difficulty !== 'All' && experience.difficulty !== filters.difficulty) return false;
    if (experience.price < filters.priceRange[0] || experience.price > filters.priceRange[1]) return false;
    if (filters.searchQuery && !experience.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
        !experience.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
    if (filters.location && !experience.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredExperiences.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExperiences = filteredExperiences.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      type: 'All',
      difficulty: 'All',
      priceRange: [0, 1500],
      searchQuery: '',
      location: ''
    });
    setCurrentPage(1);
  };

  const handleBookExperience = (experience) => {
    setSelectedExperience(experience);
    setBookingData({
      date: '',
      time: '',
      participants: 1,
      specialRequests: ''
    });
    setShowBookingModal(true);
    setBookingSuccess('');
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingData.date || !bookingData.time) {
      setBookingSuccess('Please select date and time.');
      return;
    }
    
    // Mock booking success
    setBookingSuccess('Experience booked successfully! You will receive a confirmation email shortly.');
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setShowBookingModal(false);
      setBookingSuccess('');
      setBookingData({
        date: '',
        time: '',
        participants: 1,
        specialRequests: ''
      });
    }, 3000);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setBookingSuccess('');
    setSelectedExperience(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Cultural Experiences</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Immerse yourself in authentic rural culture through hands-on experiences, traditional crafts, and local traditions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-green-800">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-green-600 hover:text-green-800"
              >
                Clear All
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search experiences..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              />
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="Enter location..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Type</label>
              <div className="space-y-2">
                {types.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={filters.type === type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="space-y-2">
                {difficulties.map(difficulty => (
                  <label key={difficulty} className="flex items-center">
                    <input
                      type="radio"
                      name="difficulty"
                      value={difficulty}
                      checked={filters.difficulty === difficulty}
                      onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">{difficulty}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (₹)</label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min price"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={filters.priceRange[0]}
                  onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                />
                <input
                  type="number"
                  placeholder="Max price"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 1500])}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Experiences Content */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Found {filteredExperiences.length} experiences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {paginatedExperiences.map(experience => (
              <div key={experience.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <img 
                    src={experience.image} 
                    alt={experience.title} 
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Experience
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                      {experience.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-green-800">{experience.title}</h3>
                  <div className="text-green-600 font-medium mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {experience.location}
                  </div>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(experience.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({experience.reviews} reviews)</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{experience.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{experience.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Max Participants:</span>
                      <span className="font-medium">{experience.maxParticipants}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Difficulty:</span>
                      <span className="font-medium">{experience.difficulty}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Host:</span>
                      <span className="font-medium">{experience.host}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-green-700">₹{experience.price}</div>
                    <button 
                      onClick={() => handleBookExperience(experience)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-medium"
                    >
                      Book Experience
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 border rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-green-700 text-white border-green-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-green-800">Book Experience</h3>
                <button
                  onClick={closeBookingModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{selectedExperience.title}</h4>
                <p className="text-gray-600 mb-2">{selectedExperience.location}</p>
                <p className="text-sm text-gray-500 mb-2">Duration: {selectedExperience.duration}</p>
                <p className="text-sm text-gray-500">Max Participants: {selectedExperience.maxParticipants}</p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                    required
                  >
                    <option value="">Choose time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Participants</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={bookingData.participants}
                    onChange={(e) => setBookingData({...bookingData, participants: parseInt(e.target.value)})}
                  >
                    {[...Array(selectedExperience.maxParticipants)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} participant{(i + 1) > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows="3"
                    placeholder="Any special requirements or dietary restrictions..."
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Price per person:</span>
                    <span>₹{selectedExperience.price}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Participants:</span>
                    <span>{bookingData.participants}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>₹{selectedExperience.price * bookingData.participants}</span>
                    </div>
                  </div>
                </div>

                {bookingSuccess && (
                  <div className={`p-3 rounded-lg text-sm ${
                    bookingSuccess.includes('successfully') 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {bookingSuccess}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={closeBookingModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-medium"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Experiences;
