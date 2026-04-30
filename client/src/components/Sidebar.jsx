import { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, Car, Map as MapIcon, Settings, 
  ChevronDown, ChevronUp, Users, Activity, Calendar, Zap, Server, Navigation, LogOut, ChevronLeft, ChevronRight, BookOpen, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
    const { logout, user } = useContext(AuthContext);
    const location = useLocation();

    // Expanded states for accordion menus
    const [expandedMenu, setExpandedMenu] = useState('Dashboard');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const toggleMenu = (menuName) => {
        if (collapsed) {
            setCollapsed(false);
            setExpandedMenu(menuName);
            return;
        }
        if (expandedMenu === menuName) {
            setExpandedMenu(null);
        } else {
            setExpandedMenu(menuName);
        }
    };

    let navGroups = [];

    if (user?.role === 'Admin') {
        navGroups = [
            { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', subItems: [] },
            { name: 'Infrastructure', icon: Server, subItems: [{ name: 'Stations', path: '/dashboard/stations' }, { name: 'Ports', path: '/dashboard/ports' }] },
            { name: 'Fleet Management', icon: Car, subItems: [{ name: 'Vehicles', path: '/dashboard/vehicles' }] },
            { name: 'Bookings', icon: Calendar, subItems: [{ name: 'All Bookings', path: '/dashboard/bookings' }, { name: 'Schedule', path: '/dashboard/schedule' }] },
            { name: 'Users', icon: Users, subItems: [{ name: 'All Users', path: '/dashboard/users' }] },
            { name: 'Analytics', icon: Activity, subItems: [{ name: 'Reports', path: '/dashboard/reports' }, { name: 'Trends', path: '/dashboard/trends' }] },
            { name: 'Settings', icon: Settings, subItems: [{ name: 'System Settings', path: '/dashboard/settings' }] }
        ];
    } else if (user?.role === 'FleetManager') {
        navGroups = [{ name: 'Overview', icon: LayoutDashboard, path: '/dashboard', subItems: [] }];
    } else if (user?.role === 'User') {
        navGroups = [
            { name: 'All Stations list', icon: LayoutDashboard, path: '/dashboard', subItems: [] },
            { name: 'My Bookings', icon: Car, path: '/dashboard/bookings', subItems: [] },
            { name: 'Map', icon: MapIcon, path: '/dashboard/map', subItems: [] },
            { name: 'My Profile', icon: Users, path: '/dashboard/profile', subItems: [] },
            { name: 'Learning', icon: BookOpen, path: '/dashboard/learning', subItems: [] },
            { name: 'Help', icon: HelpCircle, path: '/dashboard/help', subItems: [] }
        ];
    }

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <motion.div 
            animate={{ width: collapsed ? 80 : 256 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-[#0b0f19] h-screen border-r border-slate-800 flex flex-col z-20 text-slate-300 font-sans shadow-2xl relative"
        >
            {/* Collapse Toggle */}
            <button 
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-6 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-full p-1 z-30 transition-colors"
            >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            
            {/* Header / Logo */}
            <div className={cn("h-16 flex items-center border-b border-slate-800 shrink-0 overflow-hidden", collapsed ? "justify-center px-0" : "px-6")}>
                <div className="flex items-center space-x-3 cursor-pointer">
                    <div className="text-emerald-500 shrink-0">
                        <Zap className="w-6 h-6 fill-emerald-500/20" />
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span 
                                initial={{ opacity: 0, width: 0 }} 
                                animate={{ opacity: 1, width: 'auto' }} 
                                exit={{ opacity: 0, width: 0 }}
                                className="text-lg font-bold text-white tracking-wide whitespace-nowrap"
                            >
                                EV Fleet HQ
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className={cn("flex-1 py-6 overflow-y-auto overflow-x-hidden custom-scrollbar space-y-1", collapsed ? "px-2" : "px-4")}>
                {navGroups.map((group) => {
                    const Icon = group.icon;
                    const hasSubItems = group.subItems && group.subItems.length > 0;
                    
                    const isParentActive = location.pathname === group.path || (hasSubItems && group.subItems.some(sub => location.pathname === sub.path || location.pathname.startsWith(sub.path)));
                    const isExpanded = !collapsed && (expandedMenu === group.name || isParentActive);

                    return (
                        <div key={group.name} className="flex flex-col">
                            {hasSubItems ? (
                                <button
                                    onClick={() => toggleMenu(group.name)}
                                    className={cn(
                                        "flex items-center w-full py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium",
                                        isExpanded ? "text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200",
                                        collapsed ? "justify-center px-0" : "justify-between px-3"
                                    )}
                                    title={collapsed ? group.name : ""}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Icon className={cn("w-4 h-4 shrink-0", isExpanded || isParentActive ? "text-slate-300" : "text-slate-500")} />
                                        {!collapsed && <span className="whitespace-nowrap">{group.name}</span>}
                                    </div>
                                    {!collapsed && (isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />)}
                                </button>
                            ) : (
                                <Link
                                    to={group.path}
                                    className={cn(
                                        "flex items-center space-x-3 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium",
                                        isParentActive ? "bg-emerald-500/10 text-emerald-500" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200",
                                        collapsed ? "justify-center px-0" : "px-3"
                                    )}
                                    title={collapsed ? group.name : ""}
                                >
                                    <Icon className={cn("w-4 h-4 shrink-0", isParentActive ? "text-emerald-500" : "text-slate-500")} />
                                    {!collapsed && <span className="whitespace-nowrap">{group.name}</span>}
                                </Link>
                            )}

                            {/* Sub Items */}
                            <AnimatePresence>
                                {hasSubItems && isExpanded && !collapsed && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pl-6 pr-2 py-1 space-y-0.5 border-l border-slate-700 ml-5 mt-1 mb-1">
                                            {group.subItems.map(subItem => {
                                                const isSubActive = location.pathname === subItem.path || location.pathname.startsWith(subItem.path);
                                                return (
                                                    <Link
                                                        key={subItem.name}
                                                        to={subItem.path}
                                                        className={cn(
                                                            "block px-3 py-1.5 rounded-md text-xs transition-colors duration-200 whitespace-nowrap",
                                                            isSubActive ? "text-white font-semibold" : "text-slate-500 hover:text-slate-300"
                                                        )}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Status Section */}
            <div className={cn("shrink-0 border-t border-slate-800 flex flex-col overflow-hidden", collapsed ? "p-4 space-y-4 items-center" : "p-6 space-y-6")}>
                
                {/* System Status Dropdown */}
                {!collapsed ? (
                    <div className="bg-[#111827] border border-slate-800 rounded-lg p-3 cursor-pointer hover:border-slate-700 transition">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-400">System Status</span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        </div>
                        <div className="flex items-center text-emerald-500 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                            All Systems Operational
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center" title="All Systems Operational">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    </div>
                )}

                {/* Time and Date */}
                {!collapsed && (
                    <div>
                        <div className="text-lg font-bold text-slate-300 tracking-tight whitespace-nowrap">{formatTime(currentTime)}</div>
                        <div className="text-xs text-slate-500 font-medium tracking-wide mt-0.5 whitespace-nowrap">{formatDate(currentTime)}</div>
                    </div>
                )}

                {/* Logout Button */}
                <button 
                    onClick={logout}
                    className={cn(
                        "flex items-center text-slate-500 hover:text-red-400 transition-colors text-xs font-semibold",
                        collapsed ? "justify-center w-10 h-10 bg-slate-800/50 rounded-lg" : "space-x-2"
                    )}
                    title={collapsed ? "Logout" : ""}
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="whitespace-nowrap">Secure Logout</span>}
                </button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
