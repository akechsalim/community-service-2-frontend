import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VolunteerDashboard.css';
import AuthService from "../Auth/Services/authService";

const VolunteerDashboard = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const userId = AuthService.getUserId();
                console.log('Fetched userId:', userId);
                if (!userId) {
                    console.error("User ID not available");
                    return;
                }
                const headers = AuthService.getAuthHeaders();
                console.log('Headers:', headers);
                const response = await axios.get(`http://localhost:8080/api/tasks/volunteer/${userId}`, { headers });
                setTasks(response.data);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            }
        };
        const userId = AuthService.getUserId();
        if (userId) {
            fetchTasks();
        } else {
            console.error("User ID is missing. Please log in again.");
        }
    }, []);

    return (
        <div className="volunteer-dashboard">
            <h2>My Tasks</h2>
            <div className="task-list">
                {tasks.map(task => (
                    <div key={task.id} className="task-card">
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Status: {task.status}</p>
                    </div>
                ))}
            </div>
        </div>
            );
            };

            export default VolunteerDashboard;