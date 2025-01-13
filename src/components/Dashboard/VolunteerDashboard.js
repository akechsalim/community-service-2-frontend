import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VolunteerDashboard.css';
import AuthService from "../Auth/Services/authService";

const VolunteerDashboard = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const userId = AuthService.getUserId(); // Ensure this method exists and returns a valid ID
                if (!userId) {
                    console.error("User ID not available");
                    return; // or handle this case appropriately, maybe redirect to login
                }
                const headers = AuthService.getAuthHeaders();
                const response = await axios.get(`http://localhost:8080/api/tasks/volunteer/${userId}`, { headers });
                setTasks(response.data);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    return (
        <div className="volunteer-dashboard">
            <h2>My Tasks</h2>
            {tasks.map(task => (
                <div key={task.id} className="task-card">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>Status: {task.status}</p>
                </div>
            ))}
        </div>
    );
};

export default VolunteerDashboard;