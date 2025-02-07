import React, {useEffect, useState} from 'react';
import axios from 'axios';
import HomeEventCard from "./HomeEventCard";
import {useNavigate} from 'react-router-dom';
import './Homepage.css';
import AuthService from '../Auth/Services/authService';

const Homepage = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch events from the backend
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/events', {
                    headers: AuthService.getAuthHeaders(),
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    // Display only the first 2 events
    const displayedEvents = events.slice(0, 2);

    return (
        <div className="homepage">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-headline">Empowering Communities, Simplifying Service</h1>
                    <p className="hero-subheadline">Manage Your Community Service Activities with Ease</p>
                    <a href="/signup" className="cta-button">Start Your Trial</a>
                </div>
            </div>

            {/* Events Section */}
            <div className="events-section">
                <h2>Upcoming Events</h2>
                <div className="event-cards-2">
                    {displayedEvents.length > 0 ? (
                        displayedEvents.map((event) => (
                            <HomeEventCard
                                key={event.id}
                                event={event}
                                onDetails={() => navigate(`/events/${event.id}`)} // Redirect to event details
                            />
                        ))
                    ) : (
                        <p>No upcoming events.</p>
                    )}
                </div>
                {events.length > 2 && (
                    <button className="more-button" onClick={() => navigate('/events')}>
                        View More Events
                    </button>
                )}
            </div>
        </div>
    );
};

export default Homepage;