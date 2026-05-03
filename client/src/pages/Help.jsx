import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Mail, Phone, MessageSquare, X, Send, Bot } from 'lucide-react';
import axios from 'axios';

const Help = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm the EV Fleet Assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isChatOpen) {
            scrollToBottom();
        }
    }, [messages, isChatOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputValue;
        setInputValue('');

        try {
            const response = await axios.post('/api/chat', { message: currentInput });
            setMessages(prev => [...prev, { id: Date.now() + 1, text: response.data.text, sender: 'bot' }]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg = error.response?.data?.error || "Sorry, I'm having trouble connecting to the server right now.";
            setMessages(prev => [...prev, { id: Date.now() + 1, text: errorMsg, sender: 'bot' }]);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 md:p-8 space-y-6 text-slate-300 min-h-screen bg-[#0a0f18] relative"
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
                    <button 
                        onClick={() => setIsChatOpen(true)}
                        className="w-full bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-white py-2 rounded-lg text-sm transition-colors"
                    >
                        Start Chat
                    </button>
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

            {/* Live Chat Widget Overlay */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#1e293b] border-b border-slate-700 p-4 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center relative">
                                    <Bot className="w-6 h-6 text-emerald-500" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#111827] rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">EV Support Assistant</h3>
                                    <p className="text-xs text-emerald-500 font-medium">Online</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsChatOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0f18]/50">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl p-3 ${
                                        msg.sender === 'user' 
                                            ? 'bg-emerald-600 text-white rounded-br-sm' 
                                            : 'bg-[#1e293b] text-slate-200 border border-slate-700 rounded-bl-sm'
                                    }`}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-[#111827] border-t border-slate-700">
                            <div className="flex items-center space-x-2 relative">
                                <input 
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-[#1e293b] border border-slate-700 text-white rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                                <button 
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="absolute right-2 p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Help;
