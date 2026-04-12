import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/auth/profile');
            setUser(data);
        } catch (error) {
            console.error(error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password, role, vehicleNumber, vehicleModel) => {
        const { data } = await axios.post('/api/auth/register', { name, email, password, role, vehicleNumber, vehicleModel });
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser({ _id: data._id, name: data.name, email: data.email, role: data.role, vehicleNumber: data.vehicleNumber, vehicleModel: data.vehicleModel });
    };

    const login = async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password });
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser({ _id: data._id, name: data.name, email: data.email, role: data.role, vehicleNumber: data.vehicleNumber, vehicleModel: data.vehicleModel });
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
