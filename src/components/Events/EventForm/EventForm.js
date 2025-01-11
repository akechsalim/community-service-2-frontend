import React, {useState} from 'react';
import axios from 'axios';
import AuthService from "../../Auth/Services/authService";

const EventForm = () => {
    const [event, setEvent] = useState({
        name: '',
        description: '',
        location: '',
        startTime: '',
        endTime: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/events', event,
                {headers: AuthService.getAuthHeaders()});
            console.log('Event created:', response.data); // For debugging
            window.location.href = '/events';
        } catch (error) {
            console.error('Error creating event:', error);
            // Consider showing an error message to the user
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setEvent(prevEvent => ({...prevEvent, [name]: value}));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create New Event</h2>
            <input
                type="text"
                name="name"
                value={event.name}
                onChange={handleChange}
                placeholder="Event Name"
                required
            />
            <textarea
                name="description"
                value={event.description}
                onChange={handleChange}
                placeholder="Description"
            />
            <input
                type="text"
                name="location"
                value={event.location}
                onChange={handleChange}
                placeholder="Location"
                required
            />
            <input
                type="datetime-local"
                name="startTime"
                value={event.startTime}
                onChange={handleChange}
                placeholder="Start Time"
                required
            />
            <input
                type="datetime-local"
                name="endTime"
                value={event.endTime}
                onChange={handleChange}
                placeholder="End Time"
                required
            />
            <button type="submit">Create Event</button>
        </form>
    );
};

export default EventForm;