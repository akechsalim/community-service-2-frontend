// src/components/Events/Events.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventList from './EventList/EventList';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const userResponse = await axios.get('http://localhost:8080/api/auth/user', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUserRole(userResponse.data.role);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Handle authentication errors, maybe redirect to login
            }
        };

        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/events', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
                // Consider displaying an error message to the user
            }
        };

        fetchUserData();
        fetchEvents();
    }, []);

    return (
        <div>
            <h2>Community Events</h2>
            {userRole === 'ADMIN' && <button onClick={() => window.location.href = '/event-form'}>Create Event</button>}
            <EventList events={events} userRole={userRole} />
        </div>
    );
};

export default Events;