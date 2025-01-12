import React, {useState, useEffect} from 'react';
import axios from 'axios';
import EventList from './EventList/EventList';
import AuthService from "../Auth/Services/authService";

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
        <div style={{background: '#f4f4f9', color: '#333',textAlign: 'center'}}>
            <h2 style={{color: '#2c7a7b', textAlign: 'center'}}>Community Events</h2>
            {role === 'ADMIN' &&
                <button
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '10px',
                    }}
                    onClick={() => window.location.href = '/event-form'}
                >
                    Create Event
                </button>
            }
            <EventList events={events} userRole={role} onEventsUpdate={handleEventsUpdate}/>
        </div>
    );
};

export default Events;