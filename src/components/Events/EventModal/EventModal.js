import React from 'react';
import { motion } from 'framer-motion';
import './EventModal.css';

const EventModal = ({ event, onClose, onUpdate, mode = 'view' }) => {
    const handleInputChange = (e) => {
        if (onUpdate) {
            onUpdate({ ...event, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onUpdate) {
            onUpdate(event);
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: 'easeOut', type: 'spring', bounce: 0.4 },
        },
    };

    return (
        <motion.div
            className="event-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="modal-content">
                <h2>{mode === 'view' ? 'Event Details' : 'Edit Event'}</h2>
                {mode === 'edit' ? (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            value={event.name}
                            onChange={handleInputChange}
                            placeholder="Event Name"
                            required
                        />
                        <textarea
                            name="description"
                            value={event.description}
                            onChange={handleInputChange}
                            placeholder="Event Description"
                            required
                        />
                        <input
                            type="text"
                            name="location"
                            value={event.location}
                            onChange={handleInputChange}
                            placeholder="Event Location"
                            required
                        />
                        <input
                            type="datetime-local"
                            name="startTime"
                            value={event.startTime.split('.')[0]}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="datetime-local"
                            name="endTime"
                            value={event.endTime.split('.')[0]}
                            onChange={handleInputChange}
                            required
                        />
                        <motion.button
                            type="submit"
                            className="modal-button-update"
                            whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Update Event
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={onClose}
                            className="modal-button-cancel"
                            whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Cancel
                        </motion.button>
                    </form>
                ) : (
                    <>
                        <p><strong>Description:</strong> {event.description}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p>
                            <strong>Time:</strong> {new Date(event.startTime).toLocaleString()} -{' '}
                            {new Date(event.endTime).toLocaleString()}
                        </p>
                        <motion.button
                            onClick={onClose}
                            className="modal-button-close"
                            whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Close
                        </motion.button>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default EventModal;