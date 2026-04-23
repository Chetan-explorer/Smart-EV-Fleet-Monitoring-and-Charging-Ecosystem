import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserCircle, Mail, Car, ShieldCheck, Activity, Calendar, AlertCircle } from 'lucide-react';
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
                <Activity className="text-blue-400 w-8 h-8" />
            </motion.div>
        </div>
    );

    return (
        <div className="space-y-6 font-mono selection:bg-blue-500 selection:text-white pb-10">
            <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center">
                        <UsersIcon className="w-6 h-6 mr-3 text-blue-400" />
                        User Management
                    </h1>
                    <p className="text-slate-500 text-xs font-bold uppercase mt-1">View all registered personnel and fleet users</p>
                </div>
            </div>

            <div className="bg-surface/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                <th className="p-4">User ID / Name</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Email Address</th>
                                <th className="p-4">Registered Vehicle</th>
                                <th className="p-4">Activity Intelligence</th>
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
                                                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center text-blue-400 font-bold shadow-inner group-hover:scale-110 transition-transform">
                                                    {u.name?.charAt(0) || <UserCircle className="w-5 h-5 text-slate-400" />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white uppercase">{u.name}</div>
                                                    <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">ID: {u._id.toString().slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full border text-[10px] font-bold flex items-center w-max space-x-1 uppercase tracking-wider ${getRoleStyle(u.role)}`}>
                                                <ShieldCheck className="w-3 h-3" />
                                                <span>{u.role}</span>
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold">
                                                <Mail className="w-4 h-4 text-slate-500" />
                                                <span>{u.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {u.role === 'User' ? (
                                                <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700 w-max">
                                                    {u.vehicleNumber || u.vehicleModel ? (
                                                        <div className="flex flex-col text-[10px]">
                                                            <span className="text-emerald-400 font-bold flex items-center space-x-1.5 uppercase tracking-widest"><Car className="w-3 h-3" /> <span>{u.vehicleNumber || 'No Plate'}</span></span>
                                                            <span className="text-slate-400 font-bold uppercase mt-1">{u.vehicleModel || 'No Model'}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-500 italic uppercase font-bold">No Vehicle Registered</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-slate-500 italic uppercase font-bold">N/A - System Account</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {u.role === 'User' ? (
                                                <div className="flex flex-col gap-2 text-[10px] text-slate-400 font-bold">
                                                    <div className="flex items-center gap-3 bg-slate-900/50 p-1.5 rounded-lg border border-slate-700/50 w-max">
                                                        <span className="text-slate-300">Total: {u.stats?.totalBookings || 0}</span>
                                                        <span className="text-emerald-400 flex items-center"><Activity className="w-3 h-3 mr-1"/>{u.stats?.active || 0} Act</span>
                                                        <span className="text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{u.stats?.cancelled || 0} Cxl</span>
                                                    </div>
                                                    {u.stats?.lastBookedDate ? (
                                                        <div className="flex items-center text-slate-500 uppercase">
                                                            <Calendar className="w-3 h-3 mr-1.5" />
                                                            Last: <span className="text-blue-400 ml-1">{new Date(u.stats.lastBookedDate).toLocaleDateString()}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="italic text-slate-500">No booking history</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-slate-500 italic uppercase font-bold">N/A</span>
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

const UsersIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

export default Users;
