import React, {useState, useEffect} from 'react';
import axios from 'axios';
import EventList from './EventList/EventList';
import AuthService from "../Auth/Services/authService";
import './Events.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const {role} = AuthService.getUserData(); // Retrieve role here

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = AuthService.getAuthHeaders();
                if (!headers.Authorization) {
                    throw new Error("No token found");
                }

                const eventsResponse = await axios.get('http://localhost:8080/api/events', {headers});
                setEvents(eventsResponse.data);

            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response && error.response.status === 401) {
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
            {role === 'ADMIN' && (
                <button
                    className="create-event-button"
                    onClick={() => window.location.href = '/event-form'}
                >
                    Create Event
                </button>
            )}
            <EventList events={events} userRole={role} onEventsUpdate={handleEventsUpdate}/>
        </div>
    );
};

export default Events;