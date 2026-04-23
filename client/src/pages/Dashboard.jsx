import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  Zap, Car, CheckCircle2, AlertCircle, MapPin, 
  Activity, Users, Clock, DollarSign, Battery, Navigation, Plus, RefreshCw, AlertTriangle, ChevronRight, TrendingUp, TrendingDown, Info, MessageSquare, X
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

const IntelligentKPICard = ({ title, value, icon: Icon, colorClass, subtitle, interpretation, trendIcon: TrendIcon, isNegative, delay, onClick, span = 1 }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        whileHover={{ y: -5, scale: 1.02 }}
        onClick={onClick}
        className={`bg-surface/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-700/60 transition-all flex flex-col justify-between group relative overflow-hidden shadow-lg col-span-${span} cursor-pointer hover:border-${colorClass.split('-')[1]}-500/50`}
    >
        <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${colorClass}`}></div>
        <div className="flex justify-between w-full items-start z-10 relative">
            <div>
                <p className="text-textMuted text-xs font-bold uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-black text-text mt-2 tracking-tight flex items-center">
                    {value}
                    {TrendIcon && <TrendIcon className={`w-4 h-4 ml-2 ${isNegative ? 'text-red-400' : 'text-emerald-400'}`} />}
                </h3>
                {subtitle && <p className="text-[10px] text-textMuted mt-1 font-bold">{subtitle}</p>}
                
                {interpretation && (
                    <div className="mt-3 bg-slate-800/80 rounded p-1.5 flex items-start border border-slate-700/50">
                        <Info className={`w-3 h-3 mr-1 mt-0.5 ${isNegative ? 'text-amber-400' : 'text-emerald-400'}`}/>
                        <p className={`text-[9px] font-bold ${isNegative ? 'text-amber-400/90' : 'text-emerald-400/90'} leading-tight`}>{interpretation}</p>
                    </div>
                )}
            </div>
            <div className={`p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 shadow-inner ${colorClass.replace('bg-', 'text-')} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500">
            <ChevronRight className="w-4 h-4" />
        </div>
    </motion.div>
);

