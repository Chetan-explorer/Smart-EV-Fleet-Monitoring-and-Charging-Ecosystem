import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Clock, Zap, Car, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

const BookingModal = ({ isOpen, onClose, station, onConfirm }) => {
    const [bookingDate, setBookingDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const { user } = React.useContext(AuthContext);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const startDateTime = new Date(`${bookingDate}T${startTime}:00`);
        const now = new Date();
        
        if (startDateTime - now < 30 * 60 * 1000) {
            return alert('There must be a minimum gap of 30 minutes from the current time.');
        }

        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

        onConfirm({
            stationId: station._id,
            bookingDate,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            vehicleModel: user?.vehicleModel || 'Not Specified'
        });
    };

    const tzOffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, -1);
    const minDateString = localISOTime.split('T')[0];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-surface border border-slate-700/60 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-textMuted hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                    
                    <h2 className="text-2xl font-bold text-text mb-2">Book Station</h2>
                    <p className="text-textMuted text-sm mb-6 flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-primary" /> {station?.name}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-textMuted mb-1">Your Vehicle</label>
                            <div className="w-full bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-text cursor-not-allowed opacity-80 font-medium">
                                {user?.vehicleModel || 'No vehicle registered'}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-textMuted mb-1">Date</label>
                            <input 
                                required
                                type="date" 
                                min={minDateString}
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary [color-scheme:dark]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-textMuted mb-1">Start Time</label>
                            <input 
                                required
                                type="time" 
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary [color-scheme:dark]"
                            />
                        </div>

                        <button 
                            type="submit"
                            className="w-full mt-6 py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition flex justify-center items-center space-x-2"
                        >
                            <Zap className="w-5 h-5" />
                            <span>Confirm Booking</span>
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const UserStations = () => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStation, setSelectedStation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

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
        const interval = setInterval(fetchNearby, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleBookNow = (station) => {
        setSelectedStation(station);
        setIsModalOpen(true);
    };

    const handleConfirmBooking = async (bookingData) => {
        try {
            await axios.post('/api/bookings', bookingData);
            setIsModalOpen(false);
            navigate('/dashboard/bookings');
        } catch (error) {
             alert(error.response?.data?.message || 'Error creating booking');
        }
    };

    if (loading) return <div className="animate-pulse flex items-center justify-center h-full text-textMuted">Locating Stations...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-text">Nearest Stations</h1>
                <p className="text-textMuted text-sm">Sorted by availability and wait times</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {stations.map((station, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        key={station._id} 
                        className="bg-surface border border-slate-700 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-500 transition-colors"
                    >
                        {index === 0 && (
                           <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 shadow-lg">
                               Recommended
                           </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-text flex items-center space-x-2">
                                    <MapPin className="text-primary w-5 h-5 flex-shrink-0" />
                                    <span>{station.name}</span>
                                </h3>
                            </div>
                            
                            <span className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold border ${
                                station.crowdedness === 'High' ? 'bg-red-500/10 border-red-500 text-red-500' :
                                station.crowdedness === 'Moderate' ? 'bg-amber-500/10 border-amber-500 text-amber-500' :
                                'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                            }`}>
                                {station.crowdedness} Traffic
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-slate-800/50 p-3 rounded-xl flex items-center space-x-3">
                                <Zap className="text-emerald-400 w-5 h-5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-textMuted leading-tight">Available Slots</p>
                                    <p className="text-lg font-bold text-emerald-400">{station.availableSlots}</p>
                                </div>
                            </div>
                            
                            <div className="bg-slate-800/50 p-3 rounded-xl flex items-center space-x-3">
                                <MapPin className="text-textMuted w-5 h-5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-textMuted leading-tight">Total Capacity</p>
                                    <p className="text-lg font-bold text-text">{station.capacity || 1} Ports</p>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 p-3 rounded-xl flex items-center space-x-3">
                                <Car className="text-textMuted w-5 h-5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-textMuted leading-tight">Queued (Today)</p>
                                    <p className="text-lg font-bold text-text">{station.todayQueue || 0}</p>
                                </div>
                            </div>
                            
                            <div className="bg-slate-800/50 p-3 rounded-xl flex items-center space-x-3">
                                <Clock className="text-textMuted w-5 h-5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-textMuted leading-tight">Estimated Wait</p>
                                    <p className="text-sm font-bold text-text">
                                        {station.nextAvailableSlot 
                                            ? `${Math.max(0, Math.round((new Date(station.nextAvailableSlot) - new Date()) / 60000))} mins` 
                                            : "Available Now"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => handleBookNow(station)}
                            className="mt-6 w-full py-3 bg-primary hover:bg-blue-600 text-white font-medium rounded-xl transition flex justify-center items-center space-x-2 shadow-lg shadow-primary/20"
                        >
                            <Zap className="w-4 h-4 flex-shrink-0" />
                            <span>Book Now</span>
                        </button>
                    </motion.div>
                ))}
            </div>

            <BookingModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                station={selectedStation}
                onConfirm={handleConfirmBooking}
            />
        </div>
    );
};

export default UserStations;
