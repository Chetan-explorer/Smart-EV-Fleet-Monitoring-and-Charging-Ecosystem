import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, CheckCircle2, XCircle, Zap, Car, ArrowRight } from 'lucide-react';

const BookingCard = ({ booking, onCancel }) => {
    const isHistory = booking.status !== 'active';

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/10 border-emerald-500 text-emerald-500';
            case 'completed': return 'bg-blue-500/10 border-blue-500 text-blue-500';
            case 'cancelled': return 'bg-red-500/10 border-red-500 text-red-500';
            default: return 'bg-slate-500/10 border-slate-500 text-slate-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <Zap className="w-4 h-4 mr-1" />;
            case 'completed': return <CheckCircle2 className="w-4 h-4 mr-1" />;
            case 'cancelled': return <XCircle className="w-4 h-4 mr-1" />;
            default: return null;
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -5 }}
            className="bg-surface/80 backdrop-blur-xl border border-slate-700/60 p-6 rounded-2xl relative overflow-hidden group shadow-lg"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-text flex items-center space-x-2">
                        <MapPin className={`w-5 h-5 ${booking.status === 'active' ? 'text-primary' : 'text-slate-400'}`} />
                        <span>{booking.stationId?.name || 'Unknown Station'}</span>
                    </h3>
                    <p className="text-sm text-textMuted mt-1 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(booking.bookingDate).toLocaleDateString()} • {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center uppercase ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    {booking.status}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                 <div className="bg-slate-800/50 p-4 rounded-xl flex items-center space-x-3">
                    <Car className="text-textMuted w-5 h-5" />
                    <div>
                        <p className="text-xs text-textMuted">Vehicle</p>
                        <p className="text-sm font-bold text-text">Selected EV</p>
                    </div>
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-xl flex items-center space-x-3">
                    <Clock className="text-textMuted w-5 h-5" />
                    <div>
                        <p className="text-xs text-textMuted">{isHistory ? 'End Time' : 'Est. Completion'}</p>
                        <p className="text-sm font-bold text-text">
                            {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>

            {!isHistory && (
                <button 
                    onClick={() => onCancel(booking._id)}
                    className="mt-6 w-full py-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/20 hover:border-red-500 font-medium rounded-xl transition flex justify-center items-center space-x-2"
                >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Booking</span>
                </button>
            )}
        </motion.div>
    );
};

const MyBookings = () => {
    const [activeBookings, setActiveBookings] = useState([]);
    const [historyBookings, setHistoryBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const [activeRes, historyRes] = await Promise.all([
                axios.get('/api/bookings/my'),
                axios.get('/api/bookings/history')
            ]);
            setActiveBookings(activeRes.data);
            setHistoryBookings(historyRes.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        try {
            await axios.put(`/api/bookings/${id}/cancel`);
            fetchBookings(); // Refresh lists
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Failed to cancel booking');
        }
    };

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-10 w-48 bg-slate-800/50 rounded-lg"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2].map(i => <div key={i} className="h-64 bg-surface rounded-2xl border border-slate-800"></div>)}
                </div>
            </div>
        );
    }

    const hasNoBookings = activeBookings.length === 0 && historyBookings.length === 0;

    if (hasNoBookings) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-[80vh] text-center max-w-md mx-auto"
            >
                <div className="w-32 h-32 mb-8 bg-primary/10 rounded-full flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 animate-ping rounded-full"></div>
                    <Zap className="w-16 h-16 text-primary relative z-10" />
                </div>
                <h2 className="text-3xl font-black text-text mb-4">No Bookings Yet</h2>
                <p className="text-textMuted mb-8 leading-relaxed">
                    You haven’t booked any charging stations yet. Find a standard station nearby and reserve your spot to skip the queue.
                </p>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/dashboard')}
                    className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold font-lg transition-colors flex items-center space-x-3 shadow-lg shadow-primary/25"
                >
                    <span>Book a Charging Station</span>
                    <ArrowRight className="w-5 h-5" />
                </motion.button>
            </motion.div>
        );
    }

    return (
        <div className="space-y-12">
            <div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-black text-text">Currently Booked</h1>
                    <p className="text-textMuted text-sm mt-1">Manage your active charging sessions</p>
                </motion.div>

                {activeBookings.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        <AnimatePresence>
                            {activeBookings.map(booking => (
                                <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <p className="text-textMuted bg-surface/50 p-6 rounded-2xl border border-slate-800 mt-6 text-center border-dashed">
                        No active bookings at the moment.
                    </p>
                )}
            </div>

            <div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <h2 className="text-2xl font-black text-text">Booking History</h2>
                    <p className="text-textMuted text-sm mt-1">Past sessions and cancelled bookings</p>
                </motion.div>

                {historyBookings.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        <AnimatePresence>
                            {historyBookings.map(booking => (
                                <BookingCard key={booking._id} booking={booking} />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <p className="text-textMuted bg-surface/50 p-6 rounded-2xl border border-slate-800 mt-6 text-center border-dashed">
                        Your history will appear here once you've completed a session.
                    </p>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