const DashboardSkeleton = () => (
    <div className="space-y-6">
        <div className="h-10 w-64 bg-slate-800/50 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-40 bg-surface animate-pulse rounded-2xl border border-slate-800"></div>
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
    const [isCapacityModalOpen, setIsCapacityModalOpen] = useState(false);
    const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);

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

    const { kpi, alerts, queueStats, usersStats, revenue, trends, mapStations, activityFeed, recommendations, fleetList } = data;

    return (
        <div className="space-y-6 font-mono selection:bg-primary selection:text-white pb-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-end border-b border-slate-800 pb-4">
                <div>
                    <h1 className="text-2xl font-black text-text uppercase tracking-tighter flex items-center">
                        <Activity className="w-6 h-6 mr-3 text-emerald-400" />
                        Command Center
                    </h1>
                    <p className="text-slate-500 text-xs font-bold uppercase mt-1 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
                        Live Administrative Fleet & Infrastructure Control
                    </p>
                </div>
            </motion.div>

            {/* TOP ROW: Intelligent KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <IntelligentKPICard 
                    delay={0.1} title="Fleet EVs" value={kpi.totalVehicles} 
                    subtitle="Registered Fleet Vehicles" 
                    icon={Car} colorClass="bg-blue-500" 
                    onClick={() => setIsFleetModalOpen(true)}
                    interpretation="Healthy fleet"
                    isNegative={false}
                />
                <IntelligentKPICard 
                    delay={0.2} title="Infrastructure Nodes" value={`${kpi.totalStations} Hubs`} 
                    subtitle={`${kpi.activeStations} Active | ${kpi.fullStations} Full`} 
                    icon={MapPin} colorClass="bg-purple-500" 
                    onClick={() => navigate('/dashboard/stations')}
                    interpretation={kpi.fullStations > 0 ? "⚠️ Saturation detected" : "Adequate capacity"}
                    isNegative={kpi.fullStations > 0}
                />
                <IntelligentKPICard 
                    delay={0.3} title="Active Sessions" value={kpi.activeSessions} 
                    subtitle={`${kpi.todayBookingsCount} Total Bookings Today`} 
                    icon={CheckCircle2} colorClass="bg-emerald-500" 
                    onClick={() => navigate('/dashboard/stations')}
                    interpretation={kpi.activeSessions === 0 ? "⚠️ No active demand" : "Demand steady"}
                    isNegative={kpi.activeSessions === 0}
                />
                <IntelligentKPICard 
                    delay={0.4} title="Global Port Availability" value={`${kpi.availablePorts} Ports`} 
                    subtitle={`${kpi.totalCapacity} Total Managed Capacity`} 
                    icon={Zap} colorClass="bg-amber-500" 
                    onClick={() => setIsCapacityModalOpen(true)}
                    interpretation={kpi.utilizationPercent > 85 ? "⚠️ Critical network load" : (kpi.utilizationPercent < 10 ? "⚠️ Infrastructure underused" : "Healthy load")}
                    isNegative={kpi.utilizationPercent > 85 || kpi.utilizationPercent < 10}
                />
            </div>

            {/* SECONDARY ROW: Analytics, Trends, and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Insights & Recommendations Panel */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-1 bg-surface border border-slate-700 p-5 rounded-2xl shadow-xl flex flex-col gap-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400"></div>
                    
                    {/* Utilization */}
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Network Utilization</p>
                        <h2 className="text-3xl font-black text-white">{kpi.utilizationPercent}%</h2>
                        <div className="w-full bg-slate-800 h-2 mt-2 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${kpi.utilizationPercent > 85 ? 'bg-red-500' : kpi.utilizationPercent > 60 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${kpi.utilizationPercent}%`}}></div>
                        </div>
                        <p className={`text-[10px] mt-2 font-bold ${kpi.utilizationPercent > 85 ? 'text-red-400' : kpi.utilizationPercent > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {kpi.utilizationPercent > 85 ? "⚠️ Near saturation - action required" : kpi.utilizationPercent > 60 ? "Moderate demand" : "Healthy Load"}
                        </p>
                    </div>
                    
                    {/* Recommendations */}
                    <div className="flex-1 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center">
                            <Activity className="w-3 h-3 mr-1 text-blue-400" /> AI Recommendations
                        </h3>
                        <ul className="space-y-2">
                            {recommendations && recommendations.map((rec, i) => (
                                <li key={i} className="text-[10px] text-slate-300 flex items-start">
                                    <span className="text-emerald-400 mr-2 mt-0.5">👉</span> <span className="leading-tight">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Center Panel: Trends & Activity Feed */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2 flex flex-col gap-4">
                    {/* Trends */}
                    <div className="bg-surface p-5 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-between" style={{ height: '220px' }}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center">
                                <TrendingUp className="w-4 h-4 mr-2 text-emerald-400" />
                                7-Day Demand Pressure
                            </h3>
                            <div className="text-right">
                                <p className="text-[9px] text-slate-500 font-bold uppercase">Peak Day</p>
                                <p className="text-xs font-black text-amber-400">{trends?.peakDay || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="h-32 mb-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trends?.bookingTrendsDaily || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                    {/* <RechartsTooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} /> */}
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
                                        {trends?.bookingTrendsDaily?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.bookings > 30 ? '#ef4444' : entry.bookings > 20 ? '#fbbf24' : '#10b981'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg flex items-center justify-center">
                            <p className="text-[10px] font-bold text-emerald-400 flex items-center"><Info className="w-3 h-3 mr-1"/> Insight: {trends?.prediction || 'N/A'}</p>
                        </div>
                    </div>
                    
                    {/* Activity Feed */}
                    <div className="bg-surface p-4 rounded-2xl border border-slate-700 shadow-xl overflow-y-auto" style={{ height: '160px' }}>
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center sticky top-0 bg-surface pb-1 z-10">
                            <MessageSquare className="w-4 h-4 mr-2 text-blue-400" /> Live Activity Feed
                        </h3>
                        <div className="space-y-3">
                            {activityFeed && activityFeed.length > 0 ? activityFeed.map(act => (
                                <div key={act.id} className="flex items-start text-xs border-b border-slate-800 pb-2 last:border-0">
                                    <span className="text-[9px] text-slate-500 min-w-[50px] font-bold">{new Date(act.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    <span className="text-slate-300 ml-2 leading-tight">{act.message}</span>
                                </div>
                            )) : (
                                <p className="text-[10px] text-slate-500">No recent activity.</p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Alerts Panel */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-1 bg-surface border border-slate-700 rounded-2xl flex flex-col shadow-xl overflow-hidden" style={{ height: '396px' }}>
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <h3 className="text-xs font-bold text-rose-500 uppercase flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" /> Live Alert Engine
                        </h3>
                        <div className="flex items-center">
                            {alerts && alerts.some(a => a.severity === 'critical') && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping mr-2"></span>}
                            <span className="text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">{alerts ? alerts.length : 0}</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-surface to-slate-900/50">
                        {!alerts || alerts.length === 0 ? (
                            <p className="text-xs text-slate-500 text-center mt-8">System Nominal.</p>
                        ) : (
                            alerts.map(a => (
                                <div key={a.id} className={`p-3 text-[10px] rounded-xl border relative overflow-hidden ${
                                    a.severity === 'critical' ? 'bg-red-500/10 border-red-500/30 text-red-100' : 'bg-amber-500/10 border-amber-500/30 text-amber-100'
                                }`}>
                                    <div className={`absolute top-0 left-0 w-1 h-full ${a.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                                    <div className="flex justify-between items-start pl-2">
                                        <span className="font-bold flex-1 leading-snug text-xs">{a.message}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2 pl-2">
                                        <span className="text-[9px] opacity-60">{a.timestamp ? new Date(a.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                                        {a.action && (
                                            <button className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                                                a.severity === 'critical' ? 'bg-red-500/20 border-red-500/50 hover:bg-red-500/40 text-red-300' : 'bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/40 text-amber-300'
                                            } transition-colors`}>{a.action}</button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>

            {/* QUICK ACTIONS BAR */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-surface/80 backdrop-blur-md border border-slate-700 rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center space-x-3 text-slate-400 text-xs font-bold uppercase tracking-widest w-full lg:w-auto">
                    <Navigation className="w-5 h-5 text-emerald-500" />
                    <div>
                        <span className="text-white">Smart Actions Panel</span>
                        <div className="text-[9px] mt-0.5 opacity-80 text-emerald-400 flex items-center">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Active Users Today: {usersStats?.activeToday} | Avg Queue: {queueStats?.avgWaitTimeMin} min
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap space-x-3 w-full lg:w-auto justify-end gap-y-2">
                    <button onClick={() => navigate('/dashboard/stations')} className="px-5 py-2.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white rounded-xl text-[10px] font-bold uppercase transition flex items-center shadow-sm hover:shadow-blue-500/20">
                        <Plus className="w-4 h-4 mr-1.5" /> 
                        {recommendations && recommendations.some(r => r.includes("Add new station")) ? "Add Station (Recommended)" : "Add Hub"}
                    </button>
                    <button onClick={() => navigate('/dashboard/users')} className="px-5 py-2.5 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white rounded-xl text-[10px] font-bold uppercase transition flex items-center shadow-sm hover:shadow-emerald-500/20">
                        <Users className="w-4 h-4 mr-1.5" /> Register EV Fleet
                    </button>
                    <button onClick={fetchCommandCenterData} className="px-5 py-2.5 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white rounded-xl text-[10px] font-bold uppercase transition flex items-center">
                        <RefreshCw className="w-4 h-4 mr-1.5" /> Force Sync
                    </button>
                </div>
            </motion.div>

            {/* FULL-WIDTH MAP SECTION */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="w-full h-[500px] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative bg-black relative">
                <div className="absolute top-4 right-4 z-[400] text-[#D4FF00] bg-black/90 px-4 py-2 text-[10px] font-black uppercase border border-[#D4FF00] shadow-xl pointer-events-none tracking-widest backdrop-blur-md flex items-center">
                    <Activity className="w-3 h-3 inline mr-2 animate-pulse" /> Live Topology Active
                </div>
                <MapContainer center={[12.9716, 77.5946]} zoom={12} className="w-full h-full" zoomControl={false}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
                    {mapStations && mapStations.map((station) => (
                        <Marker key={station._id} position={[station.location.lat, station.location.lng]} icon={icons[station.crowdedness] || icons.Low}>
                            <Popup className="rounded-xl overflow-hidden min-w-[220px]">
                                <div className="font-mono pb-2 mb-2 font-black border-b border-gray-300 text-black flex justify-between items-center">
                                    <span className="truncate pr-2">{station.name}</span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded text-white ${station.crowdedness === 'High' ? 'bg-red-500' : station.crowdedness === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                                        {station.crowdedness}
                                    </span>
                                </div>
                                <div className="text-[10px] mb-1 text-slate-800 font-bold flex justify-between">
                                    <span>Capacity Used:</span> 
                                    <span className="text-black font-black">{station.activeBookingsCount} / {station.capacity}</span>
                                </div>
                                <div className="text-[10px] mb-2 text-slate-800 font-bold flex justify-between">
                                    <span>Utilization:</span>
                                    <span className="text-black font-black">{Math.round((station.activeBookingsCount/(station.capacity || 1))*100)}%</span>
                                </div>
                                
                                {station.nearestAvailable && station.availableSlots === 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-200 bg-emerald-50 p-2 rounded">
                                        <p className="text-[9px] font-bold text-emerald-800 uppercase mb-0.5 flex items-center">
                                            <Info className="w-3 h-3 mr-1" /> Smart Suggestion:
                                        </p>
                                        <p className="text-[10px] text-emerald-900 leading-tight">
                                            Nearest available: <br/>
                                            <span className="font-black text-xs">{station.nearestAvailable.name}</span> <br/>
                                            <span className="text-emerald-700">({station.nearestAvailable.slots} slots free)</span>
                                        </p>
                                    </div>
                                )}
                                
                                <div className="mt-3 pt-2 border-t border-gray-200 text-[9px] text-gray-500 uppercase flex justify-between items-center">
                                    <span>ID: {station.stationId}</span>
                                    <span className="font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{station.todayQueue} in queue today</span>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </motion.div>

            {/* Capacity Breakdown Modal */}
            <AnimatePresence>
                {isCapacityModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }}
                            className="bg-surface border border-slate-700 p-6 rounded-2xl w-full max-w-2xl relative shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-emerald-400"></div>
                            
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center">
                                    <Zap className="text-amber-400 w-5 h-5 mr-2" /> Global Capacity Breakdown
                                </h2>
                                <button onClick={() => setIsCapacityModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                                    <span className="text-xs text-slate-500 font-bold uppercase mb-1">Total Capacity</span>
                                    <span className="text-2xl font-black text-white">{kpi.totalCapacity}</span>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                                    <span className="text-xs text-slate-500 font-bold uppercase mb-1">Currently Used</span>
                                    <span className="text-2xl font-black text-blue-400">{kpi.usedCapacity}</span>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                                    <span className="text-xs text-slate-500 font-bold uppercase mb-1">Available Ports</span>
                                    <span className="text-2xl font-black text-emerald-400">{kpi.availablePorts}</span>
                                </div>
                            </div>

                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">Network Load by Station</h3>
                            
                            <div className="overflow-y-auto pr-2 space-y-4 custom-scrollbar flex-1">
                                {[...mapStations].sort((a,b) => ((b.activeBookingsCount/b.capacity) || 0) - ((a.activeBookingsCount/a.capacity) || 0)).map(station => {
                                    const utilization = station.capacity > 0 ? (station.activeBookingsCount / station.capacity) * 100 : 0;
                                    return (
                                        <div key={station._id} className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                                            <div className="flex justify-between items-end mb-2">
                                                <div>
                                                    <div className="text-sm font-bold text-white uppercase">{station.name}</div>
                                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">{station.stationId}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-bold text-slate-300"><span className={utilization > 85 ? 'text-red-400' : utilization > 60 ? 'text-amber-400' : 'text-emerald-400'}>{station.activeBookingsCount}</span> / {station.capacity} Ports</div>
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase">{Math.round(utilization)}% Utilized</div>
                                                </div>
                                            </div>
                                            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${utilization > 85 ? 'bg-red-500' : utilization > 60 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${Math.min(100, utilization)}%`}}></div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fleet EVs Modal */}
            <AnimatePresence>
                {isFleetModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }}
                            className="bg-surface border border-slate-700 p-6 rounded-2xl w-full max-w-2xl relative shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
                            
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center">
                                    <Car className="text-blue-400 w-5 h-5 mr-2" /> Fleet EVs Overview
                                </h2>
                                <button onClick={() => setIsFleetModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4 mb-6">
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                                    <span className="text-xs text-slate-500 font-bold uppercase mb-1">Total Fleet EVs</span>
                                    <span className="text-2xl font-black text-white">{kpi.totalVehicles}</span>
                                </div>
                            </div>

                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">Active Fleet Status</h3>
                            
                            <div className="overflow-y-auto pr-2 space-y-4 custom-scrollbar flex-1">
                                {fleetList && [...fleetList].map(ev => (
                                    <div key={ev.id} className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50 flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 rounded-lg border bg-blue-500/10 border-blue-500/30 text-blue-400">
                                                <Car className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white uppercase flex items-center">
                                                    {ev.vehicleModel} 
                                                    <span className="ml-2 text-[10px] bg-slate-700 border border-slate-600 text-slate-300 px-1.5 py-0.5 rounded tracking-widest">{ev.vehicleNumber}</span>
                                                </div>
                                                <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">Assigned to: {ev.name}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
