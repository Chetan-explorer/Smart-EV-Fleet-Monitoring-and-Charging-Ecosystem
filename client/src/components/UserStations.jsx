import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Clock, Zap, Car } from 'lucide-react';

const UserStations = () => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNearby = async () => {
            try {
                const { data } = await axios.get('/api/stations/nearby');
                setStations(data);
            } catch (error) {
                console.error('Error fetching nearby stations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNearby();
    }, []);

    if (loading) return <div className="animate-pulse flex items-center justify-center h-full text-textMuted">Locating Stations...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-text">Nearest Stations</h1>
                <p className="text-textMuted text-sm">Sorted by availability and wait times</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {stations.map((station, index) => (
                    <div key={station._id} className="bg-surface border border-slate-700 p-6 rounded-2xl relative overflow-hidden group">
                        
                        {/* Highlight ribbon for least crowded */}
                        {index === 0 && (
                           <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 shadow-lg">
                               Recommended
                           </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-text flex items-center space-x-2">
                                    <MapPin className="text-primary w-5 h-5" />
                                    <span>{station.name}</span>
                                </h3>
                                <p className="text-sm text-textMuted mt-1">lat: {station.location.lat.toFixed(3)}, lng: {station.location.lng.toFixed(3)}</p>
                            </div>
                            
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                station.crowdedness === 'High' ? 'bg-red-500/10 border-red-500 text-red-500' :
                                station.crowdedness === 'Moderate' ? 'bg-amber-500/10 border-amber-500 text-amber-500' :
                                'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                            }`}>
                                {station.crowdedness} Traffic
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-slate-800/50 p-4 rounded-xl flex items-center space-x-3">
                                <Car className="text-textMuted w-5 h-5" />
                                <div>
                                    <p className="text-xs text-textMuted">Vehicles Queued</p>
                                    <p className="text-lg font-bold text-text">{station.activeBookingsCount}</p>
                                </div>
                            </div>
                            
                            <div className="bg-slate-800/50 p-4 rounded-xl flex items-center space-x-3">
                                <Clock className="text-textMuted w-5 h-5" />
                                <div>
                                    <p className="text-xs text-textMuted">Next Available Slot</p>
                                    <p className="text-sm font-bold text-text">
                                        {station.nextAvailableSlot 
                                            ? new Date(station.nextAvailableSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                                            : "Available Now"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button className="mt-6 w-full py-3 bg-primary hover:bg-blue-600 text-white font-medium rounded-xl transition flex justify-center items-center space-x-2">
                            <Zap className="w-4 h-4" />
                            <span>Book Slot</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserStations;
