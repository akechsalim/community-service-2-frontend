import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navigation/Navbar';
import Events from './components/Events/Events';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import EventForm from './components/Events/EventForm/EventForm';
import './AppStyles.css'; // Updated import
import AuthService from './components/Auth/Services/authService';
import VolunteerDashboard from './components/Dashboard/Volunteer/VolunteerDashboard';
import AdminDashboard from './components/Dashboard/Admin/AdminDashboard';
import ContactPage from './components/Contact/ContactPage';
import Homepage from './components/Homepage/Homepage';
import TrainingModuleList from './components/Training/TrainingModuleList';
import CreateTrainingModule from './components/Training/CreateTrainingModule';
import VolunteerProgress from './components/Dashboard/Admin/VolunteerProgress';
import TrainingModuleDetails from './components/Training/TrainingModuleDetails';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const headers = AuthService.getAuthHeaders();
                if (!headers.Authorization) throw new Error('No token found');
                const { role } = AuthService.getUserData();
                setIsAuthenticated(true);
                setUserRole(role);
            } catch (error) {
                console.error('Authentication check failed:', error);
                AuthService.clearUserData();
                setIsAuthenticated(false);
                setUserRole(null);
            }
        };
        checkAuthentication();
    }, []);

    const handleLogin = (token, username, role, userId) => {
        AuthService.setUserData(token, username, role, userId);
        setIsAuthenticated(true);
        setUserRole(role);
    };

    const handleLogout = () => {
        AuthService.clearUserData();
        setIsAuthenticated(false);
        setUserRole(null);
    };

    const PrivateRoute = ({ children, allowedRoles }) => {
        if (!isAuthenticated) {
            return (
                <div>
                    <p>Please log in to view this module.</p>
                    <Navigate to="/login" replace state={{ from: window.location.pathname }} />
                </div>
            );
        }
        if (allowedRoles && !allowedRoles.includes(userRole)) {
            return <Navigate to="/" replace />;
        }
        return children;
    };

    // Animation variants for page transitions
    const pageVariants = {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 },
    };

    return (
        <Router>
            <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
            <AnimatePresence mode="wait">
                <Routes>
                    {/* Public Routes */}
                    <Route
                        path="/"
                        element={
                            <motion.div
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                            >
                                <Homepage />
                            </motion.div>
                        }
                    />
                    <Route
                        path="/events"
                        element={
                            <motion.div
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                            >
                                <Events />
                            </motion.div>
                        }
                    />
                    <Route
                        path="/contact"
                        element={
                            <motion.div
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                            >
                                <ContactPage />
                            </motion.div>
                        }
                    />

                    {/* Auth Routes */}
                    <Route
                        path="/login"
                        element={
                            <motion.div
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                            >
                                <Login handleLogin={handleLogin} />
                            </motion.div>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <motion.div
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                            >
                                <Register handleLogin={handleLogin} />
                            </motion.div>
                        }
                    />

                    {/* Restricted Routes with Role-Based Access */}
                    <Route
                        path="/volunteer"
                        element={
                            <PrivateRoute allowedRoles={['VOLUNTEER']}>
                                <motion.div
                                    variants={pageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                >
                                    <VolunteerDashboard />
                                </motion.div>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute allowedRoles={['ADMIN']}>
                                <motion.div
                                    variants={pageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                >
                                    <AdminDashboard userRole={userRole} onLogout={handleLogout} />
                                </motion.div>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/training-modules"
                        element={
                            <PrivateRoute allowedRoles={['VOLUNTEER', 'ADMIN']}>
                                <motion.div
                                    variants={pageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                >
                                    <TrainingModuleList />
                                </motion.div>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/create-training-module"
                        element={
                            <PrivateRoute allowedRoles={['ADMIN']}>
                                <motion.div
                                    variants={pageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                >
                                    <CreateTrainingModule />
                                </motion.div>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <PrivateRoute allowedRoles={['ADMIN']}>
                                <motion.div
                                    variants={pageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                >
                                    <VolunteerProgress />
                                </motion.div>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/training-modules/:moduleId"
                        element={
                            <PrivateRoute allowedRoles={['VOLUNTEER', 'ADMIN']}>
                                <motion.div
                                    variants={pageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                >
                                    <TrainingModuleDetails />
                                </motion.div>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/event-form"
                        element={
                            <PrivateRoute allowedRoles={['ADMIN']}>
                                <motion.div
                                    variants={pageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                >
                                    <EventForm />
                                </motion.div>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </AnimatePresence>
        </Router>
    );
}

export default App;