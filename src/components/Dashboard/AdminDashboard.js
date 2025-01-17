import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import AuthService from "../Auth/Services/authService";

const AdminDashboard = () => {
    const [volunteers, setVolunteers] = useState([]);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const headers = AuthService.getAuthHeaders();
                const response = await axios.get('http://localhost:8080/api/admin/volunteers', { headers });
                setVolunteers(response.data);
            } catch (error) {
                console.error('Failed to fetch volunteers:', error);
            }
        };
        fetchVolunteers();
    }, []);

    return (
        <div className="admin-dashboard">
            <h2>Volunteers</h2>
            <div className="volunteer-list">
                {volunteers.map(volunteer => (
                    <VolunteerCard key={volunteer.id} volunteer={volunteer} />
                ))}
            </div>
        </div>
    );
};

const VolunteerCard = ({ volunteer }) => {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [task, setTask] = useState({ title: '', description: '' });

    const handleTaskClick = () => setIsTaskModalOpen(true);
    const handleClose = () => setIsTaskModalOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const headers = AuthService.getAuthHeaders();
            await axios.post('http://localhost:8080/api/admin/tasks', {
                ...task,
                volunteerId: volunteer.id
            },{headers});
            handleClose();
            // Optionally, fetch updated volunteer list
        } catch (error) {
            console.error('Failed to assign task:', error);
        }
    };

    return (
        <div className="volunteer-card">
            <h3>{volunteer.username} {volunteer.hasTask ? '(Assigned)' : '(Available)'}</h3>
            <button onClick={handleTaskClick}>Assign Task</button>
            {isTaskModalOpen && (
                <div className="task-modal">
                    <form onSubmit={handleSubmit} className="task-form">
                        <input
                            value={task.title}
                            onChange={(e) => setTask({...task, title: e.target.value})}
                            placeholder="Task Title"
                            required
                        />
                        <textarea
                            value={task.description}
                            onChange={(e) => setTask({...task, description: e.target.value})}
                            placeholder="Task Description"
                            required
                        />
                        <button type="submit">Save Task</button>
                        <button type="button" onClick={handleClose}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;