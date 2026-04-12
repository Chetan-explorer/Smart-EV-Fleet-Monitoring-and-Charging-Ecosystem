import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Zap, Car, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import UserStations from '../components/UserStations';

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-surface/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/60 hover:border-slate-500/80 transition-all flex flex-col justify-between items-start group relative overflow-hidden shadow-lg"
    >
        <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${colorClass}`}></div>
        <div className="flex justify-between w-full items-start z-10 relative">
            <div>
                <p className="text-textMuted text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-black text-text mt-2 tracking-tight">{value}</h3>
                {subtitle && <p className="text-xs text-textMuted mt-1 bg-slate-800/80 px-2 py-1 rounded-full border border-slate-700 w-max">{subtitle}</p>}
            </div>
            <div className={`p-3 rounded-2xl bg-slate-800/80 border border-slate-700/50 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ${colorClass.replace('bg-', 'text-')}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </motion.div>
);

const DashboardSkeleton = () => (
    <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-800/50 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-surface animate-pulse rounded-2xl border border-slate-800"></div>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-80 bg-surface animate-pulse rounded-2xl border border-slate-800 lg:col-span-2"></div>
            <div className="h-80 bg-surface animate-pulse rounded-2xl border border-slate-800"></div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [metrics, setMetrics] = useState({ total: 0, active: 0, charging: 0, idle: 0, avgBattery: 0 });
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role === 'User') {
            setLoading(false);
            return;
        }
        const fetchDashboardData = async () => {
            try {
                const [metricsRes, trendsRes, bookingsRes] = await Promise.all([
                    axios.get('/api/vehicles/metrics/summary'),
                    axios.get('/api/analytics/battery-trends'),
                    axios.get('/api/analytics/bookings')
                ]);
                setMetrics(metricsRes.data);
                setTrends(trendsRes.data);
                if (bookingsRes.data) {
                    setMetrics(m => ({ ...m, totalBookings: bookingsRes.data.totalBookings }));
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <DashboardSkeleton />;

    if (user?.role === 'User') {
        return <UserStations />;
    }

    // Pie chart data derived from metrics
    const statusData = [
        { name: 'Active', value: metrics.active, color: '#10b981' },
        { name: 'Charging', value: metrics.charging, color: '#f59e0b' },
        { name: 'Idle', value: metrics.idle, color: '#ef4444' }
    ];

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-2xl font-bold text-text">Fleet Dashboard {user?.role === 'Admin' ? '(Admin Mode)' : ''}</h1>
                <p className="text-textMuted text-sm">Overview of your EV fleet operations</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 lg:grid-cols-3 gap-6">
                <StatCard delay={0.1} title="Total Vehicles" value={metrics.total} icon={Car} colorClass="bg-blue-500" />
                <StatCard delay={0.2} title="Active Route" value={metrics.active} icon={CheckCircle2} colorClass="bg-emerald-500" />
                <StatCard delay={0.3} title="Currently Charging" value={metrics.charging} icon={Zap} colorClass="bg-amber-500" />
                <StatCard delay={0.4} title="Idle Need Action" value={metrics.idle} icon={AlertCircle} colorClass="bg-red-500" />
                {user?.role === 'Admin' && (
                    <>
                        <StatCard delay={0.5} title="Avg Fleet Battery" value={`${metrics.avgBattery}%`} icon={Zap} colorClass="bg-purple-500" subtitle={metrics.avgBattery < 30 ? "Needs" : "Healthy"} />
                        <StatCard delay={0.6} title="Total Bookings (24h)" value={metrics.totalBookings || 0} icon={CheckCircle2} colorClass="bg-indigo-500" />
                    </>
                )}
            </div>

            <div className={`grid grid-cols-1 ${user?.role === 'Admin' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
                {/* Area Chart Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className={`${user?.role === 'Admin' ? 'lg:col-span-2' : 'lg:col-span-1'} bg-surface/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/60 shadow-xl`}
                >
                    <h2 className="text-lg font-bold text-text mb-4">Battery Trends (24h)</h2>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Area type="monotone" dataKey="avgBattery" stroke="#10b981" fillOpacity={1} fill="url(#colorBattery)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Additional Admin Tools */}
                {user?.role === 'Admin' ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                        className="bg-surface/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/60 flex flex-col justify-between shadow-xl"
                    >
                        <div>
                            <h2 className="text-lg font-bold text-text mb-4">Operational Status</h2>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={statusData} 
                                            innerRadius={60} 
                                            outerRadius={80} 
                                            paddingAngle={5} 
                                            dataKey="value"
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                        className="bg-surface/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/60 flex flex-col justify-between shadow-xl"
                    >
                       <h2 className="text-lg font-bold text-text mb-4">AI Insights</h2>
                        <div className="space-y-4">
                            <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-primary/10 border border-primary/20 rounded-xl relative overflow-hidden group">
                                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                <p className="text-sm text-text font-medium relative z-10"><Zap className="inline w-4 h-4 mr-2 text-primary" />Fleet efficiency is optimal today.</p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
