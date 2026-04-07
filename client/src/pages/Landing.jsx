import { Link, Navigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Activity, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -10 }}
    className="bg-surface/50 p-8 rounded-3xl border border-slate-700 backdrop-blur-xl hover:bg-surface/80 transition-all group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all"></div>
    <div className="bg-slate-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-700/50 group-hover:scale-110 transition-transform">
      <Icon className="w-7 h-7 text-primary" />
    </div>
    <h3 className="text-xl font-bold text-text mb-3">{title}</h3>
    <p className="text-textMuted leading-relaxed">{description}</p>
  </motion.div>
);

const Landing = () => {
  const { token, loading } = useContext(AuthContext);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  if (loading) return null;
  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-primary/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between py-6 px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <Zap className="w-8 h-8 text-primary" />
          <span className="text-2xl font-black tracking-tight text-white">EV Fleet HQ</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center space-x-4"
        >
          <Link to="/login" className="text-textMuted hover:text-white font-medium transition-colors px-4 py-2">
            Sign in
          </Link>
          <Link to="/register" className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold hover:bg-slate-200 transition-colors hidden sm:block">
            Get Started
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div style={{ y, opacity }} className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, type: "spring" }}
            className="inline-flex items-center space-x-2 bg-slate-800/50 rounded-full px-4 py-1.5 border border-slate-700/50 mb-8 backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="text-sm font-medium text-slate-300">Intelligent Platform</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tracking-tight leading-tight mb-8 max-w-4xl mx-auto"
          >
            The future of <br/> EV Fleet Management.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Monitor, track, and optimize your entire electric vehicle fleet with our cutting-edge intelligence platform. Build for scale.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to="/register" className="group relative w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full font-bold text-lg overflow-hidden shadow-2xl shadow-primary/30 flex items-center justify-center">
              <span className="relative z-10 flex items-center">
                Start for free <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white rounded-full font-bold text-lg border border-slate-700 hover:bg-slate-700 transition-colors">
              View Demo
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Visual Component Mockup */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 50 }}
        className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-32"
      >
        <div className="rounded-2xl border border-slate-700/50 bg-surface/40 backdrop-blur-md p-2 shadow-2xl shadow-black/50">
          <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative aspect-video flex items-center justify-center">
             <div className="absolute inset-0 bg-grid-slate-800/[0.2] bg-[size:20px_20px]"></div>
             <div className="text-center">
                <Car className="w-20 h-20 text-slate-700 mb-6 mx-auto" />
                <p className="text-slate-500 font-medium">Dashboard Preview</p>
             </div>
             {/* Glowing overlay */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/10 rounded-full blur-3xl mix-blend-screen opacity-50"></div>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Everything you need to scale</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Our platform provides comprehensive tools to manage your EV infrastructure efficiently and cost-effectively.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Activity} 
            title="Real-time Analytics" 
            description="Monitor battery health, charging status, and fleet efficiency with beautiful, insightful dashboards." 
            delay={0.1} 
          />
          <FeatureCard 
            icon={MapPin} 
            title="Live Tracking" 
            description="Locate any vehicle in your fleet instantly. Optimize routes and dispatch vehicles with intelligent geolocation." 
            delay={0.2} 
          />
          <FeatureCard 
            icon={ShieldCheck} 
            title="Predictive Maintenance" 
            description="AI-driven insights alert you to potential battery degradation or needed services before they become problems." 
            delay={0.3} 
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-background/80 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Zap className="w-6 h-6 text-primary" />
            <span className="font-bold text-white">EV Fleet HQ</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 EV Fleet Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
