import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '', password: '', role: 'VOLUNTEER' });
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/auth/register', user);
            navigate('/login');
        } catch (error) {
            setError('Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input
                type="text"
                value={user.username}
                onChange={(e) => setUser({...user, username: e.target.value})}
                placeholder="Username"
                required
            />
            <input
                type="password"
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})}
                placeholder="Password"
                required
            />
            <select
                value={user.role}
                onChange={(e) => setUser({...user, role: e.target.value})}
            >
                <option value="VOLUNTEER">Volunteer</option>
                <option value="ADMIN">Admin</option>
            </select>
            <button type="submit">Register</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </form>
    );
};

export default Register;