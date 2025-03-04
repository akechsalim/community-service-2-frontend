import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Login.css';
import AuthService from '../Services/authService';

const Login = ({ handleLogin }) => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
            console.log('Full login response:', response.data);
            AuthService.setUserData(response.data.token, response.data.username, response.data.role, response.data.userId);
            handleLogin(response.data.token, response.data.username, response.data.role, response.data.userId);
            navigate('/');
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <motion.div
            className="login-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
        >
            <motion.div
                className="login-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
                <form onSubmit={handleSubmit} className="login-form">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Login
                    </motion.h2>
                    <motion.input
                        type="text"
                        value={credentials.username}
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        placeholder="Username"
                        required
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    />
                    <motion.input
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        placeholder="Password"
                        required
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    />
                    <motion.button
                        type="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1 }}
                    >
                        Login
                    </motion.button>
                    <motion.h4
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                    >
                        or
                    </motion.h4>
                    <motion.button
                        type="button"
                        onClick={() => navigate('/register')}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.4 }}
                    >
                        Register
                    </motion.button>
                    {error && (
                        <motion.p
                            className="error-message"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.6 }}
                        >
                            {error}
                        </motion.p>
                    )}
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Login;