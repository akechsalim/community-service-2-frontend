import React, {useState} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import Events from './components/Events/Events';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import EventForm from './components/Events/EventForm/EventForm';
import './styles.css';
import AuthService from "./components/Auth/Services/authService";
import VolunteerDashboard from "./components/Dashboard/VolunteerDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import ContactPage from "./components/Contact/ContactPage";
import Homepage from "./components/Homepage/Homepage";
import TrainingModules from "./components/Training/TrainingModules";
import TrainingModuleList from "./components/Training/TrainingModuleList";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const {role} = AuthService.getUserData();

    React.useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const headers = AuthService.getAuthHeaders();
                if (!headers.Authorization) {
                    throw new Error("No token found");
                }
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
    const handleLogin = (token, username, role,userId) => {
        AuthService.setUserData(token, username, role,userId);
        setIsAuthenticated(true);
    };
    // Logout function
    const handleLogout = () => {
        AuthService.clearUserData();
        setIsAuthenticated(false);
    };

    const PrivateRoute = ({ children }) => {
        if (!isAuthenticated) return <Navigate to="/login" />;
        return children;
    };

    return (
        <Router>
            {isAuthenticated && <Navbar userRole={role} onLogout={handleLogout}/>}
            <Routes>
                <Route path="/login" element={<Login handleLogin={handleLogin}/>}/>
                <Route path="/register" element={<Register handleLogin={handleLogin}/>}/>
                <Route path="/" element={ // Home page, could be a different component or simple content
                    <PrivateRoute>
                        <Homepage/>
                    </PrivateRoute>
                }/>
                <Route path="/events" element={<Events/>}/>
                <Route path="/event-form" element={<EventForm/>}/>
                <Route path="/admin" element={
                    <PrivateRoute>
                        <AdminDashboard userRole={role} onLogout={handleLogout}/>
                    </PrivateRoute>
                } />
                <Route path="/training-modules" element={
                    <PrivateRoute>
                        {role === 'ADMIN' ? <TrainingModules /> : <Navigate to="/" />}
                    </PrivateRoute>
                } />
                <Route path="/training-modules" element={<TrainingModuleList />} />
                <Route path="/volunteer" element={
                    <PrivateRoute>
                        <VolunteerDashboard  />
                    </PrivateRoute>
                } />
                <Route path="/contact" element={<ContactPage />} />
            </Routes>
        </Router>
    );
}

export default App;