import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Register.css';

const Register = ({ handleLogin }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '', password: '', role: 'VOLUNTEER' });
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', user);
            handleLogin(response.data.token, response.data.username, response.data.role);
            navigate('/login');
        } catch (error) {
            setError('Registration failed');
        }
    };

    return (
        <motion.div
            className="register-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
        >
            <motion.div
                className="register-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
                <form className="register-form" onSubmit={handleSubmit}>
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Register
                    </motion.h2>
                    <motion.input
                        type="text"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        placeholder="Username"
                        required
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    />
                    <motion.input
                        type="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        placeholder="Password"
                        required
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    />
                    <motion.select
                        value={user.role}
                        onChange={(e) => setUser({ ...user, role: e.target.value })}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1 }}
                    >
                        <option value="VOLUNTEER">Volunteer</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SPONSOR">Sponsor</option>
                        <option value="LOCAL">Local</option>
                    </motion.select>
                    <motion.button
                        type="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                    >
                        Register
                    </motion.button>
                    {error && (
                        <motion.p
                            className="error-message"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.4 }}
                        >
                            {error}
                        </motion.p>
                    )}
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Register;