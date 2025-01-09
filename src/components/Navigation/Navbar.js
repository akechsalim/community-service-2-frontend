import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userRole }) => {
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
                <li><Link to="/logout">Logout</Link></li>  {/* Assuming logout functionality */}
            </ul>
        </nav>
    );
};

export default Navbar;