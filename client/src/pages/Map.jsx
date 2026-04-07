import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BatteryCharging, Route } from 'lucide-react';

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const stationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const vehicleIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


const MapView = () => {
    const [vehicles, setVehicles] = useState([]);
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoutes, setSelectedRoutes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vRes, sRes] = await Promise.all([
                    axios.get('/api/vehicles'),
                    axios.get('/api/stations')
                ]);
                
                const fetchedVehicles = vRes.data;
                const fetchedStations = sRes.data;
                
                setVehicles(fetchedVehicles);
                setStations(fetchedStations);

                // Auto-route charging vehicles
                if (fetchedStations.length > 0) {
                    const defaultRoutes = [];
                    fetchedVehicles.filter(v => v.status === 'charging').forEach(vehicle => {
                         const nearest = fetchedStations.reduce((prev, curr) => {
                            const d1 = Math.pow(prev.location.lat - vehicle.location.lat, 2) + Math.pow(prev.location.lng - vehicle.location.lng, 2);
                            const d2 = Math.pow(curr.location.lat - vehicle.location.lat, 2) + Math.pow(curr.location.lng - vehicle.location.lng, 2);
                            return d1 < d2 ? prev : curr;
                         });
                         defaultRoutes.push([
                             [vehicle.location.lat, vehicle.location.lng],
                             [nearest.location.lat, nearest.location.lng]
                         ]);
                    });
                    setSelectedRoutes(defaultRoutes);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleRoute = (vehicle) => {
        if (!stations.length) return;
        const nearest = stations.reduce((prev, curr) => {
            const d1 = Math.pow(prev.location.lat - vehicle.location.lat, 2) + Math.pow(prev.location.lng - vehicle.location.lng, 2);
            const d2 = Math.pow(curr.location.lat - vehicle.location.lat, 2) + Math.pow(curr.location.lng - vehicle.location.lng, 2);
            return d1 < d2 ? prev : curr;
        });

        setSelectedRoutes(prev => [...prev, [
            [vehicle.location.lat, vehicle.location.lng],
            [nearest.location.lat, nearest.location.lng]
        ]]);
    };

    if (loading) return <div className="animate-pulse flex items-center justify-center h-full text-textMuted">Loading Map...</div>;

    // Bangalore default center
    const center = [12.9716, 77.5946];

    return (
        <div className="h-full flex flex-col space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-text">Fleet Map & Stations</h1>
                <p className="text-textMuted text-sm">Real-time geospatial tracking</p>
            </div>

            <div className="flex-1 bg-surface rounded-2xl border border-slate-700 overflow-hidden relative">
                <MapContainer center={center} zoom={12} scrollWheelZoom={true} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Render Stations */}
                    {stations.map(station => (
                        <Marker 
                            key={station._id} 
                            position={[station.location.lat, station.location.lng]}
                            icon={stationIcon}
                        >
                            <Popup className="rounded-xl overflow-hidden font-sans">
                                <b>{station.name}</b><br/>
                                Status: <span className="text-emerald-600 font-bold">{station.availability}</span>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Render Vehicles */}
                    {vehicles.map(vehicle => (
                        <Marker 
                            key={vehicle._id} 
                            position={[vehicle.location.lat, vehicle.location.lng]}
                            icon={vehicleIcon}
                        >
                            <Popup>
                                <b>{vehicle.vehicleId} ({vehicle.model})</b><br/>
                                <div className="flex items-center space-x-1 my-1">
                                    <BatteryCharging size={14} /> <span>{vehicle.batteryCapacity}%</span>
                                </div>
                                <button 
                                    onClick={() => handleRoute(vehicle)}
                                    className="mt-2 bg-primary text-white text-xs px-2 py-1 rounded w-full flex items-center justify-center space-x-1"
                                >
                                    <Route size={12} />
                                    <span>Route to Station</span>
                                </button>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Draw Routes manually and automatically */}
                    {selectedRoutes.map((route, idx) => (
                        <Polyline key={idx} positions={route} color="#3b82f6" weight={4} dashArray="10, 10" />
                    ))}

                </MapContainer>
                
                {/* Legend Overlay */}
                <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 z-[1000] shadow-lg">
                    <h4 className="text-text font-bold mb-2 text-sm">Legend</h4>
                    <div className="space-y-2 text-xs text-textMuted">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Vehicle</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            <span>Charging Station</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapView;
