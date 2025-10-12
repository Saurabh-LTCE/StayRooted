import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useEffect } from "react";

function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  useEffect(() => {
    // Save booking locally for demo
    if (data) {
      const prev = JSON.parse(localStorage.getItem('myBookings')) || [];
      localStorage.setItem('myBookings', JSON.stringify([
        ...prev,
        { ...data, status: 'Confirmed', bookedAt: new Date().toISOString() }
      ]));
    }
  }, [data]);
  if (!data) {
    return (
      <div className="p-8 text-red-600">Missing booking details. <button onClick={() => navigate('/listings')} className="text-green-700 underline ml-2">Go back to listings</button></div>
    );
  }
  const { listing, startDate, endDate, guests, total } = data;
  return (
    <div className="max-w-xl mx-auto mt-16 bg-white p-8 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Booking Confirmed 🎉</h2>
      <div className="mb-6">
        <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover rounded-md mb-2" />
        <h3 className="text-xl font-semibold">{listing.title}</h3>
        <div className="text-gray-600">{listing.location}</div>
      </div>
      <div className="mb-6">
        <div className="text-sm mb-1">Dates</div>
        <div className="text-lg">{format(new Date(startDate), 'PP')} → {format(new Date(endDate), 'PP')}</div>
      </div>
      <div className="mb-4">
        <div className="text-sm mb-1">Guests</div>
        <div className="text-lg">{guests}</div>
      </div>
      <div className="mb-6">
        <div className="flex justify-between">
          <span className="">Total Paid</span>
          <span className="text-green-700 font-bold">₹{total}</span>
        </div>
      </div>
      <div className="mb-6 bg-green-50 p-4 rounded text-center text-green-800 font-medium">Payment successful (demo mode)</div>
      <button onClick={() => navigate("/my-bookings")}
        className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 mt-2">Go to My Bookings</button>
      <button onClick={() => navigate("/")}
        className="w-full mt-2 border-green-700 border py-2 rounded text-green-700 hover:bg-green-100">Back to Home</button>
    </div>
  );
}
export default BookingConfirmation;
