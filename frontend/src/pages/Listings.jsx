import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import MapContainer from '../components/MapContainer';

export const mockListings = [
  {
    id: 1,
    title: 'Homestay in Jibhi Valley',
    location: 'Jibhi, Himachal Pradesh',
    price: 1800,
    image: 'https://plus.unsplash.com/premium_photo-1697729690458-2d64ca777c04?auto=format&fit=crop&q=80&w=1170',
    type: 'Homestay',
    featured: true,
    description: 'Experience Himachal village Life and fresh local foods.',
    latitude: 31.8000,
    longitude: 76.5000,
    amenities: ['WiFi', 'Parking', 'Kitchen', 'Garden', 'Mountain View'],
    rating: 4.8,
    reviews: 124,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  },
  {
    id: 2,
    title: 'Raghurajpur Pattachitra Artist Stay',
    location: 'Raghurajpur, Odisha',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1659166749379-7a4725a6f76b?auto=format&fit=crop&q=80&w=1287',
    type: 'Art',
    featured: true,
    description: 'Stay with traditional artisans and learn ancient Pattachitra painting while living in a colorful heritage village.',
    latitude: 20.8500,
    longitude: 85.6000,
    amenities: ['WiFi', 'Parking', 'Art Tour', 'Traditional Meals', 'River View'],
    rating: 4.6,
    reviews: 89,
    maxGuests: 6,
    
  },
  {
    id: 3,
    title: 'Pangot Uttarakhand village',
    location: 'Pangot, Uttarakhand',
    price: 1200,
    image: 'https://images.pexels.com/photos/1036914/pexels-photo-1036914.jpeg',
    type: 'Stay',
    featured: false,
    description: 'Stay in a traditional village and experience the culture of Uttarakhand.',
    latitude: 30.4157,
    longitude: 79.5667,
    amenities: ['Cultural Activities', 'Traditional Meals', 'River View'],
    rating: 4.9,
    reviews: 156,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
    
  },
  {
    id: 4,
    title: 'Tea Estate Bungalow',
    location: 'Dibrugarh, Assam',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1682258635402-9d88e8d1d6a9?auto=format&fit=crop&q=80&w=1285',
    type: 'Bungalow',
    featured: false,
    description: 'Relax in a colonial-era bungalow surrounded by tea gardens.',
    latitude: 27.4728,
    longitude: 95.0025,
    amenities: ['WiFi', 'Parking', 'Tea Tasting', 'Garden', 'Historic Building'],
    rating: 4.7,
    reviews: 98,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    id: 5,
    title: 'Kumbalangi backwaters stay',
    location: 'Kumbalangi, Kerala',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1724498061800-b5fe2c92a36c?auto=format&fit=crop&q=80&w=1287',
    type: 'Stay',
    featured: false,
    description: 'Immerse yourself in Kerala\'s only model village. Enjoy canoe rides, coir making, and traditional seafood dishes.',                                                                           
    latitude: 10.0833,
    longitude: 75.7167,
    amenities: ['WiFi', 'Parking', 'Backwater Cruise', 'Houseboat Stay'],
    rating: 4.5,
    reviews: 67,
    maxGuests: 4,
  
  },
  {
    id: 6,
    title: 'Hill Station Cottage',
    location: 'Ooty, Tamil Nadu',
    price: 1300,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80',
    type: 'Homestay',
    featured: false,
    description: 'Cozy cottage in the Nilgiri hills with stunning valley views.',
    latitude: 11.4102,
    longitude: 76.6950,
    amenities: ['WiFi', 'Parking', 'Mountain View', 'Hiking', 'Fireplace'],
    rating: 4.8,
    reviews: 112,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  }

];

const types = ['All', ...Array.from(new Set(mockListings.map(l => l.type)))];
const amenities = ['WiFi', 'Parking', 'Kitchen', 'Garden', 'Mountain View', 'Farm Tour', 'Cultural Activities', 'Beach Access'];

function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'All',
    priceRange: [0, 3000],
    amenities: [],
    searchQuery: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    sortBy: 'featured'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [selectedListing, setSelectedListing] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and sort listings
  const filteredListings = mockListings.filter(listing => {
    // Type filter
    if (filters.type !== 'All' && listing.type !== filters.type) return false;
    
    // Price range filter
    if (listing.price < filters.priceRange[0] || listing.price > filters.priceRange[1]) return false;
    
    // Search query filter
    if (filters.searchQuery && !listing.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
        !listing.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
    
    // Location filter
    if (filters.location && !listing.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    
    // Amenities filter
    if (filters.amenities.length > 0 && !filters.amenities.every(amenity => listing.amenities.includes(amenity))) return false;
    
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'featured':
      default:
        return b.featured - a.featured;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedListings = filteredListings.slice(startIndex, startIndex + itemsPerPage);

  const handleMarkerClick = (listing) => {
    setSelectedListing(listing);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      type: 'All',
      priceRange: [0, 3000],
      amenities: [],
      searchQuery: '',
      location: '',
      sortBy: 'featured'
    });
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-green-800 mb-2">Rural Stays & Experiences</h2>
          <p className="text-gray-600">Found {filteredListings.length} stays</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-green-600 transition`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'map' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-green-600 transition`}
          >
            Map View
          </button>
        </div>
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
                placeholder="Search listings..."
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
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
                  onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 3000])}
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {amenities.map(amenity => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Content */}
        <div className="lg:col-span-3">
          {viewMode === 'grid' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {paginatedListings.map(listing => (
                  <div key={listing.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="relative">
                      <img 
                        src={listing.image} 
                        alt={listing.title} 
                        className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      {listing.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-green-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Featured
                          </span>
                        </div>
                      )}
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
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(listing.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">({listing.reviews} reviews)</span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{listing.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-500">
                          {listing.bedrooms} bed • {listing.bathrooms} bath • Up to {listing.maxGuests} guests
                        </div>
                      </div>
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
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-96">
                <MapContainer
                  listings={filteredListings}
                  selectedListing={selectedListing}
                  onMarkerClick={handleMarkerClick}
                  center={[20.5937, 78.9629]}
                  zoom={6}
                  height="100%"
                />
              </div>
              {selectedListing && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-green-800">{selectedListing.title}</h3>
                      <p className="text-sm text-gray-600">{selectedListing.location}</p>
                      <p className="text-sm text-green-700 font-semibold">₹{selectedListing.price}/night</p>
                    </div>
                    <Link 
                      to={`/listings/${selectedListing.id}`} 
                      className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Listings;
