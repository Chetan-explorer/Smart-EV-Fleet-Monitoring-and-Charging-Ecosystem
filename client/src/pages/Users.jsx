import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserCircle, Mail, Car, ShieldCheck, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { AuthContext } from '../context/AuthContext';

const Users = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/api/auth');
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const getRoleStyle = (role) => {
        switch(role) {
            case 'Admin': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'FleetManager': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'User': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
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
                    <h1 className="text-2xl font-bold text-text">User Management</h1>
                    <p className="text-textMuted text-sm">View all registered personnel and fleet users</p>
                </div>
            </div>

            <div className="bg-surface rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/80 border-b border-slate-700 text-textMuted text-sm">
                                <th className="p-4 font-medium">User ID / Name</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Email Address</th>
                                <th className="p-4 font-medium">Registered Vehicle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            <AnimatePresence>
                                {users.map((u, index) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={u._id} 
                                        className="hover:bg-slate-800/40 transition-colors group"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-primary font-bold shadow-inner">
                                                    {u.name?.charAt(0) || <UserCircle className="w-5 h-5 text-slate-400" />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-text">{u.name}</div>
                                                    <div className="text-xs text-textMuted font-mono">ID: {u._id.toString().slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center w-max space-x-1 ${getRoleStyle(u.role)}`}>
                                                <ShieldCheck className="w-3 h-3" />
                                                <span>{u.role}</span>
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2 text-textMuted">
                                                <Mail className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm font-medium">{u.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {u.role === 'User' ? (
                                                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700 w-max">
                                                    {u.vehicleNumber || u.vehicleModel ? (
                                                        <div className="flex flex-col text-xs">
                                                            <span className="text-primary font-bold flex items-center space-x-1"><Car className="w-3 h-3" /> <span>{u.vehicleNumber || 'No Plate'}</span></span>
                                                            <span className="text-slate-400">{u.vehicleModel || 'No Model'}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-500 italic">No Vehicle Registered</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-500 italic">N/A - Admin/Manager Role</span>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;
