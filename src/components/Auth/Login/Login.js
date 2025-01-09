import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role); // Assuming role is returned
            navigate('/events');
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Login</h2>
            <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                placeholder="Username"
                required
            />
            <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
            {error && <p className="error-message">{error}</p>}
        </form>
    );
};

export default Login;