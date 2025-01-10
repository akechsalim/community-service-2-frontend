import React, {useEffect, useState} from 'react';
import axios from 'axios';
import EventCard from '../EventCard/EventCard';
import EventModal from '../EventModal/EventModal';
import './EventList.css';

const EventList = ({events, userRole}) => {
    // State for managing the event being edited or viewed in detail
    const [editingEvent, setEditingEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [updatedEvent, setUpdatedEvent] = useState({
        name: "",
        description: "",
        location: "",
        startTime: "",
        endTime: "",
    });

    // Placeholder for event fetching, not needed as events are passed via props
    const fetchEvents = () => {
        // This fetch is not needed since events are passed as props
    };

    useEffect(() => {
        // No need to fetch events since they are passed as props
    }, []);

    const handleEditClick = (event) => {
        setEditingEvent(event);
        setUpdatedEvent({
            ...event,
            startTime: event.startTime.split(".")[0],
            endTime: event.endTime.split(".")[0],
        });
    };

    const handleUpdateEvent = (updatedEvent) => {
        axios
            .put(`http://localhost:8080/api/events/${editingEvent.id}`, updatedEvent, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })
            .then((response) => {
                setSuccessMessage("Event updated successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
                setEditingEvent(null);
                // Update the event in the list without refetching.
                // Note: This doesn't change the parent component's state directly
                const updatedEvents = events.map(e => e.id === response.data.id ? response.data : e);
                // If you want to update the parent's state, you'd probably use a callback prop
            })
            .catch((error) => console.error("Error updating event:", error));
    };

    const handleShowDetails = (event) => {
        setSelectedEvent(event);
    };

    const handleCloseDetails = () => {
        setSelectedEvent(null);
    };

    const handleDelete = (eventId) => {
        axios
            .delete(`http://localhost:8080/api/events/${eventId}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })
            .then(() => {
                // Remove event from list without refetching.
                // Again, this doesn't update the parent component's state directly
                const newEvents = events.filter(e => e.id !== eventId);
                setSuccessMessage("Event deleted successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
                // You might want to use a callback to update events in the parent component
            })
            .catch((error) => console.error("Error deleting event:", error));
    };

    // Handling changes in the edit form
    const handleEditChange = (e) => {
        const {name, value} = e.target;
        setUpdatedEvent(prevEvent => ({...prevEvent, [name]: value}));
    };

    return (
        <div className="event-list-container">
            <h1>Community Events</h1>
            {successMessage && <div className="success-message">{successMessage}</div>}
            <div className="event-cards">
                {events.length > 0 ?
                    events.map(event => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onEdit={userRole === 'ADMIN' ? handleEditClick : undefined}
                            onDelete={userRole === 'ADMIN' ? handleDelete : undefined}
                            onDetails={handleShowDetails}
                        />
                    )) :
                    <p>No events available.</p>
                }
            </div>
            {editingEvent &&
                <div className={`edit-modal ${editingEvent ? 'open' : ''}`}>
                    <div className="modal-content">
                        <h2>Edit Event</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateEvent(updatedEvent);
                        }}>
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
                            <button type="submit">Update Event</button>
                            <button type="button" onClick={() => setEditingEvent(null)}>Cancel</button>
                        </form>
                    </div>
                </div>
            }
            {selectedEvent &&
                <EventModal event={selectedEvent} onClose={handleCloseDetails} mode="view"/>
            }
        </div>
    );
};

export default EventList;