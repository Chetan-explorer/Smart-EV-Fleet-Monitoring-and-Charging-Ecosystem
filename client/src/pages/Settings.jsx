import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">System Settings</h1>
                <p className="text-textMuted text-sm">Manage global system configurations and preferences.</p>
            </div>
            <div className="bg-surface p-8 rounded-3xl border border-slate-700/50 shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
                <SettingsIcon className="w-16 h-16 text-slate-500 mb-4 animate-spin-slow" />
                <h2 className="text-xl font-semibold text-slate-300">Settings Module Under Development</h2>
                <p className="text-slate-500 mt-2 text-center max-w-md">This feature is currently being integrated. Soon you will be able to manage APIs, webhooks, and core system preferences here.</p>
            </div>
        </div>
    );
};

export default Settings;
