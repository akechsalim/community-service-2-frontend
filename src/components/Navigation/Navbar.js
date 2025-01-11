import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userRole,onLogout }) => {
    const navigate = useNavigate();

    const handleLogoutClick = (e) => {
        e.preventDefault(); // Prevent the default action of the Link
        onLogout(); // This will set isAuthenticated to false
        navigate("/login"); // Manually navigate to the login page
    };
    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/events">Events</Link></li>
                {userRole === 'ADMIN' && (
                    <>
                        <li><Link to="/admin">Admin Dashboard</Link></li>
                    </>
                )}
                <li><Link to="/login" onClick={handleLogoutClick}>Logout</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;