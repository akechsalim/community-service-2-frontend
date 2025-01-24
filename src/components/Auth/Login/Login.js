import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import './Login.css';
import AuthService from "../Services/authService";

const Login = ({handleLogin}) => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({username: '', password: ''});
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
            console.log('Full login response:', response.data); // Log the whole response
            AuthService.setUserData(response.data.token, response.data.username, response.data.role, response.data.userId);
            handleLogin(response.data.token, response.data.username, response.data.role, response.data.userId);
            navigate('/');
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
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
                    <h4>or</h4>
                    <button type={"submit"} onClick={() => navigate('/register')}>Register</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;