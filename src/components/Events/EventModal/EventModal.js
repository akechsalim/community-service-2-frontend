import React from 'react';
import './EventModal.css';

const EventModal = ({event, onUpdate, onClose, mode = 'view'}) => {
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
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{mode === 'view' ? 'Event Details' : 'Edit Event'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" name="name" value={event.name} onChange={handleInputChange}
                               disabled={mode === 'view'}/>
                    </label>
                    <label>
                        Description:
                        <textarea name="description" value={event.description} onChange={handleInputChange}
                                  disabled={mode === 'view'}/>
                    </label>
                    <label>
                        Location:
                        <input type="text" name="location" value={event.location} onChange={handleInputChange}
                               disabled={mode === 'view'}/>
                    </label>
                    <label>
                        Start Time:
                        <input type="datetime-local" name="startTime" value={event.startTime.split('.')[0]}
                               onChange={handleInputChange} disabled={mode === 'view'}/>
                    </label>
                    <label>
                        End Time:
                        <input type="datetime-local" name="endTime" value={event.endTime.split('.')[0]}
                               onChange={handleInputChange} disabled={mode === 'view'}/>
                    </label>
                    {mode === 'edit' &&
                        <button type="submit">Update Event</button>
                    }
                    <button type="button" onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    );
};

export default EventModal;