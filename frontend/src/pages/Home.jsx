import React, { useState } from 'react';
import { mockListings } from './Listings';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const navigate = useNavigate();
  const featured = mockListings.filter(l => l.featured);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (searchLocation) params.append('location', searchLocation);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-200 to-green-50 py-20 px-4 text-center rounded-lg mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-green-900 mb-6">
            Reconnect with Rural India
          </h1>
          <p className="text-lg md:text-xl text-green-800 mb-8 max-w-3xl mx-auto">
            StayRooted connects urban travelers with authentic rural homestays and experiences. 
            Discover, book, and immerse yourself in the beauty of India's countryside.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-full shadow-lg p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full px-4 py-3 border-0 rounded-full focus:ring-2 focus:ring-green-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="w-full px-4 py-3 border-0 rounded-full focus:ring-2 focus:ring-green-500 outline-none"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/listings" className="bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-green-800 transition">
              Explore All Listings
            </Link>
            <Link to="/discover" className="bg-white text-green-700 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-green-50 transition border-2 border-green-700">
              Discover on Map
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-green-700 mb-2">500+</div>
            <div className="text-gray-600">Rural Homestays</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-green-700 mb-2">50+</div>
            <div className="text-gray-600">Villages Connected</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-green-700 mb-2">1000+</div>
            <div className="text-gray-600">Happy Travelers</div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-green-800">Featured Stays</h2>
          <Link to="/listings" className="text-green-700 hover:text-green-800 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map(listing => (
            <div key={listing.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <img 
                  src={listing.image} 
                  alt={listing.title} 
                  className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                    {listing.type}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-green-800">{listing.title}</h3>
                <div className="text-green-600 font-medium mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {listing.location}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{listing.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-green-700">₹{listing.price}<span className="text-sm font-normal text-gray-500">/night</span></div>
                  <Link 
                    to={`/listings/${listing.id}`} 
                    className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-green-800">Cultural Experiences</h2>
          <Link to="/experiences" className="text-green-700 hover:text-green-800 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Farm-to-Table Cooking",
              location: "Kerala",
              price: 800,
              image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80",
              duration: "4 hours"
            },
            {
              title: "Traditional Pottery Workshop",
              location: "Rajasthan",
              price: 600,
              image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80",
              duration: "3 hours"
            },
            {
              title: "Village Heritage Walk",
              location: "Himachal Pradesh",
              price: 500,
              image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
              duration: "2 hours"
            }
          ].map((experience, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <img 
                  src={experience.image} 
                  alt={experience.title} 
                  className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                    Experience
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
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Duration: {experience.duration}</span>
                  <div className="text-xl font-bold text-green-700">₹{experience.price}</div>
                </div>
                <Link 
                  to="/experiences" 
                  className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-medium text-center block"
                >
                  Book Experience
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-800 text-white py-16 px-4 text-center rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Ready for Your Rural Adventure?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of travelers who have discovered the authentic beauty of rural India.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="bg-white text-green-800 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition">
            Get Started
          </Link>
          <Link to="/listings" className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-green-800 transition">
            Browse Listings
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
