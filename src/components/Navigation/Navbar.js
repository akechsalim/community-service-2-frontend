import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Navbar.css';

const Navbar = ({userRole, onLogout}) => {
    const navigate = useNavigate();

    const handleLogoutClick = (e) => {
        e.preventDefault();
        onLogout();
        navigate("/login");
    };

    const scrollToSection = (id) => {
        navigate('/admin', {replace: true});
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }, 100);
    };

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li><Link to="/">home</Link></li>
                <li><Link to="/events">events</Link></li>

                {userRole === 'ADMIN' && (
                    <li className="dropdown">
                        <button onClick={(e) => e.preventDefault()} className="dropbtn">admin dashboard</button>
                        <div className="dropdown-content">
                            <button onClick={() => scrollToSection('volunteers')} className="dropdown-link">volunteers
                            </button>
                            <button onClick={() => scrollToSection('sponsors')} className="dropdown-link">sponsors
                            </button>
                        </div>
                    </li>
                )}

                {userRole === 'ADMIN' && (
                    <li className="dropdown">
                        <button onClick={(e) => e.preventDefault()} className="dropbtn">Training Module</button>
                        <div className="dropdown-content">
                            <button onClick={() => navigate('/create-training-module')} className="dropdown-link">Create
                                Training Module
                            </button>
                            <button onClick={() => navigate('/training-modules')} className="dropdown-link">View
                                Training Modules
                            </button>
                            <button onClick={() => navigate('/admin/dashboard')} className="dropdown-link">Admin
                                Dashboard
                            </button>
                        </div>
                    </li>
                )}

                {userRole === 'VOLUNTEER' && (<li><Link to="/volunteer">volunteer dashboard</Link></li>)}
                {userRole === 'VOLUNTEER' && (<li><Link to="/training-modules">Training Modules</Link></li>)}

                <li><Link to="/contact">contact page</Link></li>
                <li><Link to="/login" onClick={handleLogoutClick}>logout</Link></li>

            </ul>
        </nav>
    );
};

export default Navbar;