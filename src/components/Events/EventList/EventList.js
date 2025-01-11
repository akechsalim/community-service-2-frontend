import React, {useState} from 'react';
import axios from 'axios';
import EventCard from '../EventCard/EventCard';
import EventModal from '../EventModal/EventModal';
import './EventList.css';
import AuthService from "../../Auth/Services/authService";

const EventList = ({ events, userRole, onEventsUpdate }) => {
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
            .put(`http://localhost:8080/api/events/${editingEvent.id}`, updatedEvent,
                {headers: AuthService.getAuthHeaders()}
            )
            .then((response) => {
                setSuccessMessage("Event updated successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
                setEditingEvent(null);
                // Call the parent component's update function

                // Update parent events
                const updatedEvents = events.map((e) =>
                    e.id === response.data.id ? response.data : e
                );
                onEventsUpdate(updatedEvents);

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
            .delete(`http://localhost:8080/api/events/${eventId}`,
                {headers: AuthService.getAuthHeaders()}
            )
            .then(() => {
                const updatedEvents = events.filter((e) => e.id !== eventId);

                // Call the parent component's update function after deletion


                setSuccessMessage("Event deleted successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
                // You might want to use a callback to update events in the parent component
                onEventsUpdate(updatedEvents); // Notify parent of update
            })
            .catch((error) => console.error("Error deleting event:", error));
    };

    // Handling changes in the edit form
    const handleEditChange = (e) => {
        const {name, value} = e.target;
        setUpdatedEvent((prev) => ({ ...prev, [name]: value }));
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