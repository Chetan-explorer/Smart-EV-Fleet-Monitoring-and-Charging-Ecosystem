import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation } from 'lucide-react';

// Fix generic leaflet icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Markers
const createSvgIcon = (color) => new L.DivIcon({
    className: 'custom-brutal-marker',
    html: `<svg width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="#000" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#000"></circle></svg>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const userIcon = new L.DivIcon({
    className: 'user-marker',
    html: `<div class="relative flex items-center justify-center w-8 h-8"><div class="absolute w-full h-full bg-blue-500 rounded-full animate-ping opacity-50"></div><div class="relative w-4 h-4 bg-blue-500 border-2 border-white rounded-full"></div></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

const icons = {
    Low: createSvgIcon('#D4FF00'),
    Moderate: createSvgIcon('#fbbf24'),
    High: createSvgIcon('#ef4444')
};

const RecenterMap = ({ coordinates }) => {
    const map = useMap();
    useEffect(() => {
        if (coordinates && coordinates.lat && coordinates.lng) {
            map.flyTo([coordinates.lat, coordinates.lng], 14, { animate: true, duration: 1.5 });
        }
    }, [coordinates, map]);
    return null;
};

const UserMap = () => {
    const [stations, setStations] = useState([]);
    const [userLoc, setUserLoc] = useState(null);
    const [routeLine, setRouteLine] = useState([]);
    const [routeMeta, setRouteMeta] = useState(null);
    const [selectedStation, setSelectedStation] = useState(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => console.warn("Geolocation denied or failed.", err),
                { enableHighAccuracy: true }
            );
        }
    }, []);

    const fetchStations = async () => {
        try {
            const { data } = await axios.get('/api/stations/nearby');
            setStations(data);
        } catch (error) {
            console.error('Error polling nearby stations:', error);
        }
    };

    useEffect(() => {
        fetchStations();
        const interval = setInterval(fetchStations, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleNavigate = async (station) => {
        if (!userLoc) return alert("User location not available. Enable location services.");
        setSelectedStation(station);
        try {
            const res = await axios.get(
                `https://router.project-osrm.org/route/v1/driving/${userLoc.lng},${userLoc.lat};${station.location.lng},${station.location.lat}?overview=full&geometries=geojson`
            );
            if(res.data.routes && res.data.routes.length > 0) {
                const rt = res.data.routes[0];
                const coords = rt.geometry.coordinates.map(c => [c[1], c[0]]);
                setRouteLine(coords);
                setRouteMeta({ 
                    distance: (rt.distance / 1000).toFixed(1),
                    duration: Math.round(rt.duration / 60)
                });
            }
        } catch(e) {
            console.error("OSRM Routing failed:", e);
        }
    };

    const centerPos = userLoc || (stations.length > 0 ? stations[0].location : {lat: 12.9716, lng: 77.5946});

    return (
        <div className="h-[calc(100vh-2rem)] w-full font-mono -m-2 p-2 relative bg-black">
            <div className="absolute top-6 right-6 z-[400] text-[#D4FF00] bg-black/80 px-2 py-1 text-xs border border-[#D4FF00] font-black uppercase shadow-lg">
                Live Map Feed • Poll: 5s
            </div>
            <MapContainer center={[centerPos.lat, centerPos.lng]} zoom={13} className="w-full h-full border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                />
                
                {userLoc && (
                    <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon}>
                        <Popup className="font-mono font-bold">Your Origin</Popup>
                    </Marker>
                )}

                {stations.map((station) => (
                    <Marker 
                        key={station._id} 
                        position={[station.location.lat, station.location.lng]}
                        icon={icons[station.crowdedness] || icons.Low}
                    >
                        <Popup className="rounded-xl overflow-hidden min-w-[200px]">
                            <div className="font-mono pb-2 mb-2 font-black border-b border-gray-300">{station.name}</div>
                            <div className="text-xs mb-1">
                                Open Ports: <strong className="text-emerald-600">{station.availableSlots}</strong> / {station.capacity || 1}
                            </div>
                            <div className="text-xs mb-1">Queue Today: <strong className="text-red-500">{station.todayQueue || 0}</strong> EVs</div>
                            
                            {routeMeta && selectedStation?._id === station._id && (
                                <div className="text-xs text-blue-600 font-bold mb-2">
                                    Travel: {routeMeta.distance}km ({routeMeta.duration} min)
                                </div>
                            )}
                            
                            <button onClick={() => handleNavigate(station)} className="mt-2 w-full py-2 bg-blue-600 text-white flex items-center justify-center space-x-1 font-bold rounded-md hover:bg-blue-700 transition">
                                <Navigation className="w-4 h-4" /> <span>Draw Route</span>
                            </button>
                        </Popup>
                    </Marker>
                ))}

                {routeLine.length > 0 && (
                    <Polyline positions={routeLine} color="#3b82f6" weight={5} dashArray="10, 10" className="animate-[dash_2s_linear_infinite]" />
                )}

                <RecenterMap coordinates={selectedStation?.location || userLoc} />
            </MapContainer>
        </div>
    );
};

export default UserMap;
