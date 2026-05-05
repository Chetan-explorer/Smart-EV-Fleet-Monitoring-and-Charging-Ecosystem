import React from 'react';
import { Server } from 'lucide-react';

const Ports = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Port Management</h1>
                <p className="text-textMuted text-sm">Monitor and configure individual charging ports.</p>
            </div>
            <div className="bg-surface p-8 rounded-3xl border border-slate-700/50 shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
                <Server className="w-16 h-16 text-slate-500 mb-4" />
                <h2 className="text-xl font-semibold text-slate-300">Ports Module Under Development</h2>
                <p className="text-slate-500 mt-2 text-center max-w-md">Advanced port-level diagnostics and hardware telemetry will be available in the upcoming release.</p>
            </div>
        </div>
    );
};

export default Ports;
