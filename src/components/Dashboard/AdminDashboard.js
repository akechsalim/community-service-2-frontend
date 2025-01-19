import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import AuthService from "../Auth/Services/authService";

const AdminDashboard = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [task, setTask] = useState({ title: '', description: '' });



    const fetchVolunteers = async () => {
        try {
            const headers = AuthService.getAuthHeaders();
            const response = await axios.get('http://localhost:8080/api/admin/volunteers', { headers });
            setVolunteers(response.data);
        } catch (error) {
            console.error('Failed to fetch volunteers:', error);
        }
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const handleVolunteerClick = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setShowTaskModal(true);
    };
    const handleAssignTaskClick = () => {
        setShowAssignModal(true);
    };

    const handleCloseModal = () => {
        setSelectedVolunteer(null);
        setShowTaskModal(false);
        setShowAssignModal(false);
    };

    const handleAssignTask = async volunteerId => {
        try {
            const headers = AuthService.getAuthHeaders();
            await axios.post('http://localhost:8080/api/admin/tasks', {
                ...task,
                volunteerId
            }, { headers });
            setShowAssignModal(false);
            setTask({ title: '', description: '' });
            // Optionally, fetch updated volunteer list here
            await fetchVolunteers(); // Assuming fetchVolunteers is defined within the component scope
        } catch (error) {
            console.error('Failed to assign task:', error);
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            const headers = AuthService.getAuthHeaders();
            await axios.post(`http://localhost:8080/api/admin/tasks/${taskId}/complete`, {}, { headers });
            // // Refresh the volunteer data to update the UI
            const response = await axios.get('http://localhost:8080/api/admin/volunteers', { headers });
            setVolunteers(response.data);
            // Optionally, keep the modal open for the updated volunteer if needed
            const updatedVolunteer = response.data.find(v => v.id === selectedVolunteer.id);
            setSelectedVolunteer(updatedVolunteer);
        } catch (error) {
            console.error('Failed to mark task as complete:', error);
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>Volunteers</h2>
            <div className="volunteer-list">
                {volunteers.map(volunteer => (
                    <VolunteerCard
                        key={volunteer.id}
                        volunteer={volunteer}
                        onClick={() => handleVolunteerClick(volunteer)}
                    />
                ))}
            </div>
            <button onClick={handleAssignTaskClick} className="assign-task-button">Assign Task</button>

            {/* Modal for displaying volunteer tasks */}
            {showTaskModal && selectedVolunteer && (
                <TaskModal
                    volunteer={selectedVolunteer}
                    onClose={handleCloseModal}
                    onCompleteTask={handleCompleteTask}
                />
            )}

            {/* Modal for assigning tasks */}
            {showAssignModal && (
                <AssignTaskModal
                    onClose={handleCloseModal}
                    onAssignTask={handleAssignTask}
                    task={task}
                    onTaskChange={setTask}
                    volunteers={volunteers}
                />
            )}
        </div>
    );
};

// Volunteer card component
const VolunteerCard = ({ volunteer, onClick }) => (
    <div className="volunteer-card" onClick={onClick}>
        <h3>{volunteer.username}</h3>
    </div>
);

// Task Modal component
const TaskModal = ({ volunteer, onClose, onCompleteTask }) => (
    <div className="task-modal-overlay">
        <div className="task-modal">
            <h3>{volunteer.username}'s Tasks</h3>
            {volunteer.tasks && volunteer.tasks.length > 0 ? (
                volunteer.tasks.map(task => (
                    <div key={task.id} className="task-item">
                        <h4>{task.title}</h4>
                        <p>Description: {task.description}</p>
                        <p>Status: {task.status}</p>
                        <button onClick={() => onCompleteTask(task.id)}>Complete</button>
                    </div>
                ))
            ) : (
                <p>No tasks assigned yet.</p>
            )}
            <button onClick={onClose}>Close</button>
        </div>
    </div>
);

// Assign Task Modal component
const AssignTaskModal = ({ onClose, onAssignTask, task, onTaskChange, volunteers }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <h3>Assign a Task</h3>
            <input
                value={task.title}
                onChange={(e) => onTaskChange({...task, title: e.target.value})}
                placeholder="Task Title"
                required
            />
            <textarea
                value={task.description}
                onChange={(e) => onTaskChange({...task, description: e.target.value})}
                placeholder="Task Description"
                required
            />
            <div className="available-volunteers-list">
                {volunteers.map(volunteer => (
                    <button key={volunteer.id} onClick={() => onAssignTask(volunteer.id)}>
                        Assign to {volunteer.username}
                    </button>
                ))}
            </div>
            <button onClick={onClose}>Cancel</button>
        </div>
    </div>
);

export default AdminDashboard;