import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventList from './EventList/EventList';
import AuthService from '../Auth/Services/authService';
import './Events.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if user is authenticated
                const headers = AuthService.getAuthHeaders();
                const userData = AuthService.getUserData();
                const hasToken = !!headers.Authorization;

                setIsAuthenticated(hasToken);
                setUserRole(hasToken ? userData.role : null);

                // Fetch events (publicly accessible, no headers required)
                const eventsResponse = await axios.get('http://localhost:8080/api/events', {
                    headers: {
                        'Content-Type': 'application/json', // Basic header, no auth required
                    },
                });
                setEvents(eventsResponse.data);
            } catch (error) {
                console.error('Error fetching events:', error);
                // Only redirect to login if the error is explicitly authentication-related
                if (error.response && error.response.status === 401 && isAuthenticated) {
                    AuthService.clearUserData();
                    window.location.href = '/login';
                }
            }
        };

        fetchData();
    }, []);

    const handleEventsUpdate = (updatedEvents) => setEvents(updatedEvents);

    return (
        <div className="events-page">
            <h1 className="events-title">Community Events</h1>
            {isAuthenticated && userRole === 'ADMIN' && (
                <button
                    className="create-event-button"
                    onClick={() => window.location.href = '/event-form'}
                >
                    Create Event
                </button>
            )}
            <EventList events={events} userRole={userRole} onEventsUpdate={handleEventsUpdate} />
        </div>
    );
};

export default Events;