import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(undefined); // Use undefined for initial state
    const [loading, setLoading] = useState(true); // Add a loading state

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Optionally verify token with your API
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Token verification failed:', error);
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false); // Set loading to false after the check
        };

        checkAuthentication();
    }, []);

    const handleLogin = async (data) => {
        try {
            const userData = await loginUser(data);
            localStorage.setItem('token', userData.token);
            setIsAuthenticated(true);
            return userData;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const handleSignup = async (data) => {
        try {
            const userData = await registerUser(data);
            localStorage.setItem('token', userData.token);
            return userData;
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    // Ensure that the context value contains the loading state
    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login: handleLogin, signup: handleSignup, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
