import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockListings } from './Listings';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, differenceInCalendarDays } from 'date-fns';

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = mockListings.find(l => l.id === Number(id));
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [guests, setGuests] = useState(1);
  const [success, setSuccess] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!listing) return <div className="p-8 text-red-600">Listing not found.</div>;

  // Mock additional images for gallery
  const galleryImages = [
    listing.image,
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
  ];

  // Demo: Move to confirmation
  const handleContinue = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setSuccess('Please select valid dates.');
      return;
    }
    navigate('/booking/confirmation', {
      state: {
        listing,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        guests,
        total: calculateTotalPrice(),
      },
    });
  };

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    const nights = differenceInCalendarDays(endDate, startDate);
    // Example: base price + 10% tax + 100 experience per booking
    let subtotal = nights * listing.price * guests;
    let experienceFee = 100;
    let taxes = subtotal * 0.1;
    return subtotal + taxes + experienceFee;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li><button onClick={() => navigate('/listings')} className="hover:text-green-600">Listings</button></li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900">{listing.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="mb-8">
            <div className="relative">
              <img 
                src={galleryImages[currentImageIndex]} 
                alt={listing.title} 
                className="w-full h-96 object-cover rounded-xl"
              />
              <button
                onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : galleryImages.length - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentImageIndex(prev => prev < galleryImages.length - 1 ? prev + 1 : 0)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="flex space-x-2 mt-4">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-16 rounded-lg overflow-hidden ${
                    currentImageIndex === index ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <img src={image} alt={`${listing.title} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Listing Details */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-green-800 mb-2">{listing.title}</h1>
                  <div className="flex items-center text-green-600 mb-2">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {listing.location}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(listing.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({listing.reviews} reviews)</span>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {listing.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-700">₹{listing.price}<span className="text-lg font-normal text-gray-500">/night</span></div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold text-green-800 mb-4">About this place</h2>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-semibold text-green-800 mb-4">What this place offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div>
              <h2 className="text-2xl font-semibold text-green-800 mb-4">Property details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{listing.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{listing.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{listing.maxGuests}</div>
                  <div className="text-sm text-gray-600">Max Guests</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{listing.type}</div>
                  <div className="text-sm text-gray-600">Property Type</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-700">₹{listing.price}<span className="text-lg font-normal text-gray-500">/night</span></div>
                <div className="flex items-center justify-center mt-2">
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
                  <span className="ml-2 text-sm text-gray-600">({listing.reviews} reviews)</span>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleContinue}>
                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select dates</label>
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    onChange={(update) => {
                      setDateRange(update);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholderText="Select check-in and check-out"
                  />
                </div>
                {/* Guest Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={guests}
                    onChange={e => setGuests(Number(e.target.value))}
                  >
                    {[...Array(listing.maxGuests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} guest{i + 1 > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                {/* Price Breakdown */}
                {startDate && endDate && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Base ({differenceInCalendarDays(endDate, startDate)} nights x ₹{listing.price})</span>
                      <span>₹{differenceInCalendarDays(endDate, startDate) * listing.price * guests}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Experience Fee</span>
                      <span>₹100</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Taxes (10%)</span>
                      <span>₹{Math.round(differenceInCalendarDays(endDate, startDate) * listing.price * guests * 0.1)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{calculateTotalPrice()}</span>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition font-semibold"
                >
                  Continue to Payment (Demo)
                </button>

                {success && (
                  <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                    {success}
                  </div>
                )}
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                You won't be charged yet
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;
