import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Layout = () => {
    const { token, loading } = useContext(AuthContext);

    if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-background text-primary">Loading...</div>;

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden text-text">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
                <motion.main 
                    className="flex-1 p-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    <Outlet />
                </motion.main>
            </div>
        </div>
    );
};

export default Layout;
