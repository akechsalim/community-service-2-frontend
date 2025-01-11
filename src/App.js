import React, {useState} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import Events from './components/Events/Events';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import EventForm from './components/Events/EventForm/EventForm';
import './styles.css';
import AuthService from "./components/Auth/Services/authService";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const {role} = AuthService.getUserData(); // Retrieve role using AuthService

    // This would be better if token and role were managed through a state management library like Redux or Context API
    React.useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const headers = AuthService.getAuthHeaders();
                if (!headers.Authorization) {
                    throw new Error("No token found");
                }

                /// Check if token is valid, possibly by making an API call to verify
                setIsAuthenticated(true); // If token is present, consider user authenticated
            } catch (error) {
                console.error('Authentication check failed:', error);
                if (error.message === "No token found" || (error.response && error.response.status === 401)) {
                    AuthService.clearUserData();
                    setIsAuthenticated(false);
                }
            }
        };

        checkAuthentication();
    }, []);
    // Helper function to handle login
    const handleLogin = (token, username, role) => {
        AuthService.setUserData(token, username, role);
        setIsAuthenticated(true);
    };
    // Logout function
    const handleLogout = () => {
        AuthService.clearUserData();
        setIsAuthenticated(false);
    };

    const PrivateRoute = ({children}) => {
        return isAuthenticated ? children : <Navigate to="/login"/>;
    };

    return (
        <Router>
            {isAuthenticated && <Navbar userRole={role} onLogout={handleLogout} />}
            <Routes>
                <Route path="/login" element={<Login handleLogin={handleLogin}/>}/>
                <Route path="/register" element={<Register handleLogin={handleLogin}/>}/>
                <Route path="/" element={ // Home page, could be a different component or simple content
                    <PrivateRoute>
                        <div style={{textAlign: 'center', padding: '20px'}}>
                            <h1>Welcome to the Event Management System</h1>
                            <p>Please use the navigation bar to access events.</p>
                        </div>
                    </PrivateRoute>
                } />
                <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
                <Route path="/event-form" element={<PrivateRoute><EventForm /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;