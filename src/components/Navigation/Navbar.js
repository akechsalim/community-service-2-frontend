import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = ({ isAuthenticated, userRole, onLogout }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogoutClick = (e) => {
        e.preventDefault();
        onLogout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const scrollToSection = (id) => {
        navigate('/admin', { replace: true });
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const menuVariants = {
        hidden: { opacity: 0, x: '-100%' },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
        exit: { opacity: 0, x: '-100%', transition: { duration: 0.5, ease: 'easeOut' } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.2 },
        }),
    };

    const dropdownItemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.1 },
        }),
    };

    return (
        <nav className="navbar">
            <button className="hamburger" onClick={toggleMenu}>
                {isMenuOpen ? '✖' : '☰'}
            </button>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="nav-menu"
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <ul className="nav-list">
                            <motion.li custom={0} variants={itemVariants} initial="hidden" animate="visible">
                                <Link to="/" onClick={() => setIsMenuOpen(false)}>home</Link>
                            </motion.li>
                            <motion.li custom={1} variants={itemVariants} initial="hidden" animate="visible">
                                <Link to="/events" onClick={() => setIsMenuOpen(false)}>events</Link>
                            </motion.li>

                            {isAuthenticated && userRole === 'ADMIN' && (
                                <motion.li custom={2} variants={itemVariants} initial="hidden" animate="visible"
                                           className="dropdown">
                                    <button className="dropbtn" onClick={() => toggleMenu('admin')}>
                                        admin dashboard
                                    </button>
                                    <motion.div className="dropdown-content">
                                        <motion.button
                                            custom={0}
                                            variants={dropdownItemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            onClick={() => scrollToSection('volunteers')}
                                            className="dropdown-link"
                                        >
                                            volunteers
                                        </motion.button>
                                        <motion.button
                                            custom={1}
                                            variants={dropdownItemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            onClick={() => scrollToSection('sponsors')}
                                            className="dropdown-link"
                                        >
                                            sponsors
                                        </motion.button>
                                    </motion.div>
                                </motion.li>
                            )}

                            {isAuthenticated && userRole === 'ADMIN' && (
                                <motion.li custom={3} variants={itemVariants} initial="hidden" animate="visible"
                                           className="dropdown">
                                    <button className="dropbtn" onClick={() => toggleMenu('training')}>
                                        Training Module
                                    </button>
                                    <motion.div className="dropdown-content">
                                        <motion.button
                                            custom={0}
                                            variants={dropdownItemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            onClick={() => navigate('/create-training-module')}
                                            className="dropdown-link"
                                        >
                                            Create Training Module
                                        </motion.button>
                                        <motion.button
                                            custom={1}
                                            variants={dropdownItemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            onClick={() => navigate('/training-modules')}
                                            className="dropdown-link"
                                        >
                                            View Training Modules
                                        </motion.button>
                                        <motion.button
                                            custom={2}
                                            variants={dropdownItemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            onClick={() => navigate('/admin/dashboard')}
                                            className="dropdown-link"
                                        >
                                            Admin Dashboard
                                        </motion.button>
                                    </motion.div>
                                </motion.li>
                            )}

                            {isAuthenticated && userRole === 'VOLUNTEER' && (
                                <motion.li custom={2} variants={itemVariants} initial="hidden" animate="visible">
                                    <Link to="/volunteer" onClick={() => setIsMenuOpen(false)}>volunteer dashboard</Link>
                                </motion.li>
                            )}
                            {isAuthenticated && userRole === 'VOLUNTEER' && (
                                <motion.li custom={3} variants={itemVariants} initial="hidden" animate="visible">
                                    <Link to="/training-modules" onClick={() => setIsMenuOpen(false)}>Training Modules</Link>
                                </motion.li>
                            )}
                            <motion.li custom={4} variants={itemVariants} initial="hidden" animate="visible">
                                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>contact page</Link>
                            </motion.li>

                            {/* Profile Link for all authenticated users */}
                            {isAuthenticated && (
                                <motion.li custom={5} variants={itemVariants} initial="hidden" animate="visible">
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>profile</Link>
                                </motion.li>
                            )}

                            <motion.li custom={6} variants={itemVariants} initial="hidden" animate="visible">
                                {isAuthenticated ? (
                                    <Link to="/login" onClick={handleLogoutClick}>logout</Link>
                                ) : (
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>login</Link>
                                )}
                            </motion.li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;