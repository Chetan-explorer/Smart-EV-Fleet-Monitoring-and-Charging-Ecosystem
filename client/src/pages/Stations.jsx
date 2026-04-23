import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MapPin, Zap, Activity, X, Plus, Edit2, Trash2, Calendar, AlertCircle, Clock, ChevronDown, ChevronUp, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { AuthContext } from '../context/AuthContext';

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

    const [expandedStationId, setExpandedStationId] = useState(null);

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

    const toggleExpand = (id) => {
        setExpandedStationId(prev => prev === id ? null : id);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Activity className="text-blue-400 w-8 h-8" />
            </motion.div>
        </div>
    );

    return (
        <div className="space-y-6 font-mono selection:bg-blue-500 selection:text-white pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-800 pb-4 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center">
                        <MapPin className="w-6 h-6 mr-3 text-blue-400" />
                        Infrastructure Nodes
                    </h1>
                    <p className="text-slate-500 text-xs font-bold uppercase mt-1">Manage Physical Hardware Elements</p>
                </div>
                {user?.role === 'Admin' && (
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModal('add')}
                        className="px-5 py-2.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold uppercase transition flex items-center shadow-sm hover:shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4 mr-1.5" /> Deploy Node
                    </motion.button>
                )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                <AnimatePresence>
                    {stations.map((s, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            key={s._id} 
                            className="bg-surface/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl relative overflow-hidden shadow-lg transition-all group hover:border-slate-500/50 flex flex-col"
                        >
                            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-10 transition-opacity duration-500 ${s.availability === 'available' ? 'bg-emerald-500' : s.availability === 'occupied' ? 'bg-red-500' : 'bg-slate-500'}`}></div>
                            
                            <div className="p-6 pb-4 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl shadow-inner border ${s.availability === 'available' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : s.availability === 'occupied' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border ${s.availability === 'available' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : s.availability === 'occupied' ? 'border-red-500/50 text-red-400 bg-red-500/10' : 'border-slate-500/50 text-slate-400 bg-slate-500/10'}`}>
                                        {s.availability}
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-white uppercase truncate mb-1" title={s.name}>{s.name}</h3>
                                <p className="text-xs text-slate-500 font-bold mb-4 uppercase tracking-widest">{s.stationId}</p>

                                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 font-mono space-y-2 mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center"><Activity className="w-3 h-3 mr-1.5 text-blue-400"/> Current Load</span> 
                                        <span className="text-white font-bold">{s.activeBookingsCount || 0} / <span className="text-blue-400">{s.capacity || 1}</span> Ports</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, ((s.activeBookingsCount || 0) / (s.capacity || 1)) * 100)}%`}}></div>
                                    </div>
                                </div>

                                {/* Bookings Details Toggle */}
                                <button onClick={() => toggleExpand(s._id)} className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors bg-slate-800/30 p-2.5 rounded-lg border border-slate-700/50">
                                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-2 text-emerald-400" /> View Bookings Data</span>
                                    {expandedStationId === s._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>

                                <AnimatePresence>
                                    {expandedStationId === s._id && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <div className="mt-4 space-y-4">
                                                {/* Active Bookings */}
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-emerald-400 uppercase mb-2 flex items-center border-b border-slate-800 pb-1">
                                                        <Zap className="w-3 h-3 mr-1" /> Active Bookings ({s.bookings?.active?.length || 0})
                                                    </h4>
                                                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                                                        {s.bookings?.active?.length > 0 ? s.bookings.active.map(b => (
                                                            <div key={b._id} className="bg-slate-900/80 p-2.5 rounded-lg text-[10px] border border-slate-800">
                                                                <div className="flex justify-between items-center mb-1.5">
                                                                    <span className="text-white font-bold truncate flex items-center"><UserIcon className="w-3 h-3 mr-1 text-slate-500"/>{b.userId?.name || 'Unknown User'}</span>
                                                                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">{b.vehicleModel}</span>
                                                                </div>
                                                                <div className="flex justify-between text-slate-500 flex-col gap-0.5">
                                                                    <span className="flex items-center"><Clock className="w-2.5 h-2.5 mr-1" /> Start: {new Date(b.startTime).toLocaleString()}</span>
                                                                    <span className="flex items-center"><Clock className="w-2.5 h-2.5 mr-1 opacity-0" /> End: {new Date(b.endTime).toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        )) : <p className="text-[10px] text-slate-600 italic">No active bookings.</p>}
                                                    </div>
                                                </div>

                                                {/* Cancelled Bookings */}
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-red-400 uppercase mb-2 flex items-center border-b border-slate-800 pb-1">
                                                        <AlertCircle className="w-3 h-3 mr-1" /> Cancelled Bookings ({s.bookings?.cancelled?.length || 0})
                                                    </h4>
                                                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                                                        {s.bookings?.cancelled?.length > 0 ? s.bookings.cancelled.map(b => (
                                                            <div key={b._id} className="bg-red-500/5 p-2.5 rounded-lg text-[10px] border border-red-500/10">
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <span className="text-white font-bold truncate flex items-center"><UserIcon className="w-3 h-3 mr-1 text-slate-500"/>{b.userId?.name || 'Unknown User'}</span>
                                                                    <span className="text-slate-500">{new Date(b.bookingDate).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                        )) : <p className="text-[10px] text-slate-600 italic">No cancelled bookings.</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {user?.role === 'Admin' && (
                                <div className="p-4 pt-0 mt-auto">
                                   <button onClick={() => openModal('edit', s)} className="w-full flex items-center justify-center border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 font-bold text-xs py-2.5 rounded-xl uppercase transition-colors">
                                       <Edit2 className="w-3 h-3 mr-2" /> Reconfigure Node
                                   </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }}
                            className="bg-surface border border-slate-700 p-6 rounded-2xl w-full max-w-md relative shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-emerald-400"></div>
                            
                            <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight flex justify-between items-center">
                                {modalMode === 'add' ? 'Deploy New Node' : 'Reconfigure Node'}
                                <MapPin className="text-blue-400 w-5 h-5" />
                            </h2>
                            
                            <form onSubmit={handleSaveStation} className="space-y-4 font-mono">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Node ID</label>
                                    <input required type="text" value={currentStation.stationId} onChange={e => setCurrentStation({...currentStation, stationId: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all uppercase text-sm" placeholder="e.g. CS001" disabled={modalMode === 'edit'}/>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Designation (Name)</label>
                                    <input required type="text" value={currentStation.name} onChange={e => setCurrentStation({...currentStation, name: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Latitude</label>
                                        <input required type="number" step="any" value={currentStation.location.lat} onChange={e => setCurrentStation({...currentStation, location: {...currentStation.location, lat: parseFloat(e.target.value)}})} className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Longitude</label>
                                        <input required type="number" step="any" value={currentStation.location.lng} onChange={e => setCurrentStation({...currentStation, location: {...currentStation.location, lng: parseFloat(e.target.value)}})} className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hardware Status</label>
                                    <select value={currentStation.availability} onChange={e => setCurrentStation({...currentStation, availability: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all uppercase text-sm">
                                        <option value="available">Available / Online</option>
                                        <option value="occupied">Occupied</option>
                                        <option value="offline">Offline / Maint.</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Simultaneous Port Capacity</label>
                                    <input required type="number" min="1" step="1" value={currentStation.capacity} onChange={e => setCurrentStation({...currentStation, capacity: parseInt(e.target.value) || 1})} className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all uppercase text-sm" />
                                </div>
                                
                                <div className="flex justify-end space-x-3 pt-4 mt-2">
                                    {(modalMode === 'edit') && (
                                        <button type="button" onClick={() => handleDeleteStation(currentStation._id)} className="px-4 py-2 rounded-xl bg-transparent text-red-500 hover:bg-red-500/10 font-bold uppercase text-[10px] tracking-wider transition-colors mr-auto flex items-center">
                                            <Trash2 className="w-3 h-3 mr-1" /> Terminate
                                        </button>
                                    )}
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 font-bold uppercase tracking-wider text-[10px] transition-colors">
                                        Abort
                                    </button>
                                    <button type="submit" className="px-6 py-2 rounded-xl bg-blue-600/20 border border-blue-500/50 text-blue-400 font-black uppercase tracking-wider text-[10px] hover:bg-blue-600 hover:text-white transition-colors">
                                        Execute
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
