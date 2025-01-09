import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import Events from './components/Events/Events';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import EventForm from './components/Events/EventForm/EventForm';
import './styles.css';
import axios from "axios";

function App() {
    const [userRole, setUserRole] = React.useState(localStorage.getItem('role') || null);

    // This would be better if token and role were managed through a state management library like Redux or Context API
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:8080/api/auth/user', {
                headers: {Authorization: `Bearer ${token}`}
            })
                .then(response => {
                    setUserRole(response.data.role);
                    localStorage.setItem('role', response.data.role);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    // Consider redirecting to login or clearing local storage
                });
        }
    }, []);

    return (
        <Router>
            <Navbar userRole={userRole}/>
            <Routes>
                <Route path="/" element={<Events/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/event-form" element={<EventForm/>}/>
            </Routes>
        </Router>
    );
}

export default App;