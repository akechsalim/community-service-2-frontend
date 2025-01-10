import React from 'react';
import './EventModal.css';

const EventModal = ({event, onClose, onUpdate, mode = 'view'}) => {
    // Handle changes in form inputs
    const handleInputChange = (e) => {
        if (onUpdate) {
            onUpdate({...event, [e.target.name]: e.target.value});
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onUpdate) {
            onUpdate(event);
        }
    };

    return (
        <div className="event-modal">
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
                        <button type="submit">Update Event</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </form>
                ) : (
                    <>
                        <p><strong>Description:</strong> {event.description}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p>
                            <strong>Time:</strong> {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                        </p>
                        <button onClick={onClose}>Close</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default EventModal;