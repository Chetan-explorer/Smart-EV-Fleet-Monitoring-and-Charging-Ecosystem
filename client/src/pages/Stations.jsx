import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MapPin, Zap, Activity, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

import { AuthContext } from '../context/AuthContext';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Stations = () => {
    const { user } = useContext(AuthContext);
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentStation, setCurrentStation] = useState({
        stationId: '', name: '', location: { lat: 12.9716, lng: 77.5946 }, availability: 'available', capacity: 1
    });

    const fetchStations = async () => {
        try {
            const { data } = await axios.get('/api/stations');
            setStations(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStations();
    }, []);

    const handleSaveStation = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'add') {
                await axios.post('/api/stations', currentStation);
            } else if (modalMode === 'edit') {
                await axios.put(`/api/stations/${currentStation._id}`, currentStation);
            }
            fetchStations();
            setIsModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving station');
        }
    };

    const handleDeleteStation = async (id) => {
        if (!window.confirm('WARNING: Deleting this hard-infrastructure node. Proceed?')) return;
        try {
            await axios.delete(`/api/stations/${id}`);
            fetchStations();
            if (isModalOpen && currentStation._id === id) setIsModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting station');
        }
    };

    const openModal = (mode, station = null) => {
        setModalMode(mode);
        if (station) {
            setCurrentStation({ ...station, capacity: station.capacity || 1 });
        } else {
            setCurrentStation({ stationId: `CS00${stations.length + 1}`, name: '', location: { lat: 12.9716, lng: 77.5946 }, availability: 'available', capacity: 1 });
        }
        setIsModalOpen(true);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Activity className="text-[#D4FF00] w-8 h-8" />
            </motion.div>
        </div>
    );

    return (
        <div className="space-y-6 font-mono selection:bg-[#D4FF00] selection:text-black">
            <div className="flex justify-between items-end border-b-2 border-slate-700 pb-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Infrastructure Nodes</h1>
                    <p className="text-slate-400 text-sm mt-1 uppercase">Manage Physical Hardware Elements</p>
                </div>
                {user?.role === 'Admin' && (
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModal('add')}
                        className="bg-[#D4FF00] text-black px-6 py-2 border-2 border-[#D4FF00] font-black uppercase text-sm hover:bg-black hover:text-[#D4FF00] transition-colors shadow-[4px_4px_0_0_#99cc00]"
                    >
                        + DEPLOY NODE
                    </motion.button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {stations.map((s, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            key={s._id} 
                            className="bg-black border-2 border-slate-700 hover:border-[#D4FF00] p-6 relative group transition-colors shadow-[8px_8px_0_0_rgba(255,255,255,0.05)] hover:shadow-[8px_8px_0_0_rgba(212,255,0,0.2)]"
                        >
                            <div className="absolute top-4 right-4 text-xs font-black px-2 py-1 uppercase tracking-widest border"
                                 style={{
                                    borderColor: s.availability === 'available' ? '#D4FF00' : s.availability === 'occupied' ? '#ef4444' : '#64748b',
                                    color: s.availability === 'available' ? '#D4FF00' : s.availability === 'occupied' ? '#ef4444' : '#64748b'
                                 }}>
                                {s.availability}
                            </div>
                            
                            <MapPin className="text-[#D4FF00] w-8 h-8 mb-4 stroke-[1.5]" />
                            <h3 className="text-xl font-black text-white uppercase truncate" title={s.name}>{s.name}</h3>
                            <p className="text-slate-500 font-bold mb-4">{s.stationId}</p>

                            <div className="bg-slate-900 border border-slate-800 p-3 mb-6 text-xs text-slate-400 font-mono">
                                <div className="flex justify-between mb-1">
                                    <span>LAT</span> <span className="text-white">{s.location?.lat.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span>LNG</span> <span className="text-white">{s.location?.lng.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-800 pt-1 mt-1">
                                    <span>PORT CAPACITY</span> <span className="text-[#D4FF00] font-black">{s.capacity || 1}</span>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                {user?.role === 'Admin' && (
                                   <button onClick={() => openModal('edit', s)} className="flex-1 border border-slate-600 text-slate-300 hover:text-white font-bold text-sm py-2 uppercase hover:bg-slate-800 transition-colors">
                                       RECONFIGURE
                                   </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999]"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }}
                            className="bg-black border-2 border-slate-700 p-8 w-full max-w-md relative shadow-[16px_16px_0_0_#D4FF00]"
                        >
                            <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight border-b border-slate-800 pb-2 flex justify-between items-center">
                                {modalMode === 'add' ? 'DEPLOY NEW NODE' : 'RECONFIGURE NODE'}
                                <Activity className="text-[#D4FF00]" />
                            </h2>
                            
                            <form onSubmit={handleSaveStation} className="space-y-5 font-mono">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Node ID</label>
                                    <input required type="text" value={currentStation.stationId} onChange={e => setCurrentStation({...currentStation, stationId: e.target.value})} className="w-full p-3 bg-slate-900 border border-slate-700 text-white focus:border-[#D4FF00] focus:ring-1 focus:ring-[#D4FF00] outline-none transition-all uppercase" placeholder="e.g. CS001" disabled={modalMode === 'edit'}/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Designation (Name)</label>
                                    <input required type="text" value={currentStation.name} onChange={e => setCurrentStation({...currentStation, name: e.target.value})} className="w-full p-3 bg-slate-900 border border-slate-700 text-white focus:border-[#D4FF00] focus:ring-1 focus:ring-[#D4FF00] outline-none transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Latitude</label>
                                        <input required type="number" step="any" value={currentStation.location.lat} onChange={e => setCurrentStation({...currentStation, location: {...currentStation.location, lat: parseFloat(e.target.value)}})} className="w-full p-3 bg-slate-900 border border-slate-700 text-white focus:border-[#D4FF00] focus:ring-1 focus:ring-[#D4FF00] outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Longitude</label>
                                        <input required type="number" step="any" value={currentStation.location.lng} onChange={e => setCurrentStation({...currentStation, location: {...currentStation.location, lng: parseFloat(e.target.value)}})} className="w-full p-3 bg-slate-900 border border-slate-700 text-white focus:border-[#D4FF00] focus:ring-1 focus:ring-[#D4FF00] outline-none transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Hardware Status</label>
                                    <select value={currentStation.availability} onChange={e => setCurrentStation({...currentStation, availability: e.target.value})} className="w-full p-3 bg-slate-900 border border-slate-700 text-white focus:border-[#D4FF00] focus:ring-1 focus:ring-[#D4FF00] outline-none transition-all uppercase">
                                        <option value="available">Available / Online</option>
                                        <option value="occupied">Occupied</option>
                                        <option value="offline">Offline / Maint.</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Simultaneous Port Capacity</label>
                                    <input required type="number" min="1" step="1" value={currentStation.capacity} onChange={e => setCurrentStation({...currentStation, capacity: parseInt(e.target.value) || 1})} className="w-full p-3 bg-slate-900 border border-slate-700 text-white focus:border-[#D4FF00] focus:ring-1 focus:ring-[#D4FF00] outline-none transition-all uppercase" />
                                </div>
                                
                                <div className="flex justify-end space-x-4 pt-6 border-t border-slate-800 mt-6">
                                    {(modalMode === 'edit') && (
                                        <button type="button" onClick={() => handleDeleteStation(currentStation._id)} className="px-4 py-3 bg-transparent text-red-500 border border-red-500/50 hover:bg-red-500/10 font-bold uppercase text-sm transition-colors mr-auto">
                                            TERMINATE
                                        </button>
                                    )}
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 font-bold uppercase tracking-wider text-sm transition-colors">
                                        ABORT
                                    </button>
                                    <button type="submit" className="px-6 py-3 bg-[#D4FF00] text-black font-black uppercase tracking-wider text-sm hover:bg-white transition-colors shadow-[0_0_15px_rgba(212,255,0,0.3)]">
                                        EXECUTE
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Stations;
