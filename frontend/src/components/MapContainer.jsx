import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom green marker for rural theme
const createCustomIcon = (color = '#16a34a') => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        transform: rotate(45deg);
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">🏡</div>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

function MapContainerComponent({ 
  listings = [], 
  center = [20.5937, 78.9629], // India center
  zoom = 6,
  height = "400px",
  onMarkerClick = null,
  selectedListing = null 
}) {
  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {listings.map((listing) => (
          <Marker
            key={listing._id || listing.id}
            position={[listing.latitude || 20.5937, listing.longitude || 78.9629]}
            icon={createCustomIcon(selectedListing?._id === listing._id ? '#dc2626' : '#16a34a')}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(listing),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[250px]">
                <img 
                  src={listing.images?.[0] || listing.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80'} 
                  alt={listing.title}
                  className="w-full h-24 object-cover rounded mb-2"
                />
                <h3 className="font-bold text-green-800 text-sm mb-1">{listing.title}</h3>
                <p className="text-gray-600 text-xs mb-1">{listing.location}</p>
                <p className="text-green-700 font-semibold text-sm mb-2">₹{listing.price}/night</p>
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">{listing.description}</p>
                <Link
                  to={`/listings/${listing._id || listing.id}`}
                  className="inline-block bg-green-700 text-white text-xs px-3 py-1 rounded hover:bg-green-800 transition w-full text-center"
                >
                  Book Now
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapContainerComponent;
