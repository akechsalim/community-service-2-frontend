import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
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
                const headers = AuthService.getAuthHeaders();
                const userData = AuthService.getUserData();
                const hasToken = !!headers.Authorization;

                setIsAuthenticated(hasToken);
                setUserRole(hasToken ? userData.role : null);

                const eventsResponse = await axios.get('http://localhost:8080/api/events', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setEvents(eventsResponse.data);
            } catch (error) {
                console.error('Error fetching events:', error);
                if (error.response && error.response.status === 401 && isAuthenticated) {
                    AuthService.clearUserData();
                    window.location.href = '/login';
                }
            }
        };

        fetchData();
    }, []);

    const handleEventsUpdate = (updatedEvents) => setEvents(updatedEvents);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.3 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut', type: 'spring', bounce: 0.4, delay: i * 0.2 },
        }),
    };

    return (
        <motion.div
            className="events-page"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 className="events-title" variants={itemVariants} custom={0}>
                Community Events
            </motion.h1>
            {isAuthenticated && userRole === 'ADMIN' && (
                <motion.button
                    className="create-event-button"
                    onClick={() => window.location.href = '/event-form'}
                    variants={itemVariants}
                    custom={1}
                    whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                    whileTap={{ scale: 0.95 }}
                >
                    Create Event
                </motion.button>
            )}
            <EventList events={events} userRole={userRole} onEventsUpdate={handleEventsUpdate} />
        </motion.div>
    );
};

export default Events;