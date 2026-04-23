import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Activity, X, Calendar, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

import { AuthContext } from '../context/AuthContext';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Vehicles = () => {
    const { user } = useContext(AuthContext);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
    const [currentVehicle, setCurrentVehicle] = useState({
        vehicleId: '', vehicleNumber: '', model: '', status: 'idle'
    });

    const fetchVehicles = async () => {
        try {
            const { data } = await axios.get('/api/vehicles');
            setVehicles(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleSaveVehicle = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'add') {
                await axios.post('/api/vehicles', currentVehicle);
            } else if (modalMode === 'edit') {
                await axios.put(`/api/vehicles/${currentVehicle._id}`, currentVehicle);
            }
            fetchVehicles();
            setIsModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving vehicle');
        }
    };

    const handleDeleteVehicle = async (id) => {
        if (!window.confirm('WARNING: Unlinking this EV. Proceed?')) return;
        try {
            await axios.delete(`/api/vehicles/${id}`);
            fetchVehicles();
            if (isModalOpen && currentVehicle._id === id) setIsModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting vehicle');
        }
    };

    const openModal = (mode, vehicle = null) => {
        setModalMode(mode);
        if (vehicle) {
            setCurrentVehicle({ ...vehicle });
        } else {
            setCurrentVehicle({ vehicleId: `EV00${vehicles.length + 1}`, vehicleNumber: '', model: '', status: 'idle' });
        }
        setIsModalOpen(true);
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'charging': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'idle': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
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
            <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center">
                        <CarIcon className="w-6 h-6 mr-3 text-blue-400" />
                        Fleet Vehicles
                    </h1>
                    <p className="text-slate-500 text-xs font-bold uppercase mt-1">Manage and monitor all EVs</p>
                </div>
            </div>

            <div className="bg-surface/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                <th className="p-4">Owner / Registered EV</th>
                                <th className="p-4">Model</th>
                                <th className="p-4">Recent Activity</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            <AnimatePresence>
                                {vehicles.map((v, index) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={v._id} 
                                        className="hover:bg-slate-800/40 transition-colors group"
                                    >
                                        <td className="p-4">
                                            <div className="font-bold text-white uppercase">{v.vehicleId}</div>
                                            <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">{v.vehicleNumber}</div>
                                        </td>
                                        <td className="p-4 text-white font-medium uppercase tracking-wider text-sm">{v.model}</td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-400">
                                                <span className="text-blue-400">Total Sessions: {v.totalSessions || 0}</span>
                                                {v.lastActive ? (
                                                    <span className="flex items-center uppercase"><Calendar className="w-3 h-3 mr-1" /> Last: {new Date(v.lastActive).toLocaleDateString()}</span>
                                                ) : (
                                                    <span className="italic text-slate-500 font-normal">No history</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <span className={cn("px-3 py-1 rounded-full border uppercase tracking-wider text-[10px] font-bold flex items-center w-max space-x-1", getStatusStyle(v.status))}>
                                                <Activity className="w-3 h-3" />
                                                <span>{v.status}</span>
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-3">
                                            {user?.role === 'Admin' && (
                                               <button onClick={() => openModal('edit', v)} className="text-blue-400 hover:text-white font-bold uppercase tracking-widest text-[10px] transition-colors border border-transparent hover:border-blue-500/30 px-2 py-1 rounded-lg">
                                                   Edit
                                               </button>
                                            )}
                                            <button onClick={() => openModal('view', v)} className="text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 hover:border-emerald-500 hover:text-white px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-all shadow shadow-emerald-500/5">
                                                View Details
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && modalMode === 'view' && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-slate-700 z-[9999] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] overflow-y-auto font-mono"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
                                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Vehicle Details</h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Owner</p>
                                        <p className="text-2xl font-black text-white uppercase">{currentVehicle.vehicleId}</p>
                                        <p className="text-xs font-bold text-slate-400 mt-1">{currentVehicle.email}</p>
                                        <p className="text-xs font-bold text-blue-400 mt-1 tracking-widest">{currentVehicle.vehicleNumber}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Total Sessions</p>
                                            <div className="flex items-center space-x-2">
                                                <Activity className="w-5 h-5 text-emerald-400" />
                                                <span className="text-xl font-black text-white">{currentVehicle.totalSessions || 0}</span>
                                            </div>
                                        </div>
                                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Status</p>
                                            <span className={cn("px-3 py-1 rounded-full border uppercase text-[10px] font-bold tracking-wider inline-block", getStatusStyle(currentVehicle.status))}>
                                                {currentVehicle.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Model Data</p>
                                        <p className="text-white font-bold uppercase tracking-widest text-sm">{currentVehicle.model}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}

                {isModalOpen && modalMode !== 'view' && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }}
                            className="bg-surface border border-slate-700 p-6 rounded-2xl w-full max-w-md relative shadow-2xl overflow-hidden font-mono"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-emerald-400"></div>
                            <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight flex justify-between items-center">
                                {modalMode === 'add' ? 'Deploy Vehicle' : 'Reconfigure Vehicle'}
                                <CarIcon className="text-blue-400 w-5 h-5" />
                            </h2>
                            
                            <form onSubmit={handleSaveVehicle} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Owner Name</label>
                                    <input required type="text" value={currentVehicle.vehicleId} onChange={e => setCurrentVehicle({...currentVehicle, vehicleId: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-500 outline-none uppercase text-sm" disabled />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Vehicle Number Plate</label>
                                    <input required type="text" value={currentVehicle.vehicleNumber} onChange={e => setCurrentVehicle({...currentVehicle, vehicleNumber: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all uppercase text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Model</label>
                                    <input required type="text" value={currentVehicle.model} onChange={e => setCurrentVehicle({...currentVehicle, model: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all uppercase text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
                                    <select value={currentVehicle.status} onChange={e => setCurrentVehicle({...currentVehicle, status: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all uppercase text-sm">
                                        <option value="idle">Idle</option>
                                        <option value="active">Active</option>
                                        <option value="charging">Charging</option>
                                    </select>
                                </div>
                                
                                <div className="flex justify-end space-x-3 pt-4 mt-2">
                                    {(modalMode === 'edit' && user?.role === 'Admin') && (
                                        <button type="button" onClick={() => handleDeleteVehicle(currentVehicle._id)} className="px-4 py-2 rounded-xl bg-transparent text-red-500 hover:bg-red-500/10 font-bold uppercase text-[10px] tracking-wider transition-colors mr-auto flex items-center">
                                            Unlink
                                        </button>
                                    )}
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 font-bold uppercase tracking-wider text-[10px] transition-colors">
                                        Cancel
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

const CarIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
        <circle cx="7" cy="17" r="2"></circle>
        <path d="M9 17h6"></path>
        <circle cx="17" cy="17" r="2"></circle>
    </svg>
);

export default Vehicles;
