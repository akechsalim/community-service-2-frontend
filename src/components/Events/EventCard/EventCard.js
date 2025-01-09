import React from 'react';
import './EventCard.css';

const EventCard = ({ event, onEdit, onDelete, onDetails }) => {
    return (
        <div className="event-card">
            <h2>{event.name}</h2>
            <p className="description">{event.description}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Time:</strong> {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}</p>
            <div className="event-actions">
                {onDetails && <button className="details-button" onClick={() => onDetails(event)}>Get Details</button>}
                {onEdit && <button className="edit-button" onClick={() => onEdit(event)}>Edit</button>}
                {onDelete && <button className="delete-button" onClick={() => onDelete(event.id)}>Delete</button>}
            </div>
        </div>
    );
};

export default EventCard;