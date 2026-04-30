import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell, LineChart, Line, PieChart, Pie, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Zap, Car, CheckCircle2, AlertCircle, MapPin, 
  Activity, Users, Clock, DollarSign, Battery, Navigation, Plus, RefreshCw, AlertTriangle, ChevronRight, TrendingUp, TrendingDown, Info, MessageSquare, X,
  Menu, Search, Bell, MonitorPlay, Calendar, Database, XCircle
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
    html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="#000" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#000"></circle></svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
});

const icons = {
    Low: createSvgIcon('#10b981'),      // Green
    Moderate: createSvgIcon('#f59e0b'), // Amber
    High: createSvgIcon('#ef4444')      // Red
};

// -- UI COMPONENTS --

const CompactKPICard = ({ title, value, valueColor, trend, trendDir, subtext, icon: Icon, bgIconColor }) => (
    <div className="bg-[#111827] border border-slate-800 p-3 rounded-lg flex flex-col justify-between relative overflow-hidden h-24 shadow-md group hover:border-slate-700 transition-colors">
        <div className="flex justify-between items-start z-10">
            <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-full ${bgIconColor} bg-opacity-20 flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${bgIconColor.replace('bg-', 'text-')}`} />
                </div>
                <h3 className="text-xs font-semibold text-slate-300">{title}</h3>
            </div>
        </div>
        <div className="mt-2 z-10">
            <div className="flex items-end justify-between">
                <span className={`text-2xl font-bold ${valueColor}`}>{value}</span>
                {trend && (
                    <span className={`text-[10px] font-bold flex items-center ${trendDir === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trendDir === 'up' ? '↑' : '↓'} {trend}
                    </span>
                )}
            </div>
            <p className={`text-[10px] ${trendDir === 'up' ? 'text-emerald-500/80' : trendDir === 'down' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 truncate`}>{subtext}</p>
        </div>
    </div>
);

