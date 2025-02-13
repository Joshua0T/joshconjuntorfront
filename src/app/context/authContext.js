"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                const response = await axiosInstance.get('/check');
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
        } catch (error) {
            setUser(null);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    const register = async ({
        nombres,
        documentoIdentidad,
        nombreDeUsuario,
        password,
        rol
    }) => {
        try {
            const response = await axiosInstance.post('/register', {
                nombres,
                documentoIdentidad,
                nombreDeUsuario,
                password,
                rol
            });
            
            // Opcionalmente, inicia sesión automáticamente después del registro
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            router.push('/admin');

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error en el registro',
                details: error.response?.data?.details || null
            };
        }
    };

    const login = async (credentials) => {
        try {
            const response = await axiosInstance.post('/login', credentials);
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router.push('/admin');

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error en el inicio de sesión'
            };
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/logout');
            setUser(null);
            localStorage.removeItem('user');
            router.push('/');
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al cerrar sesión'
            };
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};