import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Car, Zap, BatteryCharging, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Provide a neat card animation variant
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">My Profile</h1>
                <p className="text-textMuted text-sm">Manage your account and EV details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* ID Card / Main Profile info */}
                <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3 }}
                    className="md:col-span-1 bg-surface p-6 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden group flex flex-col items-center text-center"
                >
                    {/* Glowing background blob */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
                    
                    <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-emerald-500/50 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <UserIcon className="w-10 h-10 text-emerald-400" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-text mb-1">{user?.name}</h2>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 block" />
                        <span>{user?.role}</span>
                    </span>

                    <div className="w-full mt-6 space-y-3 text-left">
                        <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl">
                            <Mail className="w-5 h-5 text-slate-400" />
                            <div>
                                <p className="text-xs text-textMuted font-medium">Email Address</p>
                                <p className="text-sm font-semibold text-text">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* EV Details Card */}
                <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="md:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute opacity-10 -bottom-10 -right-10 pointer-events-none">
                        <Car className="w-64 h-64 text-slate-100" />
                    </div>

                    <div className="flex items-center space-x-4 mb-6 relative z-10">
                        <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                            <Car className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">My Vehicle</h2>
                            <p className="text-blue-200/60 text-sm">Registered EV Specifications</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                        <div className="p-5 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors">
                            <p className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Vehicle Number</p>
                            <p className="text-xl font-mono font-bold text-white tracking-widest">{user?.vehicleNumber || 'Not Provided'}</p>
                        </div>
                        <div className="p-5 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors">
                            <p className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Vehicle Model</p>
                            <p className="text-xl font-mono font-bold text-white tracking-widest">{user?.vehicleModel || 'Not Provided'}</p>
                        </div>
                        
                        <div className="p-5 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors sm:col-span-2">
                            <p className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Charge Capability</p>
                            <div className="flex items-center space-x-2 mt-1">
                                <Zap className="w-5 h-5 text-amber-400" />
                                <span className="text-xl font-bold text-white">Ultra-Fast</span>
                            </div>
                        </div>

                        <div className="sm:col-span-2 p-5 bg-black/20 rounded-2xl border border-emerald-500/20 backdrop-blur-sm flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-emerald-500/20 rounded-xl">
                                    <BatteryCharging className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Ready to Connect</h3>
                                    <p className="text-sm text-slate-400">Your vehicle is authenticated on the network.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
                            >
                                Book Station
                            </button>
                        </div>
                    </div>

                </motion.div>

            </div>
        </div>
    );
};

export default UserProfile;