const DashboardSkeleton = () => (
    <div className="space-y-4 bg-[#0a0f18] min-h-screen p-4">
        <div className="h-12 w-full bg-slate-800/50 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-[#111827] animate-pulse rounded-lg"></div>)}
        </div>
        <div className="h-[600px] w-full bg-[#111827] animate-pulse rounded-lg"></div>
    </div>
);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
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

    if (!data) return <div className="text-red-500 font-bold p-8 text-center bg-red-500/10 rounded-lg">Failed to load Command Analytics</div>;

    const { kpi, alerts, activityFeed, recommendations, queueStats, usersStats, revenue, trends, mapStations, fleetList, bookingsStatus, capacityUtilizationByStation, heatmapData } = data;

    // Formatting Helpers
    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="bg-[#0a0f18] min-h-screen text-slate-300 font-sans p-4 xl:p-6 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <Menu className="w-5 h-5 text-slate-400 cursor-pointer hover:text-white transition" />
                    <h1 className="text-xl font-bold text-white flex items-center">
                        Command Center <span className="w-2 h-2 rounded-full bg-emerald-500 ml-3 mr-1.5 animate-pulse"></span>
                        <span className="text-[10px] text-emerald-500 uppercase tracking-wider font-semibold">Live</span>
                    </h1>
                </div>
                <div className="flex items-center space-x-6">
                    <Search className="w-5 h-5 text-slate-400 cursor-pointer hover:text-white" />
                    <div className="relative">
                        <Bell className="w-5 h-5 text-slate-400 cursor-pointer hover:text-white" />
                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#0a0f18]">12</span>
                    </div>
                </div>
                {/* </div> */}
            </div>

            <div className="flex flex-col space-y-4">
                
                {/* ROW 1: KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                    <CompactKPICard 
                        title="Active Sessions" value={kpi.activeSessions} valueColor="text-white"
                        trend="25% vs yesterday" trendDir="up" subtext="Demand increasing"
                        icon={MonitorPlay} bgIconColor="bg-emerald-500"
                    />
                    <CompactKPICard 
                        title="Total Bookings Today" value={kpi.todayBookingsCount} valueColor="text-white"
                        trend="18% vs yesterday" trendDir="up" subtext={`Peak: 7PM - 9PM`}
                        icon={Calendar} bgIconColor="bg-blue-500"
                    />
                    <CompactKPICard 
                        title="Global Capacity" value={`${kpi.totalCapacity} Ports`} valueColor="text-white"
                        trend={null} subtext={`${kpi.usedCapacity} in use • ${kpi.availablePorts} available\nUtilization: ${kpi.utilizationPercent}%`}
                        icon={Database} bgIconColor="bg-purple-500"
                    />
                    <CompactKPICard 
                        title="Avg. Wait Time" value={`${kpi.avgWaitTimeMin} min`} valueColor="text-white"
                        trend="6 min vs yesterday" trendDir="up" subtext="High at Whitefield"
                        icon={Clock} bgIconColor="bg-amber-500"
                    />
                    <CompactKPICard 
                        title="Total Revenue (Today)" value={formatCurrency(kpi.revenueToday)} valueColor="text-white"
                        trend="22% vs yesterday" trendDir="up" subtext="Bookings Revenue"
                        icon={DollarSign} bgIconColor="bg-teal-500"
                    />
                    <CompactKPICard 
                        title="Cancelled Bookings" value={kpi.cancelledBookings} valueColor="text-white"
                        trend="11% vs yesterday" trendDir="down" subtext="Cancellation rate: 9.3%"
                        icon={XCircle} bgIconColor="bg-red-500"
                    />
                </div>

                {/* ROW 2: Alerts, Feed, Trends, Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-[280px]">
                    {/* Critical Alerts */}
                    <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col h-full overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-semibold text-slate-300 flex items-center">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-400 mr-2" /> Critical Alerts
                            </h3>
                            <span className="text-[10px] text-blue-400 cursor-pointer hover:underline">View All</span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                            {alerts && alerts.map((a, i) => (
                                <div key={i} className="flex items-start bg-slate-800/30 p-2.5 rounded border border-slate-700/50">
                                    <div className={`mt-0.5 mr-3 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${a.severity === 'critical' ? 'bg-red-500/20 text-red-500' : a.severity === 'warning' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className={`text-[11px] font-bold truncate pr-2 ${a.severity === 'critical' ? 'text-red-400' : a.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'}`}>{a.message.split(' - ')[0]}</p>
                                            <span className="text-[9px] text-slate-500 flex-shrink-0">{Math.floor(Math.random() * 20 + 2)} min ago</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{a.message.split(' - ')[1] || a.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Live Activity Feed */}
                    <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col h-full overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-semibold text-slate-300 flex items-center">
                                <MessageSquare className="w-3.5 h-3.5 mr-2 text-slate-400" /> Live Activity Feed
                            </h3>
                            <span className="text-[10px] text-blue-400 cursor-pointer hover:underline">View All</span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                            {activityFeed && activityFeed.map((act, i) => (
                                <div key={i} className="flex items-start">
                                    <div className={`mt-0.5 mr-3 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${act.type === 'booking' ? 'bg-teal-500/20 text-teal-400' : act.type === 'cancelled' ? 'bg-red-500/20 text-red-400' : act.type === 'system' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                        {act.type === 'system' ? <MapPin className="w-3.5 h-3.5"/> : <Users className="w-3.5 h-3.5"/>}
                                    </div>
                                    <div className="flex-1 min-w-0 border-b border-slate-800/60 pb-3">
                                        <div className="flex justify-between items-start">
                                            <p className="text-[11px] font-medium text-slate-200 truncate pr-2">{act.message}</p>
                                            <span className="text-[9px] text-slate-500 flex-shrink-0">{Math.floor(Math.random() * 30 + 2)} min ago</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{act.subtext}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Booking Trends */}
                    <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs font-semibold text-slate-300">Booking Trends (7 Days)</h3>
                            <span className="text-[10px] text-slate-400 border border-slate-700 rounded px-2 py-0.5 flex items-center cursor-pointer">Daily <ChevronRight className="w-3 h-3 ml-1"/></span>
                        </div>
                        <div className="flex-1 w-full min-h-0 relative -ml-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trends?.bookingTrendsDaily || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="day" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '4px', fontSize: '10px' }}
                                        itemStyle={{ color: '#60a5fa' }} labelStyle={{ color: '#cbd5e1' }}
                                    />
                                    <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 flex justify-between text-[9px] text-slate-500">
                            <span>Peak: {trends?.peakDay}</span>
                            <span>Trend: Increasing <span className="text-emerald-400">↑</span> | {trends?.prediction}</span>
                        </div>
                    </div>

                    {/* Bookings Status Pie */}
                    <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col h-full">
                        <h3 className="text-xs font-semibold text-slate-300 mb-2">Bookings Status</h3>
                        <div className="flex-1 flex items-center justify-between min-h-0">
                            <div className="w-1/2 h-full flex justify-center items-center relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={bookingsStatus} innerRadius="60%" outerRadius="80%" paddingAngle={2} dataKey="value" stroke="none"
                                        >
                                            {bookingsStatus?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px' }} itemStyle={{ color: '#cbd5e1' }} labelStyle={{ color: '#cbd5e1' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-xs font-bold text-white">Total: {kpi.todayBookingsCount}</span>
                                </div>
                            </div>
                            <div className="w-1/2 flex flex-col space-y-2 justify-center pl-2">
                                {bookingsStatus?.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-[10px]">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 rounded-sm mr-2" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-slate-300">{item.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-slate-200 font-medium">{item.value}</span>
                                            <span className="text-slate-500">({item.percent}%)</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROW 3: Map, Bar Chart, Heatmap */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[320px]">
                    {/* Map */}
                    <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col h-full relative overflow-hidden">
                        <div className="flex justify-between items-center mb-3 z-10 relative">
                            <h3 className="text-xs font-semibold text-slate-300">Station Overview Map</h3>
                            <div className="flex space-x-3 text-[9px] text-slate-400">
                                <span className="flex items-center"><span className="w-2 h-2 bg-[#10b981] rounded-sm mr-1.5"></span> Available</span>
                                <span className="flex items-center"><span className="w-2 h-2 bg-[#f59e0b] rounded-sm mr-1.5"></span> Moderate</span>
                                <span className="flex items-center"><span className="w-2 h-2 bg-[#ef4444] rounded-sm mr-1.5"></span> High Load</span>
                            </div>
                        </div>
                        <div className="flex-1 w-full rounded-md overflow-hidden relative z-0 border border-slate-700/50">
                            <MapContainer center={[12.9716, 77.5946]} zoom={11} className="w-full h-full" zoomControl={false} attributionControl={false}>
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                {mapStations && mapStations.map((station) => (
                                    <Marker key={station._id} position={[station.location.lat, station.location.lng]} icon={icons[station.crowdedness] || icons.Low}>
                                        <Popup className="custom-popup">
                                            <div className="bg-[#1e293b] text-slate-200 p-2 rounded-lg shadow-xl border border-slate-600 text-[10px] min-w-[150px]">
                                                <div className="font-bold text-white mb-1 flex justify-between">
                                                    {station.name}
                                                    <span className={`${station.status === 'FULL' ? 'text-red-400' : 'text-amber-400'}`}>{station.status}</span>
                                                </div>
                                                <div className="flex justify-between text-slate-400"><span>Capacity</span><span className="text-white">{station.capacity} Ports</span></div>
                                                <div className="flex justify-between text-slate-400"><span>In Use</span><span className="text-white">{station.activeBookingsCount} Ports</span></div>
                                                <div className="flex justify-between text-slate-400"><span>Available</span><span className="text-white">{station.availableSlots} Ports</span></div>
                                                <div className="flex justify-between text-slate-400"><span>Queue</span><span className="text-white">{station.todayQueue} Vehicles</span></div>
                                                <div className="flex justify-between text-slate-400 mb-2"><span>Avg. Wait Time</span><span className="text-white">{station.avgWaitTime} min</span></div>
                                                {station.nearestAvailable && station.availableSlots === 0 && (
                                                    <div className="text-[9px] text-emerald-400 mt-1 border-t border-slate-700 pt-1">
                                                        Suggestion: Try {station.nearestAvailable.name} ({station.nearestAvailable.slots} ports available)
                                                    </div>
                                                )}
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                            {/* Custom Zoom Controls overlay */}
                            <div className="absolute bottom-2 right-2 flex flex-col space-y-1 z-[400]">
                                <button className="w-6 h-6 bg-slate-800/80 text-white rounded flex items-center justify-center hover:bg-slate-700 border border-slate-600">+</button>
                                <button className="w-6 h-6 bg-slate-800/80 text-white rounded flex items-center justify-center hover:bg-slate-700 border border-slate-600">-</button>
                            </div>
                        </div>
                    </div>

                    {/* Capacity Utilization Bar */}
                    <div className="lg:col-span-1 bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-semibold text-slate-300">Capacity Utilization by Station</h3>
                            <span className="text-[10px] text-blue-400 cursor-pointer hover:underline">View All</span>
                        </div>
                        <div className="flex justify-center space-x-6 text-[10px] text-slate-400 mb-2">
                            <span className="flex items-center"><span className="w-2 h-2 bg-[#10b981] mr-1.5"></span> In Use</span>
                            <span className="flex items-center"><span className="w-2 h-2 bg-[#3b82f6] mr-1.5"></span> Available</span>
                        </div>
                        <div className="flex-1 w-full min-h-0 -ml-4 mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={capacityUtilizationByStation || []} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                                    <RechartsTooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px' }} itemStyle={{ color: '#cbd5e1' }} labelStyle={{ color: '#cbd5e1' }} />
                                    <Bar dataKey="inUse" fill="#10b981" radius={[2, 2, 0, 0]} barSize={12} />
                                    <Bar dataKey="available" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Peak Hour Heatmap */}
                    <div className="lg:col-span-1 bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col h-full">
                        <h3 className="text-xs font-semibold text-slate-300 mb-4">Peak Hour Heatmap</h3>
                        <div className="flex-1 w-full relative -ml-4 min-h-0">
                             <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                                    <XAxis type="category" dataKey="day" name="Day" stroke="#cbd5e1" fontSize={9} tickLine={false} axisLine={false} />
                                    <YAxis type="category" dataKey="hour" name="Hour" stroke="#cbd5e1" fontSize={9} tickLine={false} axisLine={false} reversed />
                                    <ZAxis type="number" dataKey="value" range={[10, 200]} />
                                    <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px', color: '#cbd5e1' }} itemStyle={{ color: '#cbd5e1' }} labelStyle={{ color: '#cbd5e1' }} />
                                    <Scatter data={heatmapData || []} shape={(props) => {
                                        const { cx, cy, width, payload } = props;
                                        const val = payload.value;
                                        // Color logic: low -> blue/green, med -> yellow/orange, high -> red
                                        let fill = '#1e293b'; // default low
                                        if (val > 40) fill = '#ef4444';
                                        else if (val > 25) fill = '#f59e0b';
                                        else if (val > 10) fill = '#3b82f6';
                                        
                                        return <rect x={cx - 10} y={cy - 10} width={20} height={14} fill={fill} rx={2} ry={2} />;
                                    }} />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-between items-center mt-3 text-[9px] text-slate-500 px-2">
                            <span>Low</span>
                            <div className="flex-1 h-1.5 mx-3 rounded bg-gradient-to-r from-[#1e293b] via-[#3b82f6] to-[#ef4444]"></div>
                            <span>High</span>
                        </div>
                    </div>
                </div>

                {/* ROW 4: Table, AI, Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Station Performance Table */}
                    <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col h-[280px]">
                        <h3 className="text-xs font-semibold text-slate-300 mb-4">Station Performance</h3>
                        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead className="sticky top-0 bg-[#111827] z-10 border-b border-slate-800">
                                    <tr className="text-[10px] text-slate-500 uppercase">
                                        <th className="py-2 font-medium">Station Name</th>
                                        <th className="py-2 font-medium text-center">Capacity</th>
                                        <th className="py-2 font-medium text-center">In Use</th>
                                        <th className="py-2 font-medium text-center">Available</th>
                                        <th className="py-2 font-medium text-center">Utilization</th>
                                        <th className="py-2 font-medium text-center">Active Bookings</th>
                                        <th className="py-2 font-medium text-center">Queue</th>
                                        <th className="py-2 font-medium text-center">Avg. Wait Time</th>
                                        <th className="py-2 font-medium text-center">Status</th>
                                        <th className="py-2 font-medium text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[11px] text-slate-300 divide-y divide-slate-800/50">
                                    {mapStations && mapStations.map((station, i) => (
                                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="py-2.5 font-medium">{station.name}</td>
                                            <td className="py-2.5 text-center">{station.capacity}</td>
                                            <td className="py-2.5 text-center">{station.activeBookingsCount}</td>
                                            <td className="py-2.5 text-center">{station.availableSlots}</td>
                                            <td className={`py-2.5 text-center font-bold ${station.utilization >= 80 ? 'text-red-400' : station.utilization >= 50 ? 'text-amber-400' : 'text-emerald-400'}`}>{station.utilization}%</td>
                                            <td className="py-2.5 text-center">{station.activeBookingsCount}</td>
                                            <td className="py-2.5 text-center">{station.todayQueue}</td>
                                            <td className="py-2.5 text-center">{station.avgWaitTime} min</td>
                                            <td className="py-2.5 text-center">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase border ${
                                                    station.status === 'FULL' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                                    station.status === 'HIGH LOAD' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                    station.status === 'MODERATE' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                }`}>
                                                    {station.status}
                                                </span>
                                            </td>
                                            <td className="py-2.5 text-center text-blue-400 hover:text-blue-300 cursor-pointer">
                                                <Info className="w-3.5 h-3.5 mx-auto" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* AI Recommendations */}
                    <div className="lg:col-span-1 bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col h-[280px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-semibold text-slate-300 flex items-center">
                                <Zap className="w-3.5 h-3.5 mr-2 text-rose-500" /> AI Recommendations
                            </h3>
                            <span className="text-[10px] text-blue-400 cursor-pointer hover:underline">View All</span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                            {recommendations && recommendations.map((rec, i) => (
                                <div key={i} className="flex items-start">
                                    <div className={`mt-0.5 mr-3 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${rec.type === 'add' ? 'bg-emerald-500/20 text-emerald-400' : rec.type === 'increase' ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                        {rec.type === 'add' ? <Plus className="w-3.5 h-3.5"/> : rec.type === 'increase' ? <TrendingUp className="w-3.5 h-3.5"/> : <Activity className="w-3.5 h-3.5"/>}
                                    </div>
                                    <div className="flex-1 min-w-0 border-b border-slate-800/60 pb-3">
                                        <p className="text-[11px] font-medium text-slate-200 mb-0.5">{rec.text}</p>
                                        <p className="text-[10px] text-slate-500 leading-tight">{rec.subtext}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="lg:col-span-1 bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col h-[280px]">
                        <h3 className="text-xs font-semibold text-slate-300 mb-4">Quick Actions</h3>
                        <div className="flex flex-col space-y-3 flex-1">
                            <button onClick={() => navigate('/dashboard/stations')} className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-2.5 rounded-md text-[11px] font-medium flex items-center justify-center transition-colors">
                                <Plus className="w-3.5 h-3.5 mr-2" /> Add New Station
                            </button>
                            <button onClick={() => navigate('/dashboard/stations')} className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2.5 rounded-md text-[11px] font-medium flex items-center justify-center transition-colors">
                                <Plus className="w-3.5 h-3.5 mr-2" /> Add Slot Capacity
                            </button>
                            <button onClick={() => navigate('/dashboard/stations')} className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2.5 rounded-md text-[11px] font-medium flex items-center justify-center transition-colors">
                                <Zap className="w-3.5 h-3.5 mr-2" /> Override Station Status
                            </button>
                            <button onClick={fetchCommandCenterData} className="w-full bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-white py-2.5 rounded-md text-[11px] font-medium flex items-center justify-center transition-colors mt-auto">
                                <RefreshCw className="w-3.5 h-3.5 mr-2" /> Force Data Sync
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            
            {/* Styles for map popup to override leaflet defaults to match dark theme */}
            <style jsx global>{`
                .custom-popup .leaflet-popup-content-wrapper {
                    background: transparent;
                    box-shadow: none;
                    padding: 0;
                }
                .custom-popup .leaflet-popup-tip {
                    background: #1e293b;
                    border-left: 1px solid #475569;
                    border-top: 1px solid #475569;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(30, 41, 59, 0.5);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #475569;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #64748b;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
