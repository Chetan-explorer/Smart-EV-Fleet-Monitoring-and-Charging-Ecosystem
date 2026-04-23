import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { 
  Zap, Car, CheckCircle2, AlertCircle, MapPin, 
  Activity, Users, Clock, DollarSign, Battery, Navigation, Plus, RefreshCw, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { AuthContext } from '../context/AuthContext';
import UserStations from '../components/UserStations';

// -- MAP MARKER CONFIG -- 
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createSvgIcon = (color) => new L.DivIcon({
    className: 'custom-brutal-marker',
    html: `<svg width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="#000" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#000"></circle></svg>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const icons = {
    Low: createSvgIcon('#D4FF00'),
    Moderate: createSvgIcon('#fbbf24'),
    High: createSvgIcon('#ef4444')
};

// -- UI COMPONENTS --

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle, delay, span = 1 }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        whileHover={{ y: -5, scale: 1.02 }}
        className={`bg-surface/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-700/60 transition-all flex flex-col justify-between group relative overflow-hidden shadow-lg col-span-${span}`}
    >
        <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${colorClass}`}></div>
        <div className="flex justify-between w-full items-start z-10 relative">
            <div>
                <p className="text-textMuted text-xs font-bold uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-black text-text mt-2 tracking-tight">{value}</h3>
                {subtitle && <p className="text-xs text-textMuted mt-1 font-bold">{subtitle}</p>}
            </div>
            <div className={`p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 shadow-inner ${colorClass.replace('bg-', 'text-')}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    </motion.div>
);

const DashboardSkeleton = () => (
    <div className="space-y-6">
        <div className="h-10 w-64 bg-slate-800/50 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-surface animate-pulse rounded-2xl border border-slate-800"></div>
            ))}
        </div>
        <div className="h-[400px] bg-surface animate-pulse rounded-2xl border border-slate-800"></div>
    </div>
);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Command Center payload
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCommandCenterData = async () => {
        try {
            const res = await axios.get('/api/analytics/command-center');
            setData(res.data);
        } catch (error) {
            console.error('Error fetching command center data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'User') {
            setLoading(false);
            return;
        }
        fetchCommandCenterData();
        const loop = setInterval(fetchCommandCenterData, 10000);
        return () => clearInterval(loop);
    }, [user]);

    if (loading) return <DashboardSkeleton />;

    if (user?.role === 'User') {
        return <UserStations />;
    }

    if (!data) return <div className="text-red-500 font-bold p-8 text-center bg-red-500/10 rounded-2xl border border-red-500/30">Failed to load Command Analytics</div>;

    const { kpi, alerts, queueStats, usersStats, revenue, trends, mapStations } = data;

    return (
        <div className="space-y-6 font-mono selection:bg-primary selection:text-white">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-end border-b border-slate-800 pb-4">
                <div>
                    <h1 className="text-2xl font-black text-text uppercase tracking-tighter flex items-center">
                        <Activity className="w-6 h-6 mr-3 text-emerald-400" />
                        Command Center
                    </h1>
                    <p className="text-slate-500 text-xs font-bold uppercase mt-1">Live Administrative Fleet & Infrastructure Control</p>
                </div>
            </motion.div>

            {/* TOP ROW: Essential KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard delay={0.1} title="Fleet EVs" value={kpi.totalVehicles} subtitle={`${kpi.lowBatteryVehicles} Critical Battery`} icon={Car} colorClass="bg-blue-500" />
                <StatCard delay={0.2} title="Infrastructure Nodes" value={`${kpi.totalStations} Hubs`} subtitle={`${kpi.activeStations} Active | ${kpi.fullStations} Full`} icon={MapPin} colorClass="bg-purple-500" />
                <StatCard delay={0.3} title="Active Sessions" value={kpi.activeSessions} subtitle={`${kpi.todayBookingsCount} Total Bookings Today`} icon={CheckCircle2} colorClass="bg-emerald-500" />
                <StatCard delay={0.4} title="Global Port Availability" value={`${kpi.availablePorts} Ports`} subtitle={`${kpi.totalCapacity} Total Managed Capacity`} icon={Zap} colorClass="bg-amber-500" />
            </div>

            {/* SECONDARY ROW: Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Insights Panel */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-1 bg-surface border border-slate-700 p-5 rounded-2xl shadow-xl flex flex-col justify-center space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400"></div>
                    
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Network Utilization</p>
                        <h2 className="text-3xl font-black text-white">{kpi.utilizationPercent}%</h2>
                        <div className="w-full bg-slate-800 h-2 mt-2 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${kpi.utilizationPercent}%`}}></div>
                        </div>
                    </div>
                    
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1 flex items-center"><Clock className="w-3 h-3 mr-1"/> Avg Global Queue</p>
                        <h2 className="text-2xl font-black text-white flex items-end">
                            {queueStats.avgWaitTimeMin} <span className="text-sm font-bold text-slate-500 ml-1 mb-1">min</span>
                        </h2>
                    </div>

                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1 flex items-center"><DollarSign className="w-3 h-3 mr-1 text-emerald-400"/> Revenue Index (Live)</p>
                        <h2 className="text-2xl font-black text-emerald-400 flex items-end">
                            ${revenue.today} <span className="text-sm font-bold text-emerald-900 ml-1 mb-1 bg-emerald-400/20 px-2 rounded">/Day</span>
                        </h2>
                    </div>
                </motion.div>

                {/* Booking Trends Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2 bg-surface p-5 rounded-2xl border border-slate-700 shadow-xl">
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        7-Day Demand Pressure
                    </h3>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trends.bookingTrendsDaily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip 
                                    cursor={{ fill: '#1e293b' }}
                                    contentStyle={{ 
                                        backgroundColor: '#0f172a', 
                                        borderColor: '#334155', 
                                        borderRadius: '8px'
                                    }}
labelStyle={{ color: '#ffffff' }}
itemStyle={{ color: '#ffffff' }}
/>
                                <Bar dataKey="bookings" radius={[4, 4, 0, 0]}>
                                    {trends.bookingTrendsDaily.map((entry, index) => (
                                        <cell key={`cell-${index}`} fill={entry.bookings > 30 ? '#ef4444' : entry.bookings > 20 ? '#fbbf24' : '#10b981'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Alerts Panel */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-1 bg-surface border border-slate-700 rounded-2xl flex flex-col shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <h3 className="text-xs font-bold text-rose-500 uppercase flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" /> Alerts
                        </h3>
                        <span className="text-xs font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">{alerts.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-56 p-4 space-y-3">
                        {alerts.length === 0 ? (
                            <p className="text-xs text-slate-500 text-center mt-8">System Nominal.</p>
                        ) : (
                            alerts.map(a => (
                                <div key={a.id} className={`p-3 text-xs font-bold rounded-lg border ${
                                    a.type === 'danger' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                                }`}>
                                    {a.message}
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>

            {/* QUICK ACTIONS BAR */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-surface/50 border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center space-x-3 text-slate-400 text-xs font-bold uppercase tracking-widest w-full lg:w-auto">
                    <Navigation className="w-5 h-5 text-emerald-500" />
                    <div>
                        <span className="text-white">Command Actions</span>
                        <div className="text-[9px] mt-0.5 opacity-60">Total Registered EVs: {usersStats.newRegistrations} New Today | Queue Stress: {queueStats.longestQueueStation}</div>
                    </div>
                </div>
                <div className="flex space-x-3 w-full lg:w-auto justify-end">
                    <button onClick={() => navigate('/dashboard/stations')} className="px-5 py-2.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold uppercase transition flex items-center shadow-sm hover:shadow-blue-500/20">
                        <Plus className="w-4 h-4 mr-1.5" /> Add Hub
                    </button>
                    <button onClick={() => navigate('/dashboard/users')} className="px-5 py-2.5 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white rounded-xl text-xs font-bold uppercase transition flex items-center shadow-sm hover:shadow-emerald-500/20">
                        <Users className="w-4 h-4 mr-1.5" /> Register EV Fleet
                    </button>
                    <button onClick={fetchCommandCenterData} className="px-5 py-2.5 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white rounded-xl text-xs font-bold uppercase transition flex items-center">
                        <RefreshCw className="w-4 h-4 mr-1.5" /> Global Sync
                    </button>
                </div>
            </motion.div>

            {/* FULL-WIDTH MAP SECTION */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="w-full h-[500px] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative bg-black relative">
                <div className="absolute top-4 right-4 z-[400] text-[#D4FF00] bg-black/90 px-4 py-2 text-xs font-black uppercase border border-[#D4FF00] shadow-xl pointer-events-none tracking-widest backdrop-blur-md">
                    <Activity className="w-3 h-3 inline mr-2 -mt-0.5 animate-pulse" /> Live Topology Active
                </div>
                <MapContainer center={[12.9716, 77.5946]} zoom={12} className="w-full h-full" zoomControl={false}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
                    {mapStations.map((station) => (
                        <Marker key={station._id} position={[station.location.lat, station.location.lng]} icon={icons[station.crowdedness] || icons.Low}>
                            <Popup className="rounded-xl overflow-hidden min-w-[200px]">
                                <div className="font-mono pb-2 mb-2 font-black border-b border-gray-300 text-black">{station.name}</div>
                                <div className="text-xs mb-1 text-slate-800 font-bold">Capacity Used: <span className="text-red-500">{station.activeBookingsCount}</span> / {station.capacity}</div>
                                <div className="text-xs mb-1 text-slate-800 font-bold">Utilization: {Math.round((station.activeBookingsCount/(station.capacity || 1))*100)}%</div>
                                <div className="mt-2 text-[10px] text-gray-500 uppercase">{station.stationId}</div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </motion.div>
        </div>
    );
};

export default Dashboard;
