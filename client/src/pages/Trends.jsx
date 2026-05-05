import React from 'react';
import { TrendingUp } from 'lucide-react';

const Trends = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Usage Trends</h1>
                <p className="text-textMuted text-sm">Long-term predictive analytics and usage pattern analysis.</p>
            </div>
            <div className="bg-surface p-8 rounded-3xl border border-slate-700/50 shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
                <TrendingUp className="w-16 h-16 text-slate-500 mb-4" />
                <h2 className="text-xl font-semibold text-slate-300">Trends Module Under Development</h2>
                <p className="text-slate-500 mt-2 text-center max-w-md">Our machine-learning predictive trends models are training and will be visualized here shortly.</p>
            </div>
        </div>
    );
};

export default Trends;
