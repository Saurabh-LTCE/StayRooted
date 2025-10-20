import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Home, Shield } from 'lucide-react';

function RoleCard({ title, description, icon: Icon, color, onClick }) {
  return (
    <div className="bg-white border rounded shadow-sm p-6 flex flex-col">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color} text-white mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-green-900">{title}</h3>
      <p className="text-gray-600 mt-1 flex-1">{description}</p>
      <div className="mt-4 flex gap-2">
        <button onClick={onClick} className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">Continue</button>
      </div>
    </div>
  );
}

function RoleSelection() {
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-green-800 mb-2">Choose your role</h1>
      <p className="text-gray-600 mb-8">Select how you want to use StayRooted. You can switch later.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RoleCard
          title="Traveler"
          description="Discover unique stays and experiences from local hosts."
          icon={User}
          color="bg-green-600"
          onClick={() => navigate('/login?role=traveler')}
        />
        <RoleCard
          title="Host"
          description="List your stay or experiences and manage bookings."
          icon={Home}
          color="bg-emerald-600"
          onClick={() => navigate('/login?role=host')}
        />
        <RoleCard
          title="Admin"
          description="Manage the platform and ensure quality for everyone."
          icon={Shield}
          color="bg-teal-600"
          onClick={() => navigate('/login?role=admin')}
        />
      </div>
    </div>
  );
}

export default RoleSelection;


