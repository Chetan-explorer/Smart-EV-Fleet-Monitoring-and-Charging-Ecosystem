import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, Navigation, BarChart3, Car, ChevronRight, 
  MapPin, Activity, ShieldAlert, Cpu, ArrowUpRight, Clock 
} from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-[#0a0f18] text-[#cbd5e1] font-['Inter'] overflow-x-hidden selection:bg-[#10b981] selection:text-white">
            
            {/* Background Grid Pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* Navbar */}
            <nav className="relative z-50 border-b border-[#111827]/80 bg-[#0a0f18]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#10b981]/10 rounded-xl flex items-center justify-center border border-[#10b981]/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <Zap className="w-5 h-5 text-[#10b981]" />
                        </div>
                        <span className="text-[#ffffff] font-['Space_Grotesk'] font-bold text-xl tracking-tight">NEXUS<span className="text-[#10b981]">.EV</span></span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link to="/login" className="text-sm font-medium hover:text-[#ffffff] transition-colors">Sign In</Link>
                        <Link to="/register" state={{ defaultRole: 'User' }} className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white text-sm font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                            Access Portal
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                {/* Neon Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10b981]/10 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-full mb-8">
                            <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse"></span>
                            <span className="text-[#3b82f6] text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider">System Online V2.4</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-['Space_Grotesk'] font-bold text-[#ffffff] leading-[1.1] mb-6">
                            EV Infrastructure <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#3b82f6]">Command Center</span>
                        </h1>
                        <p className="text-xl text-[#cbd5e1] mb-4 font-['Space_Grotesk'] font-medium">
                            Monitor. Optimize. Control.
                        </p>
                        <p className="text-lg text-[#64748b] mb-10 max-w-lg leading-relaxed">
                            Real-time charging intelligence for modern fleets and smart cities. Aggregate data, predict demand, and scale your infrastructure seamlessly.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-[#10b981] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center space-x-2 group">
                                <span>Get Started</span>
                                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#cbd5e1]/20 text-[#ffffff] font-bold rounded-xl hover:bg-[#111827] transition-all flex items-center justify-center">
                                <span>View Dashboard</span>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Hero Visual */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#10b981]/20 to-[#3b82f6]/20 rounded-3xl blur-2xl"></div>
                        <div className="bg-[#111827] border border-[#10b981]/20 p-2 rounded-3xl shadow-2xl relative z-10">
                            <div className="bg-[#0a0f18] rounded-2xl overflow-hidden border border-[#334155]/50 relative h-[400px]">
                                {/* Mock UI Elements */}
                                <div className="absolute inset-0 p-6 flex flex-col">
                                    <div className="flex justify-between items-center mb-8 border-b border-[#334155] pb-4">
                                        <div className="font-['Space_Grotesk'] text-[#ffffff] font-semibold">Global Telemetry</div>
                                        <div className="font-['JetBrains_Mono'] text-[#10b981] text-xs flex items-center space-x-2">
                                            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                                            <span>LIVE_SYNC</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 flex-1">
                                        <div className="bg-[#111827] border border-[#334155] rounded-xl p-4 flex flex-col justify-between group hover:border-[#10b981]/50 transition-colors">
                                            <Activity className="w-6 h-6 text-[#3b82f6] mb-4" />
                                            <div>
                                                <div className="text-[#64748b] text-xs mb-1">Active Sessions</div>
                                                <div className="font-['JetBrains_Mono'] text-[#ffffff] text-2xl font-bold">1,204</div>
                                            </div>
                                        </div>
                                        <div className="bg-[#111827] border border-[#334155] rounded-xl p-4 flex flex-col justify-between group hover:border-[#10b981]/50 transition-colors">
                                            <Zap className="w-6 h-6 text-[#f59e0b] mb-4" />
                                            <div>
                                                <div className="text-[#64748b] text-xs mb-1">Power Output</div>
                                                <div className="font-['JetBrains_Mono'] text-[#ffffff] text-2xl font-bold">8.4<span className="text-sm text-[#cbd5e1] ml-1">MW</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Mock Map area */}
                                    <div className="mt-4 h-32 bg-[#111827] border border-[#334155] rounded-xl relative overflow-hidden">
                                         <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#10b981] rounded-full shadow-[0_0_10px_#10b981] animate-ping"></div>
                                         <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-[#ef4444] rounded-full shadow-[0_0_10px_#ef4444] animate-pulse"></div>
                                         <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-[#f59e0b] rounded-full shadow-[0_0_10px_#f59e0b] animate-pulse"></div>
                                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <MapPin className="w-8 h-8 text-[#334155] opacity-20" />
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-[#0a0f18] border-t border-[#111827] relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-['Space_Grotesk'] font-bold text-[#ffffff] mb-4">Core Infrastructure Capabilities</h2>
                        <p className="text-[#64748b] max-w-2xl mx-auto">Hardware-agnostic integration with predictive logic to keep your fleet moving.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Activity, title: "Real-time Monitoring", desc: "Live telemetry and status updates from every node in your charging network.", color: "#10b981" },
                            { icon: Navigation, title: "Smart Routing", desc: "Dynamic geographical dispatch based on station availability and queue depth.", color: "#3b82f6" },
                            { icon: BarChart3, title: "Demand Analytics", desc: "Granular utilization metrics and predictive peak-hour forecasting algorithms.", color: "#f59e0b" },
                            { icon: Car, title: "Fleet Optimization", desc: "Automated booking and charging schedules matched to vehicle battery constraints.", color: "#ef4444" }
                        ].map((feature, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#111827] p-8 rounded-2xl border border-[#1f2937] hover:border-[#334155] transition-all group hover:-translate-y-1 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: feature.color }}></div>
                                <feature.icon className="w-10 h-10 mb-6" style={{ color: feature.color }} />
                                <h3 className="text-[#ffffff] font-['Space_Grotesk'] font-bold text-lg mb-3">{feature.title}</h3>
                                <p className="text-[#64748b] text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visual / Data Section */}
            <section className="py-24 bg-[#111827] border-y border-[#1f2937] relative overflow-hidden">
                <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-[#0a0f18] to-transparent z-10 hidden lg:block"></div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-20">
                    <div>
                        <h2 className="text-3xl lg:text-5xl font-['Space_Grotesk'] font-bold text-[#ffffff] mb-6 leading-tight">
                            Geospatial <br/>
                            <span className="text-[#3b82f6]">Command View</span>
                        </h2>
                        <p className="text-[#cbd5e1] mb-8 text-lg leading-relaxed">
                            Track your entire grid on a unified operational map. Identify bottlenecks, monitor live capacity, and override automated systems with a single click.
                        </p>
                        
                        <div className="space-y-4">
                            {[
                                { label: "Network Uptime", value: "99.98%", statColor: "text-[#10b981]" },
                                { label: "Average Queue", value: "4.2 Min", statColor: "text-[#f59e0b]" },
                                { label: "Critical Alerts", value: "0", statColor: "text-[#10b981]" }
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-[#0a0f18] rounded-xl border border-[#1f2937]">
                                    <span className="text-[#64748b] font-medium">{stat.label}</span>
                                    <span className={`font-['JetBrains_Mono'] font-bold text-xl ${stat.statColor}`}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-[#0a0f18] p-4 rounded-3xl border border-[#334155] shadow-2xl relative">
                        {/* Mock Map Interface */}
                        <div className="aspect-square sm:aspect-video rounded-2xl bg-[#0a0f18] border border-[#1f2937] relative overflow-hidden">
                            {/* Grid lines */}
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            
                            {/* Nodes */}
                            <div className="absolute top-[20%] left-[30%]">
                                <div className="w-16 h-16 border border-[#10b981]/50 rounded-full flex items-center justify-center animate-[spin_4s_linear_infinite]">
                                    <div className="w-4 h-4 bg-[#10b981] rounded-full shadow-[0_0_15px_#10b981]"></div>
                                </div>
                                <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 bg-[#111827] border border-[#10b981]/30 p-2 rounded-lg text-xs font-['JetBrains_Mono'] text-[#10b981] whitespace-nowrap hidden sm:block">
                                    STATION_ALPHA [8/8]
                                </div>
                            </div>

                            <div className="absolute top-[60%] left-[70%]">
                                <div className="w-20 h-20 border border-[#f59e0b]/50 rounded-full flex items-center justify-center relative">
                                    <div className="absolute inset-0 border border-[#f59e0b]/20 rounded-full animate-ping"></div>
                                    <div className="w-4 h-4 bg-[#f59e0b] rounded-full shadow-[0_0_15px_#f59e0b]"></div>
                                </div>
                                <div className="absolute top-1/2 right-full mr-4 -translate-y-1/2 bg-[#111827] border border-[#f59e0b]/30 p-2 rounded-lg text-xs font-['JetBrains_Mono'] text-[#f59e0b] whitespace-nowrap hidden sm:block">
                                    STATION_BETA [4/8] WAIT: 12M
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Insights / Intelligence Section */}
            <section className="py-24 px-6 relative bg-[#0a0f18]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full mb-4">
                            <Cpu className="w-4 h-4 text-[#10b981]" />
                            <span className="text-[#10b981] text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider">Nexus AI Engine</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-['Space_Grotesk'] font-bold text-[#ffffff]">Actionable Intelligence</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { 
                                icon: ShieldAlert, 
                                action: "Add station in high-demand area", 
                                metric: "Zone 4 utilization at 98%",
                                effect: "+15% Grid Efficiency",
                                color: "border-[#ef4444]/30 bg-[#ef4444]/5 text-[#ef4444]"
                            },
                            { 
                                icon: Clock, 
                                action: "Reduce wait time by 30%", 
                                metric: "Shift fleet charging to off-peak",
                                effect: "-$2,400 Monthly Cost",
                                color: "border-[#10b981]/30 bg-[#10b981]/5 text-[#10b981]"
                            },
                            { 
                                icon: Zap, 
                                action: "Optimize underutilized infrastructure", 
                                metric: "Station Gamma idle for 4hrs",
                                effect: "Re-route inbound vehicles",
                                color: "border-[#f59e0b]/30 bg-[#f59e0b]/5 text-[#f59e0b]"
                            }
                        ].map((insight, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`border ${insight.color.split(' ')[0]} bg-[#111827] rounded-2xl p-6 relative overflow-hidden hover:-translate-y-1 transition-transform`}
                            >
                                <div className={`absolute top-0 left-0 w-full h-1 ${insight.color.split(' ')[1]}`}></div>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${insight.color.split(' ')[1]}`}>
                                    <insight.icon className={`w-5 h-5 ${insight.color.split(' ')[2]}`} />
                                </div>
                                <h3 className="text-[#ffffff] font-bold text-lg mb-2 leading-tight font-['Space_Grotesk']">{insight.action}</h3>
                                <p className="text-[#64748b] text-sm mb-6">{insight.metric}</p>
                                <div className="mt-auto inline-block px-3 py-1.5 bg-[#0a0f18] rounded-lg border border-[#1f2937] font-['JetBrains_Mono'] text-xs font-bold text-[#cbd5e1]">
                                    Expected: {insight.effect}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative border-t border-[#1f2937] bg-[#111827] overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-[800px] h-[800px] border border-[#10b981] rounded-full"></div>
                    <div className="w-[600px] h-[600px] border border-[#10b981] rounded-full absolute"></div>
                    <div className="w-[400px] h-[400px] border border-[#10b981] rounded-full absolute"></div>
                </div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl lg:text-6xl font-['Space_Grotesk'] font-bold text-[#ffffff] mb-8">
                        Take control of your EV infrastructure today
                    </h2>
                    <Link to="/login" className="inline-flex items-center space-x-3 px-10 py-5 bg-[#10b981] hover:bg-[#059669] text-white text-lg font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                        <span>Launch Dashboard</span>
                        <ChevronRight className="w-6 h-6" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0a0f18] border-t border-[#111827] py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                    <div className="flex items-center space-x-2 mb-8 opacity-50">
                        <Zap className="w-5 h-5 text-[#cbd5e1]" />
                        <span className="text-[#ffffff] font-['Space_Grotesk'] font-bold text-xl tracking-tight">NEXUS.EV</span>
                    </div>
                    <div className="flex space-x-8 mb-8 text-sm text-[#64748b] font-medium flex-wrap justify-center gap-y-4">
                        <Link to="#" className="hover:text-[#cbd5e1] transition-colors">Platform</Link>
                        <Link to="#" className="hover:text-[#cbd5e1] transition-colors">Documentation</Link>
                        <Link to="#" className="hover:text-[#cbd5e1] transition-colors">API Reference</Link>
                        <Link to="#" className="hover:text-[#cbd5e1] transition-colors">Support</Link>
                    </div>
                    <p className="text-[#64748b] text-sm">All rights reserved @2026</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
