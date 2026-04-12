import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Car, Map as MapIcon, LogOut, Settings, ChevronLeft, ChevronRight, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const MotionLink = motion.create(Link);

const Sidebar = () => {
    const { logout, user } = useContext(AuthContext);
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [];

    if (user?.role === 'Admin') {
        navItems.push(
            { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            { name: 'Fleet Vehicles', path: '/dashboard/vehicles', icon: Car },
            { name: 'Multi-Map View', path: '/dashboard/map', icon: MapIcon },
            { name: 'Users', path: '/dashboard/users', icon: UserCircle }
        );
    } else if (user?.role === 'FleetManager') {
        navItems.push(
            { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
            { name: 'Map View', path: '/dashboard/map', icon: MapIcon }
        );
    } else if (user?.role === 'User') {
        navItems.push(
            { name: 'Find Stations', path: '/dashboard', icon: MapIcon },
            { name: 'My Bookings', path: '/dashboard/bookings', icon: Car },
            { name: 'My Profile', path: '/dashboard/profile', icon: UserCircle }
        );
    }

    return (
        <motion.div 
            animate={{ width: collapsed ? 80 : 256 }}
            className="bg-surface h-screen border-r border-slate-700 flex flex-col relative z-20"
        >
            <button 
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-6 bg-slate-800 border border-slate-700 text-textMuted hover:text-text rounded-full p-1 z-30"
            >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <div className="h-16 flex items-center justify-center border-b border-slate-700 overflow-hidden">
                <AnimatePresence mode="wait">
                    {!collapsed ? (
                        <motion.span 
                            key="full"
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                            className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent whitespace-nowrap"
                        >
                            EV Fleet HQ
                        </motion.span>
                    ) : (
                        <motion.span 
                            key="short"
                            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                            className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                        >
                            EV
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex-1 py-6 px-3 space-y-2 overflow-x-hidden">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

                    return (
                        <MotionLink
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            key={item.name}
                            to={item.path}
                            className={cn(
                                "flex items-center space-x-3 px-3 py-3 rounded-xl transition-colors duration-200 group relative",
                                isActive 
                                    ? "bg-primary/10 text-primary" 
                                    : "text-textMuted hover:bg-slate-800 hover:text-text",
                                collapsed && "justify-center"
                            )}
                        >
                            <Icon className={cn("w-5 h-5 min-w-[20px]", isActive ? "text-primary" : "text-textMuted group-hover:text-text")} />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span 
                                        initial={{ opacity: 0, width: 0 }} 
                                        animate={{ opacity: 1, width: 'auto' }} 
                                        exit={{ opacity: 0, width: 0 }}
                                        className="font-medium whitespace-nowrap overflow-hidden"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {isActive && !collapsed && (
                                <motion.div layoutId="sidebar-active" className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full" />
                            )}
                        </MotionLink>
                    )
                })}
            </div>

            <div className="p-4 border-t border-slate-700 space-y-4">
                <div className={cn("flex items-center space-x-3 overflow-hidden", collapsed ? "justify-center" : "px-2")}>
                    <div className="w-10 h-10 min-w-[40px] rounded-full bg-slate-800 flex items-center justify-center font-bold text-primary border border-slate-700 shadow-inner">
                        {user?.name.charAt(0)}
                    </div>
                    {!collapsed && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap">
                            <p className="text-sm font-medium text-text">{user?.name}</p>
                            <p className="text-xs text-textMuted">{user?.role}</p>
                        </motion.div>
                    )}
                </div>
                
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={logout}
                    className={cn(
                        "flex w-full items-center space-x-3 py-2 text-textMuted hover:text-alert transition-colors rounded-xl hover:bg-alert/10",
                        collapsed ? "justify-center" : "px-4"
                    )}
                >
                    <LogOut className="w-5 h-5 min-w-[20px]" />
                    {!collapsed && <span className="whitespace-nowrap">Logout</span>}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
