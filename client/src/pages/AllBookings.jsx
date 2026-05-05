import React from 'react';
import { Calendar as CalendarIcon, Filter, Search } from 'lucide-react';

const AllBookings = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Global Bookings</h1>
                    <p className="text-textMuted text-sm">Monitor and manage all fleet charging reservations.</p>
                </div>
                <div className="flex space-x-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                        <input type="text" placeholder="Search ID or User..." className="pl-9 pr-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white hover:border-slate-500 transition-colors">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>
            
            <div className="bg-surface p-8 rounded-3xl border border-slate-700/50 shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
                <CalendarIcon className="w-16 h-16 text-slate-500 mb-4" />
                <h2 className="text-xl font-semibold text-slate-300">Global Bookings Module Under Development</h2>
                <p className="text-slate-500 mt-2 text-center max-w-md">The unified booking management system is being deployed. Soon you'll be able to view and override all user reservations here.</p>
            </div>
        </div>
    );
};

export default AllBookings;
