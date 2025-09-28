import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapContainer from '../components/MapContainer';

// Mock data with coordinates for Indian locations
const mockListingsWithCoords = [
  {
    id: 1,
    _id: 1,
    title: 'Rustic Mountain Homestay',
    location: 'Manali, Himachal Pradesh',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    type: 'Homestay',
    description: 'Experience the serenity of the Himalayas in a cozy mountain home.',
    latitude: 32.2432,
    longitude: 77.1892
  },
  {
    id: 2,
    _id: 2,
    title: 'Organic Farm Retreat',
    location: 'Kochi, Kerala',
    price: 900,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    type: 'Farm',
    description: 'Stay on a lush organic farm and learn about sustainable living.',
    latitude: 9.9312,
    longitude: 76.2673
  },
  {
    id: 3,
    _id: 3,
    title: 'Desert Village Experience',
    location: 'Jaisalmer, Rajasthan',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
    type: 'Village',
    description: 'Immerse yourself in the vibrant culture of a desert village.',
    latitude: 26.9157,
    longitude: 70.9083
  },
  {
    id: 4,
    _id: 4,
    title: 'Tea Estate Bungalow',
    location: 'Dibrugarh, Assam',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    type: 'Bungalow',
    description: 'Relax in a colonial-era bungalow surrounded by tea gardens.',
    latitude: 27.4728,
    longitude: 95.0025
  },
  {
    id: 5,
    _id: 5,
    title: 'Coastal Village Stay',
    location: 'Goa',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80',
    type: 'Village',
    description: 'Experience authentic Goan village life by the Arabian Sea.',
    latitude: 15.2993,
    longitude: 74.1240
  },
  {
    id: 6,
    _id: 6,
    title: 'Hill Station Cottage',
    location: 'Ooty, Tamil Nadu',
    price: 1300,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80',
    type: 'Homestay',
    description: 'Cozy cottage in the Nilgiri hills with stunning valley views.',
    latitude: 11.4102,
    longitude: 76.6950
  }
];

function Discover() {
  const [listings, setListings] = useState(mockListingsWithCoords);
  const [filteredListings, setFilteredListings] = useState(mockListingsWithCoords);
  const [filters, setFilters] = useState({
    type: 'All',
    priceRange: [0, 3000],
    searchLocation: ''
  });
  const [selectedListing, setSelectedListing] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(6);

  const types = ['All', ...Array.from(new Set(listings.map(l => l.type)))];

  useEffect(() => {
    let filtered = listings;

    // Filter by type
    if (filters.type !== 'All') {
      filtered = filtered.filter(l => l.type === filters.type);
    }

    // Filter by price range
    filtered = filtered.filter(l => l.price >= filters.priceRange[0] && l.price <= filters.priceRange[1]);

    // Filter by location search
    if (filters.searchLocation) {
      filtered = filtered.filter(l => 
        l.location.toLowerCase().includes(filters.searchLocation.toLowerCase()) ||
        l.title.toLowerCase().includes(filters.searchLocation.toLowerCase())
      );
    }

    setFilteredListings(filtered);
  }, [filters, listings]);

  const handleMarkerClick = (listing) => {
    setSelectedListing(listing);
    setMapCenter([listing.latitude, listing.longitude]);
    setMapZoom(12);
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, searchLocation: e.target.value });
  };

  const handleTypeFilter = (type) => {
    setFilters({ ...filters, type });
  };

  const handlePriceChange = (index, value) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(value);
    setFilters({ ...filters, priceRange: newPriceRange });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-4 text-green-800">Discover Rural India</h2>
        <p className="text-gray-600">Explore authentic homestays and cultural experiences across India</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Location</label>
            <input
              type="text"
              placeholder="Search by location or name..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={filters.searchLocation}
              onChange={handleSearch}
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={filters.type}
              onChange={(e) => handleTypeFilter(e.target.value)}
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (₹)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredListings.length} of {listings.length} stays
        </div>
      </div>

      {/* Map and Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4 text-green-800">Map View</h3>
            <MapContainer
              listings={filteredListings}
              center={mapCenter}
              zoom={mapZoom}
              height="500px"
              onMarkerClick={handleMarkerClick}
              selectedListing={selectedListing}
            />
          </div>
        </div>

        {/* Listings List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800">Available Stays</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredListings.map(listing => (
              <div
                key={listing._id || listing.id}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedListing?._id === listing._id ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => handleMarkerClick(listing)}
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h4 className="font-semibold text-green-800 mb-1">{listing.title}</h4>
                <p className="text-sm text-gray-600 mb-1">{listing.location}</p>
                <p className="text-xs text-gray-500 mb-2">{listing.type}</p>
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">{listing.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-700">₹{listing.price}/night</span>
                  <Link
                    to={`/listings/${listing._id || listing.id}`}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {filteredListings.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No stays found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Discover;
