import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import AuthService from '../../Auth/Services/authService';
import './EventForm.css';
import { useNavigate } from 'react-router-dom';

const EventForm = () => {
    const [event, setEvent] = useState({
        name: '',
        description: '',
        location: '',
        startTime: '',
        endTime: '',
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/events', event, {
                headers: AuthService.getAuthHeaders(),
            });
            console.log('Event created:', response.data);
            navigate('/events');
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
    };

    const formVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.2 },
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
            className="event-form-container"
            variants={formVariants}
            initial="hidden"
            animate="visible"
        >
            <form className="event-form" onSubmit={handleSubmit}>
                <motion.h2 variants={itemVariants} custom={0}>
                    Create New Event
                </motion.h2>
                <motion.input
                    type="text"
                    name="name"
                    value={event.name}
                    onChange={handleChange}
                    placeholder="Event Name"
                    required
                    variants={itemVariants}
                    custom={1}
                />
                <motion.textarea
                    name="description"
                    value={event.description}
                    onChange={handleChange}
                    placeholder="Description"
                    variants={itemVariants}
                    custom={2}
                />
                <motion.input
                    type="text"
                    name="location"
                    value={event.location}
                    onChange={handleChange}
                    placeholder="Location"
                    required
                    variants={itemVariants}
                    custom={3}
                />
                <motion.input
                    type="datetime-local"
                    name="startTime"
                    value={event.startTime}
                    onChange={handleChange}
                    required
                    variants={itemVariants}
                    custom={4}
                />
                <motion.input
                    type="datetime-local"
                    name="endTime"
                    value={event.endTime}
                    onChange={handleChange}
                    required
                    variants={itemVariants}
                    custom={5}
                />
                <motion.button
                    type="submit"
                    variants={itemVariants}
                    custom={6}
                    whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                    whileTap={{ scale: 0.95 }}
                >
                    Create Event
                </motion.button>
            </form>
        </motion.div>
    );
};

export default EventForm;