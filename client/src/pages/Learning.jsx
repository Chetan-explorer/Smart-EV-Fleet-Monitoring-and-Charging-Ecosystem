import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const Learning = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 md:p-8 space-y-6 text-slate-300 min-h-screen bg-[#0a0f18]"
        >
            <div className="flex items-center space-x-3 mb-8">
                <BookOpen className="w-8 h-8 text-emerald-500" />
                <h1 className="text-3xl font-bold text-white">Learning Center</h1>
            </div>
            
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-8 text-center max-w-2xl mx-auto mt-20 shadow-lg">
                <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">EV Charging Guides</h2>
                <p className="text-slate-400">
                    Our comprehensive learning resources are currently being compiled. 
                    Check back soon for tutorials, best practices, and video guides on how to efficiently use the EV Fleet network.
                </p>
            </div>
        </motion.div>
    );
};

export default Learning;
