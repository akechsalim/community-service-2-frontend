import React from 'react';
import { motion } from 'framer-motion';
import './HomeEventCard.css';

const HomeEventCard = ({ event, onDetails }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut', type: 'spring', bounce: 0.4 },
        },
    };

    return (
        <motion.div
            className="home-event-card"
            variants={cardVariants}
            whileHover={{ scale: 1.05, boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)' }}
            whileTap={{ scale: 0.95 }}
        >
            <h2>{event.name}</h2>
            <p className="home-description">{event.description}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Time:</strong> {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}</p>
            <div className="home-event-actions">
                {onDetails && (
                    <motion.button
                        className="home-details-button"
                        onClick={onDetails}
                        whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Get Details
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

export default HomeEventCard;