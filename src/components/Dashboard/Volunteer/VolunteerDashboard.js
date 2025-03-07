import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './VolunteerDashboard.css';
import AuthService from '../../Auth/Services/authService';

const VolunteerDashboard = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const userId = AuthService.getUserId();
                console.log('Fetched userId:', userId);
                if (!userId) {
                    console.error('User ID not available');
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
            console.error('User ID is missing. Please log in again.');
        }
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.3 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut', type: 'spring', bounce: 0.4, delay: i * 0.2 },
        }),
    };

    return (
        <motion.div
            className="volunteer-dashboard"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h2 variants={itemVariants} custom={0}>
                My Tasks
            </motion.h2>
            <div className="task-list">
                {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            className="task-card"
                            variants={itemVariants}
                            custom={index + 1}
                            whileHover={{ scale: 1.05 }}
                        >
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <p>Status: {task.status}</p>
                        </motion.div>
                    ))
                ) : (
                    <motion.p variants={itemVariants} custom={1}>
                        No tasks assigned yet.
                    </motion.p>
                )}
            </div>
        </motion.div>
    );
};

export default VolunteerDashboard;