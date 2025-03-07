import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import EventCard from '../EventCard/EventCard';
import EventModal from '../EventModal/EventModal';
import './EventList.css';
import AuthService from '../../Auth/Services/authService';

const EventList = ({ events, userRole, onEventsUpdate }) => {
    const [editingEvent, setEditingEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [updatedEvent, setUpdatedEvent] = useState({
        name: '',
        description: '',
        location: '',
        startTime: '',
        endTime: '',
    });
    const [sponsorModalOpen, setSponsorModalOpen] = useState(false);
    const [sponsorAmount, setSponsorAmount] = useState('');

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

    const openSponsorModal = (event) => {
        setSelectedEvent(event);
        setSponsorModalOpen(true);
    };

    const closeSponsorModal = () => {
        setSponsorModalOpen(false);
        setSponsorAmount('');
    };

    const handleSponsorship = async () => {
        if (selectedEvent && sponsorAmount) {
            try {
                await axios.post(
                    `http://localhost:8080/api/events/${selectedEvent.id}/sponsor`,
                    { amount: parseFloat(sponsorAmount) },
                    { headers: AuthService.getAuthHeaders() }
                );
                setSponsorModalOpen(false);
                setSponsorAmount('');
            } catch (error) {
                console.error('Error sponsoring event:', error);
            }
        }
    };

    const handleEditClick = (event) => {
        setEditingEvent(event);
        setUpdatedEvent({
            ...event,
            startTime: event.startTime.split('.')[0],
            endTime: event.endTime.split('.')[0],
        });
    };

    const handleUpdateEvent = (updatedEvent) => {
        axios
            .put(`http://localhost:8080/api/events/${editingEvent.id}`, updatedEvent, {
                headers: AuthService.getAuthHeaders(),
            })
            .then((response) => {
                setSuccessMessage('Event updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                setEditingEvent(null);
                const updatedEvents = events.map((e) => (e.id === response.data.id ? response.data : e));
                onEventsUpdate(updatedEvents);
            })
            .catch((error) => console.error('Error updating event:', error));
    };

    const handleShowDetails = (event) => {
        if (!sponsorModalOpen) {
            setSelectedEvent(event);
        }
    };

    const handleCloseDetails = () => {
        setSelectedEvent(null);
    };

    const handleDelete = (eventId) => {
        axios
            .delete(`http://localhost:8080/api/events/${eventId}`, {
                headers: AuthService.getAuthHeaders(),
            })
            .then(() => {
                const updatedEvents = events.filter((e) => e.id !== eventId);
                setSuccessMessage('Event deleted successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                onEventsUpdate(updatedEvents);
            })
            .catch((error) => console.error('Error deleting event:', error));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setUpdatedEvent((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <motion.div
            className="event-list-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 variants={itemVariants} custom={0}>
                Community Events
            </motion.h1>
            {successMessage && (
                <motion.div className="success-message" variants={itemVariants} custom={1}>
                    {successMessage}
                </motion.div>
            )}
            <div className="event-cards">
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onEdit={userRole === 'ADMIN' ? handleEditClick : undefined}
                            onDelete={userRole === 'ADMIN' ? handleDelete : undefined}
                            onDetails={handleShowDetails}
                        >
                            {userRole === 'SPONSOR' && (
                                <motion.button
                                    onClick={() => openSponsorModal(event)}
                                    whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Sponsor
                                </motion.button>
                            )}
                        </EventCard>
                    ))
                ) : (
                    <motion.p variants={itemVariants} custom={2}>
                        No events available.
                    </motion.p>
                )}
            </div>

            {editingEvent && (
                <motion.div
                    className="edit-modal open"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="modal-content">
                        <h2>Edit Event</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateEvent(updatedEvent);
                            }}
                        >
                            <input
                                type="text"
                                name="name"
                                value={updatedEvent.name}
                                onChange={handleEditChange}
                                placeholder="Event Name"
                                required
                            />
                            <textarea
                                name="description"
                                value={updatedEvent.description}
                                onChange={handleEditChange}
                                placeholder="Event Description"
                                required
                            />
                            <input
                                type="text"
                                name="location"
                                value={updatedEvent.location}
                                onChange={handleEditChange}
                                placeholder="Event Location"
                                required
                            />
                            <input
                                type="datetime-local"
                                name="startTime"
                                value={updatedEvent.startTime}
                                onChange={handleEditChange}
                                required
                            />
                            <input
                                type="datetime-local"
                                name="endTime"
                                value={updatedEvent.endTime}
                                onChange={handleEditChange}
                                required
                            />
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Update Event
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={() => setEditingEvent(null)}
                                whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            )}
            {selectedEvent && !sponsorModalOpen && (
                <EventModal event={selectedEvent} onClose={handleCloseDetails} mode="view" />
            )}
            {sponsorModalOpen && (
                <motion.div
                    className="sponsor-modal"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="modal-content">
                        <h2>Sponsor Event</h2>
                        <input
                            type="number"
                            value={sponsorAmount}
                            onChange={(e) => setSponsorAmount(e.target.value)}
                            placeholder="Sponsorship Amount"
                        />
                        <motion.button
                            onClick={handleSponsorship}
                            whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Confirm Sponsorship
                        </motion.button>
                        <motion.button
                            onClick={closeSponsorModal}
                            whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Cancel
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default EventList;