import React, {useState, useEffect} from 'react';
import axios from 'axios';
import EventList from './EventList/EventList';
import AuthService from "../Auth/Services/authService";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = AuthService.getToken();  // Use AuthService to get the token
                if (token) {
                    const userResponse = await axios.get('http://localhost:8080/api/auth/user', {
                        headers: { Authorization: `Bearer ${token}` }  // Send token in header
                    });
                    setUserRole(userResponse.data.role);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchEvents = async () => {
            try {
                const token = AuthService.getToken();  // Use AuthService to get the token
                const response = await axios.get('http://localhost:8080/api/events', {
                    headers: { Authorization: `Bearer ${token}` }  // Send token in header
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchUserData();
        fetchEvents();
    }, []);

    return (
        <div style={{background: '#f4f4f9', color: '#333'}}>
            <h2 style={{color: '#2c7a7b', textAlign: 'center'}}>Community Events</h2>
            {userRole === 'ADMIN' &&
                <button
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '4px',
                        border: 'none'
                    }}
                    onClick={() => window.location.href = '/event-form'}
                >
                    Create Event
                </button>
            }
            <EventList events={events} userRole={userRole}/>
        </div>
    );
};

export default Events;