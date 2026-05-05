import React from 'react';
import { Activity } from 'lucide-react';

const Reports = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Analytics Reports</h1>
                <p className="text-textMuted text-sm">Exportable data and comprehensive system analytics.</p>
            </div>
            <div className="bg-surface p-8 rounded-3xl border border-slate-700/50 shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
                <Activity className="w-16 h-16 text-slate-500 mb-4" />
                <h2 className="text-xl font-semibold text-slate-300">Reports Module Under Development</h2>
                <p className="text-slate-500 mt-2 text-center max-w-md">The comprehensive reporting engine with PDF/CSV exports is currently in the integration phase.</p>
            </div>
        </div>
    );
};

export default Reports;
