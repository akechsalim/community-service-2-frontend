import React, {useEffect, useState} from "react";
import axios from "axios";
import EventCard from "../EventCard/EventCard";
import EventForm from "../EventForm/EventForm";
import EventModal from "../EventModal/EventModal";
import './EventList.css';

const EventList = ({events, userRole}) => {
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

    const fetchEvents = () => {
        // This fetch is not needed since events are passed as props
    };

    useEffect(() => {
        // We don't need to fetch events here since they are passed as props
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
                // Update the event in the list without refetching
                const updatedEvents = events.map(e => e.id === response.data.id ? response.data : e);
                events = updatedEvents; // This might not update state directly, consider using a callback from parent
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
                // Remove event from list without refetching
                events = events.filter(e => e.id !== eventId);
                setSuccessMessage("Event deleted successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            })
            .catch((error) => console.error("Error deleting event:", error));
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
                <EventModal event={updatedEvent} onUpdate={handleUpdateEvent} onClose={() => setEditingEvent(null)}
                            mode="edit"/>}
            {selectedEvent && <EventModal event={selectedEvent} onClose={handleCloseDetails} mode="view"/>}
        </div>
    );
};

export default EventList;