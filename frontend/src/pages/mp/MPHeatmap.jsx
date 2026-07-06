import React, { useEffect, useState } from 'react';
import MPNavbar from '../../components/layout/MPNavbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { mapService } from '../../services/mapService';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MPHeatmap = () => {
  const [markers, setMarkers] = useState([]);
  const center = [13.0116, 77.6346]; // Default center

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await mapService.getMarkers();
        setMarkers(response.data);
      } catch (err) {
        console.error('Failed to fetch markers');
      }
    };
    fetchMarkers();
  }, []);

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <MPNavbar />
      <div className="flex-1 relative">
        <MapContainer center={center} zoom={12} style={{ height: 'calc(100vh - 72px)', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {markers.map((m) => (
            <Marker key={m.id} position={[m.lat, m.lng]}>
              <Popup>
                <div className="font-sans">
                  <p className="font-bold text-ink-navy">{m.theme}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">{m.status}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded shadow-lg border border-gray-200 max-w-xs">
          <h3 className="font-bold mb-2">Ward Density Map</h3>
          <p className="text-xs text-gray-500">Showing geographic distribution of citizen complaints across the constituency.</p>
        </div>
      </div>
    </div>
  );
};

export default MPHeatmap;
