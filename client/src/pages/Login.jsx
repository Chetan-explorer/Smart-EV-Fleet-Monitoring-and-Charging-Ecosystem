import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CarFront, KeyRound, Mail, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        >
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>

            <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-md w-full bg-surface/80 p-8 rounded-2xl shadow-2xl border border-slate-700 z-10 block backdrop-blur-xl"
            >
                <div className="text-center mb-8">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mx-auto h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mb-4"
                    >
                       <Zap className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h2 className="text-3xl font-extrabold text-text">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-textMuted">
                        Sign in to monitor your EV fleet
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            className="p-3 bg-alert/10 border border-alert/20 text-alert rounded-lg text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label className="sr-only">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-textMuted" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none rounded-xl relative block w-full px-3 pl-10 py-3 border border-slate-600 bg-slate-800/50 text-text focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all"
                                    placeholder="Email address"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="sr-only">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <KeyRound className="h-5 w-5 text-textMuted" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-xl relative block w-full px-3 pl-10 py-3 border border-slate-600 bg-slate-800/50 text-text focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all"
                                    placeholder="Password"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface transition-colors shadow-lg shadow-primary/25"
                        >
                            Sign in
                        </motion.button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-textMuted">
                        Don't have an account?{' '}
                        <button onClick={() => navigate('/register')} className="text-primary hover:underline font-medium focus:outline-none">
                            Register Now
                        </button>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Login;
