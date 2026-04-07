import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BatteryMedium, MapPin, Activity, X } from 'lucide-react';
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
        vehicleId: '', vehicleNumber: '', model: '', batteryCapacity: 100, status: 'idle', location: { lat: 12.9716, lng: 77.5946 }
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
        if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
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
            setCurrentVehicle({ vehicleId: `EV00${vehicles.length + 1}`, vehicleNumber: '', model: '', batteryCapacity: 100, status: 'idle', location: { lat: 12.9716, lng: 77.5946 } });
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
                <Activity className="text-primary w-8 h-8" />
            </motion.div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-text">Fleet Vehicles</h1>
                    <p className="text-textMuted text-sm">Manage and monitor all EVs</p>
                </div>
                {user?.role === 'Admin' && (
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModal('add')}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-primary/30 hover:bg-blue-600 transition"
                    >
                        + Add Vehicle
                    </motion.button>
                )}
            </div>

            <div className="bg-surface rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/80 border-b border-slate-700 text-textMuted text-sm">
                                <th className="p-4 font-medium">Vehicle ID</th>
                                <th className="p-4 font-medium">Model</th>
                                <th className="p-4 font-medium">Battery</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Location</th>
                                <th className="p-4 font-medium text-right">Actions</th>
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
                                            <div className="font-bold text-text">{v.vehicleId}</div>
                                            <div className="text-xs text-textMuted">{v.vehicleNumber}</div>
                                        </td>
                                        <td className="p-4 text-text font-medium">{v.model}</td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <BatteryMedium className={cn("w-4 h-4", v.batteryCapacity < 30 ? "text-rose-500" : "text-emerald-500")} />
                                                <span className="text-text font-medium">{v.batteryCapacity}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <span className={cn("px-3 py-1 rounded-full border border-transparent capitalize text-xs font-bold flex items-center w-max space-x-1", getStatusStyle(v.status))}>
                                                <Activity className="w-3 h-3" />
                                                <span>{v.status}</span>
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2 text-textMuted">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">lat: {v.location?.lat.toFixed(2)}, lng: {v.location?.lng.toFixed(2)}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right space-x-3">
                                            {user?.role === 'Admin' && (
                                               <button onClick={() => openModal('edit', v)} className="text-emerald-500 hover:text-emerald-400 font-medium text-sm transition-colors border border-transparent hover:border-emerald-500/30 px-2 py-1 rounded-lg">
                                                   Edit
                                               </button>
                                            )}
                                            <button onClick={() => openModal('view', v)} className="text-primary bg-primary/10 hover:bg-primary border border-primary/20 hover:border-primary hover:text-white px-3 py-1.5 rounded-lg font-medium text-sm transition-all shadow shadow-primary/5">
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
                            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[9998]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-slate-700 z-[9999] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
                                    <h2 className="text-2xl font-bold text-text">Vehicle Details</h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                        <p className="text-sm text-textMuted mb-1">Vehicle ID</p>
                                        <p className="text-2xl font-black text-white">{currentVehicle.vehicleId}</p>
                                        <p className="text-sm font-medium text-primary mt-1">{currentVehicle.vehicleNumber}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                                            <p className="text-sm text-textMuted mb-2">Battery</p>
                                            <div className="flex items-center space-x-2">
                                                <BatteryMedium className={cn("w-5 h-5", currentVehicle.batteryCapacity < 30 ? "text-rose-500" : "text-emerald-500")} />
                                                <span className="text-xl font-bold text-white">{currentVehicle.batteryCapacity}%</span>
                                            </div>
                                        </div>
                                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                                            <p className="text-sm text-textMuted mb-2">Status</p>
                                            <span className={cn("px-3 py-1 rounded-full border capitalize text-xs font-bold inline-block", getStatusStyle(currentVehicle.status))}>
                                                {currentVehicle.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 text-sm">
                                        <p className="text-textMuted mb-1 font-medium">Model Data</p>
                                        <p className="text-white font-medium">{currentVehicle.model}</p>
                                    </div>

                                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 text-sm">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <span className="font-medium text-white">Current Location</span>
                                        </div>
                                        <p className="text-textMuted ml-6">
                                            Lat: {currentVehicle.location?.lat.toFixed(4)} <br/>
                                            Lng: {currentVehicle.location?.lng.toFixed(4)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}

                {isModalOpen && modalMode !== 'view' && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }}
                            className="bg-surface border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
                        >
                            <h2 className="text-xl font-bold text-text mb-4 capitalize">{modalMode} Vehicle</h2>
                            
                            <form onSubmit={handleSaveVehicle} className="space-y-4">
                                <div>
                                    <label className="text-xs text-textMuted font-bold">Vehicle ID (e.g. EV001)</label>
                                    <input required type="text" value={currentVehicle.vehicleId} onChange={e => setCurrentVehicle({...currentVehicle, vehicleId: e.target.value})} className="w-full mt-1 p-2 bg-slate-800/50 border border-slate-700 rounded-lg text-text focus:border-primary disabled:opacity-50" />
                                </div>
                                <div>
                                    <label className="text-xs text-textMuted font-bold">Vehicle Number Plate</label>
                                    <input required type="text" value={currentVehicle.vehicleNumber} onChange={e => setCurrentVehicle({...currentVehicle, vehicleNumber: e.target.value})} className="w-full mt-1 p-2 bg-slate-800/50 border border-slate-700 rounded-lg text-text focus:border-primary disabled:opacity-50" />
                                </div>
                                <div>
                                    <label className="text-xs text-textMuted font-bold">Model</label>
                                    <input required type="text" value={currentVehicle.model} onChange={e => setCurrentVehicle({...currentVehicle, model: e.target.value})} className="w-full mt-1 p-2 bg-slate-800/50 border border-slate-700 rounded-lg text-text focus:border-primary disabled:opacity-50" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-textMuted font-bold">Battery (%)</label>
                                        <input required type="number" min="0" max="100" value={currentVehicle.batteryCapacity} onChange={e => setCurrentVehicle({...currentVehicle, batteryCapacity: parseInt(e.target.value)})} className="w-full mt-1 p-2 bg-slate-800/50 border border-slate-700 rounded-lg text-text focus:border-primary disabled:opacity-50" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-textMuted font-bold">Status</label>
                                        <select value={currentVehicle.status} onChange={e => setCurrentVehicle({...currentVehicle, status: e.target.value})} className="w-full mt-1 p-2 bg-slate-800/50 border border-slate-700 rounded-lg text-text focus:border-primary disabled:opacity-50">
                                            <option value="idle">Idle</option>
                                            <option value="active">Active</option>
                                            <option value="charging">Charging</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700 mt-6">
                                    {(modalMode === 'edit' && user?.role === 'Admin') && (
                                        <button type="button" onClick={() => handleDeleteVehicle(currentVehicle._id)} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg font-medium transition mr-auto">
                                            Delete
                                        </button>
                                    )}
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-600 text-textMuted hover:text-text hover:bg-slate-800 rounded-lg font-medium transition">
                                        Cancel
                                    </button>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-4 py-2 bg-primary text-white hover:bg-blue-600 rounded-lg font-medium transition shadow-lg shadow-primary/20">
                                        Save Vehicle
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Vehicles;
