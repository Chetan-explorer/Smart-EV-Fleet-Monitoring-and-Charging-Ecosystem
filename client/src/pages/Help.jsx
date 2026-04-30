import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Mail, Phone, MessageSquare } from 'lucide-react';

const Help = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 md:p-8 space-y-6 text-slate-300 min-h-screen bg-[#0a0f18]"
        >
            <div className="flex items-center space-x-3 mb-8">
                <HelpCircle className="w-8 h-8 text-emerald-500" />
                <h1 className="text-3xl font-bold text-white">Help & Support</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 flex flex-col items-center text-center shadow-lg hover:border-slate-700 transition">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
                    <p className="text-sm text-slate-400 mb-4 flex-1">Chat with our support team in real-time for quick issue resolution.</p>
                    <button className="w-full bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-white py-2 rounded-lg text-sm transition-colors">Start Chat</button>
                </div>

                <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 flex flex-col items-center text-center shadow-lg hover:border-slate-700 transition">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                        <Mail className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
                    <p className="text-sm text-slate-400 mb-4 flex-1">Send us a detailed email. We typically respond within 2-4 hours.</p>
                    <button className="w-full bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-white py-2 rounded-lg text-sm transition-colors">support@evfleet.com</button>
                </div>

                <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 flex flex-col items-center text-center shadow-lg hover:border-slate-700 transition">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                        <Phone className="w-6 h-6 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Phone Support</h3>
                    <p className="text-sm text-slate-400 mb-4 flex-1">Call us directly for critical emergencies at a charging station.</p>
                    <button className="w-full bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-white py-2 rounded-lg text-sm transition-colors">1-800-EV-FLEET</button>
                </div>
            </div>
        </motion.div>
    );
};

export default Help;
