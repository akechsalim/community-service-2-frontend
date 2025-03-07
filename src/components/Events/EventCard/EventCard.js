import React from 'react';
import { motion } from 'framer-motion';
import './EventCard.css';

const EventCard = ({ event, onEdit, onDelete, onDetails, children }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut', type: 'spring', bounce: 0.4 },
        },
    };

    return (
        <motion.div
            className="event-card"
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
        >
            <h2>{event.name}</h2>
            <p className="description">{event.description}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p>
                <strong>Time:</strong> {new Date(event.startTime).toLocaleString()} -{' '}
                {new Date(event.endTime).toLocaleString()}
            </p>
            <div className="event-actions">
                {onDetails && (
                    <motion.button
                        className="details-button"
                        onClick={() => onDetails(event)}
                        whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Get Details
                    </motion.button>
                )}
                {onEdit && (
                    <motion.button
                        className="edit-button"
                        onClick={() => onEdit(event)}
                        whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Edit
                    </motion.button>
                )}
                {onDelete && (
                    <motion.button
                        className="delete-button"
                        onClick={() => onDelete(event.id)}
                        whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Delete
                    </motion.button>
                )}
            </div>
            {children}
        </motion.div>
    );
};

export default EventCard;