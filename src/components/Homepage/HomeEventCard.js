// HomeEventCard.js
import React from 'react';
import './HomeEventCard.css'; // Import the updated CSS

const HomeEventCard = ({ event, onDetails }) => {
    return (
        <div className="home-event-card">
            <h2>{event.name}</h2>
            <p className="home-description">{event.description}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Time:</strong> {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}</p>
            <div className="home-event-actions">
                {onDetails && (
                    <button className="home-details-button" onClick={onDetails}>
                        Get Details
                    </button>
                )}
            </div>
        </div>
    );
};

export default HomeEventCard;