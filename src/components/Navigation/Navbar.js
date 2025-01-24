import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Navbar.css';

const Navbar = ({userRole, onLogout}) => {
    const navigate = useNavigate();

    const handleLogoutClick = (e) => {
        e.preventDefault(); // Prevent the default action of the Link
        onLogout(); // This will set isAuthenticated to false
        navigate("/login"); // Manually navigate to the login page
    };
    const scrollToSection = (id) => {
        navigate('/admin', { replace: true }); // Navigate to admin page if not there
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100); // A small delay to ensure navigation has completed
    };
    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li><Link to="/">home</Link></li>
                <li><Link to="/events">events</Link></li>
                {userRole === 'ADMIN' && (
                    <li className="dropdown">
                        <a href="#" className="dropbtn">admin dashboard</a>
                        <div className="dropdown-content">
                            <button onClick={() => scrollToSection('volunteers')} className="dropdown-link">volunteers
                            </button>
                            <button onClick={() => scrollToSection('sponsors')} className="dropdown-link">sponsors
                            </button>
                        </div>
                    </li>
                )}
                {userRole === 'VOLUNTEER' && (
                    <li><Link to="/volunteer">volunteer dashboard</Link></li>
                )}
                <li><Link to="/contact">contact page</Link></li>
                <li><Link to="/login" onClick={handleLogoutClick}>logout</Link></li>

            </ul>
        </nav>
    );
};

export default Navbar;