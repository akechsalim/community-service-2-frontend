import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import HomeEventCard from './HomeEventCard';
import { useNavigate } from 'react-router-dom';
import communityServiceImage from '../../assets/images/communityServiceImage.jpg'; // Adjust path
import './Homepage.css';

const Homepage = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/events', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    const displayedEvents = events.slice(0, 2);

    const handleLoginRedirect = () => {
        navigate('/login');
    };

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
            className="homepage"
            style={{
                background: `linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${communityServiceImage}) no-repeat center center/cover`,
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="hero-section">
                <motion.div className="hero-content" variants={itemVariants} custom={0}>
                    <motion.h1 className="hero-headline" variants={itemVariants} custom={1}>
                        Empowering Communities, Simplifying Service
                    </motion.h1>
                    <motion.p className="hero-subheadline" variants={itemVariants} custom={2}>
                        Manage Your Community Service Activities with Ease
                    </motion.p>
                    <motion.button
                        className="cta-button"
                        onClick={handleLoginRedirect}
                        variants={itemVariants}
                        custom={3}
                        whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Log in for Training Modules and Dashboard
                    </motion.button>
                </motion.div>
            </div>

            <motion.div className="events-section" variants={itemVariants} custom={4}>
                <motion.h2 variants={itemVariants} custom={5}>
                    Upcoming Events
                </motion.h2>
                <div className="event-cards-2">
                    {displayedEvents.length > 0 ? (
                        displayedEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                variants={itemVariants}
                                custom={6 + index}
                            >
                                <HomeEventCard
                                    event={event}
                                    onDetails={() => navigate(`/events/${event.id}`)}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <motion.p variants={itemVariants} custom={6}>
                            No upcoming events.
                        </motion.p>
                    )}
                </div>
                {events.length > 2 && (
                    <motion.button
                        className="more-button"
                        onClick={() => navigate('/events')}
                        variants={itemVariants}
                        custom={8}
                        whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        View More Events
                    </motion.button>
                )}
            </motion.div>
        </motion.div>
    );
};

export default Homepage;