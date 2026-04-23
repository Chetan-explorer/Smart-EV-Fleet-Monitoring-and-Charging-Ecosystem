import { Link, Navigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Activity, ShieldAlert, Cpu, ArrowUpRight, BatteryCharging, ZapOff, Car } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
  const { token, loading } = useContext(AuthContext);
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  if (loading) return null;
  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <>
      {/* Inject custom distinctive fonts: Anton for brutalist headers, Archivo for dense body text */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@100;400;900&display=swap');
        
        .font-brutal {
          font-family: 'Anton', sans-serif;
          text-transform: uppercase;
        }
        
        .font-dense {
          font-family: 'Archivo', sans-serif;
        }

        .neon-lime {
          color: #D4FF00;
        }

        .bg-neon-lime {
          background-color: #D4FF00;
          color: #000;
        }

        .border-neon-lime {
          border-color: #D4FF00;
        }

        .hover-neon-block:hover {
          background-color: #D4FF00;
          color: #000 !important;
          transform: translate(-4px, -4px);
          box-shadow: 8px 8px 0px 0px rgba(212, 255, 0, 0.4);
        }

        .grain-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-dense overflow-x-hidden relative selection:bg-[#D4FF00] selection:text-black">
        <div className="grain-overlay"></div>

        {/* Industrial Grid Background */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
             style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {/* Navbar */}
        <nav className="relative z-50 flex items-center justify-between p-6 md:p-10 mix-blend-difference">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "circOut" }}
            className="flex items-center space-x-3"
          >
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded-none shadow-[4px_4px_0_0_#D4FF00]">
              <Zap className="w-8 h-8 text-black" strokeWidth={3} />
            </div>
            <span className="font-brutal text-3xl tracking-wide text-white">SYSTEM.HQ</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: "circOut" }}
            className="flex items-center space-x-6"
          >
            <Link to="/login" className="font-brutal text-xl text-white hover:neon-lime transition-colors hidden sm:block border-b-2 border-transparent hover:border-[#D4FF00]">
              // AUTHENTICATE
            </Link>
            <Link to="/register" className="font-brutal text-lg md:text-xl bg-neon-lime px-6 md:px-8 py-3 hover-neon-block transition-all border-2 border-transparent">
              INITIALIZE FLEET
            </Link>
          </motion.div>
        </nav>

        {/* FULL SCREEN HERO SECTION */}
        <section className="relative z-10 min-h-[90vh] flex flex-col justify-center px-6 md:px-10">
          <motion.div style={{ y: yHero, opacity: opacityHero }} className="w-full max-w-7xl mx-auto border-l-4 border-neon-lime pl-6 md:pl-12 py-10">
            
            <motion.div
              initial={{ width: 0 }} animate={{ width: "100px" }} transition={{ duration: 1, ease: "backOut" }}
              className="h-1 bg-neon-lime mb-8"
            />

            <motion.h1 
              initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="font-brutal text-[14vw] md:text-[9vw] leading-[0.85] text-white m-0 p-0"
            >
              BRUTE <span className="neon-lime">FORCE</span><br/>
              YOUR FLEET.
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
              className="mt-12 flex flex-col md:flex-row items-start md:items-end justify-between border-t border-[#333] pt-8"
            >
              <p className="text-xl md:text-3xl font-dense font-light text-[#999] max-w-2xl leading-snug">
                Raw industrial telemetry. Absolute operational domain. Scale your Electric Vehicle infrastructure with zero compromises and militant precision.
              </p>

              <div className="mt-8 md:mt-0 flex space-x-4">
                <Link to="/register" className="group flex items-center justify-center font-brutal text-2xl border-2 border-white text-white p-6 hover-neon-block transition-all bg-black">
                  DEPLOY NOW <ArrowUpRight className="ml-2 w-8 h-8 group-hover:rotate-45 transition-transform" />
                </Link>
              </div>
            </motion.div>

          </motion.div>

          {/* Marquee effect */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-y border-[#333] bg-[#0A0A0A] py-3 flex">
            <motion.div 
              animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
              className="whitespace-nowrap flex space-x-8 font-brutal text-2xl text-[#666]"
            >
               <span>// KINETIC ENERGY RECOVERY</span> <span>// TELEMETRY ACTIVE</span> <span>// GRID OPTIMIZED</span> <span>// ZERO EMISSION TACTICS</span>
               <span>// KINETIC ENERGY RECOVERY</span> <span>// TELEMETRY ACTIVE</span> <span>// GRID OPTIMIZED</span> <span>// ZERO EMISSION TACTICS</span>
               <span>// KINETIC ENERGY RECOVERY</span> <span>// TELEMETRY ACTIVE</span> <span>// GRID OPTIMIZED</span> <span>// ZERO EMISSION TACTICS</span>
            </motion.div>
          </div>
        </section>

        {/* ABSTRACT METRICS SECTION */}
        <section className="relative z-10 py-32 px-6 md:px-10 bg-white text-black">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
             <div>
                <h2 className="font-brutal text-6xl md:text-8xl leading-none mb-8">
                   NO GLOSS.<br/>
                   JUST <span className="neon-lime" style={{textShadow: "2px 2px 0 #000"}} >DATA.</span>
                </h2>
                <p className="text-xl md:text-2xl font-bold mb-10 max-w-lg">
                   Forget pretty dashboards. We provide raw, unadulterated telemetry for high-performance fleet managers who demand immediate operational clarity.
                </p>
                <div className="grid grid-cols-2 gap-6 font-brutal text-xl">
                   <div className="border-l-4 border-black pl-4">
                      <div className="text-5xl md:text-6xl mb-2 text-black leading-none">99.9%</div>
                      <div className="text-gray-500 max-w-[100px]">UPTIME PROTOCOL</div>
                   </div>
                   <div className="border-l-4 border-black pl-4">
                      <div className="text-5xl md:text-6xl mb-2 text-black leading-none">&lt;10ms</div>
                      <div className="text-gray-500 max-w-[100px]">SYSTEM LATENCY</div>
                   </div>
                </div>
             </div>
             
             {/* Brutalist Graphics Component */}
             <div className="relative border-4 border-black p-4 md:p-8 bg-[#F0F0F0] shadow-[16px_16px_0_0_#000]">
                <div className="absolute top-4 right-4 bg-black text-neon-lime font-brutal px-4 py-1 text-xl z-20">
                   STATUS: OPTIMAL
                </div>
                <div className="border border-black bg-white p-6 mt-12 block relative overflow-hidden">
                   <Cpu className="w-16 h-16 text-black mb-6 relative z-10" />
                   <h3 className="font-brutal text-3xl mb-4 relative z-10">CORE NERVOUS SYSTEM</h3>
                   
                   <div className="h-6 border-2 border-black w-full mb-4 relative z-10 p-1">
                      <motion.div initial={{ width: "0%" }} whileInView={{ width: "87%" }} transition={{ duration: 1.5, delay: 0.2 }} className="h-full bg-neon-lime relative">
                         <div className="absolute inset-0 bg-black opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>
                      </motion.div>
                   </div>

                   <div className="flex justify-between font-bold font-mono text-sm uppercase relative z-10">
                      <span>Load Capacity</span> <span className="bg-black text-neon-lime px-2 py-0.5">87%</span>
                   </div>

                   <div className="absolute -bottom-10 -right-10 text-9xl text-gray-100 font-brutal pointer-events-none opacity-50 z-0 select-none">
                      SYS
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* FEATURES - GRID LISTING NO TRACKING */}
        <section className="relative z-10 py-32 px-6 md:px-10 bg-[#0A0A0A]">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-16 border-b-2 border-[#333] pb-6">
                    <h2 className="font-brutal text-5xl md:text-7xl text-white">CORE MECHANICS</h2>
                    <ZapOff className="w-12 h-12 md:w-16 md:h-16 text-[#333]" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Activity, title: "RAW TELEMETRY", desc: "Unfiltered battery metrics and vehicle diagnostics fed directly to your command centers in real-time." },
                        { icon: BatteryCharging, title: "HYPER-CHARGE", desc: "Orchestrate charging cycles with militant efficiency to ensure absolute zero operational downtime." },
                        { icon: ShieldAlert, title: "SECURE COMM.", desc: "Data protection built like a vault. Fleet metrics are air-gapped, encrypted, and impervious."}
                    ].map((feat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="border border-[#333] p-8 bg-[#111] hover:bg-[#D4FF00] hover:text-black transition-colors group cursor-pointer"
                        >
                            <feat.icon className="w-16 h-16 mb-8 text-[#D4FF00] group-hover:text-black transition-colors" strokeWidth={1.5} />
                            <h3 className="font-brutal text-3xl mb-4">{feat.title}</h3>
                            <p className="font-dense font-medium text-gray-500 group-hover:text-gray-800 leading-relaxed text-lg">
                                {feat.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* Brutalist Footer */}
        <footer className="bg-neon-lime text-black py-20 px-6 md:px-10 relative z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end border-b-4 border-black pb-8">
                <div>
                   <h2 className="font-brutal text-7xl md:text-9xl leading-[0.8] mb-6">INITIATE<br/>COMM.</h2>
                </div>
                <div className="text-right mt-10 md:mt-0 font-bold text-xl uppercase">
                   <p className="text-3xl font-brutal">SYSTEM.HQ © 2026</p>
                   <p className="mt-2 text-black/60 font-dense">ALL PROTOCOLS OBSERVED.</p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto pt-8 flex items-center justify-between font-brutal text-2xl uppercase">
                <Link to="/login" className="hover:underline underline-offset-8">LOGIN SEQUENCE &rarr;</Link>
                <div className="w-4 h-4 bg-black rounded-full shadow-[0_0_10px_0_#000] animate-pulse"></div>
            </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
