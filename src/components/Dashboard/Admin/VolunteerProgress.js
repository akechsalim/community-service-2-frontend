import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import AuthService from '../../Auth/Services/authService';
import './VolunteerProgress.css';

const VolunteerProgress = () => {
    const [progress, setProgress] = useState([]);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const authHeaders = AuthService.getAuthHeaders();
                const response = await axios.get('http://localhost:8080/api/admin/dashboard/volunteer-progress', {
                    headers: authHeaders,
                });
                setProgress(response.data);
            } catch (error) {
                console.error('Error fetching volunteer progress:', error);
            }
        };
        fetchProgress();
    }, []);

    const approveCertificate = async (progressId) => {
        try {
            const authHeaders = AuthService.getAuthHeaders();
            const response = await axios.put(
                `http://localhost:8080/api/training-progress/progress/${progressId}/approve-certificate`,
                null,
                { headers: authHeaders }
            );
            alert('Certificate download approved!');
            setProgress(progress.map((p) => (p.id === progressId ? response.data : p)));
        } catch (error) {
            console.error('Error approving certificate:', error);
        }
    };

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
            className="volunteer-progress"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 variants={itemVariants} custom={0}>
                Volunteer Progress
            </motion.h1>
            {progress.length > 0 ? (
                <motion.table variants={itemVariants} custom={1}>
                    <thead>
                    <tr>
                        <th>Volunteer</th>
                        <th>Module</th>
                        <th>Completed</th>
                        <th>Certificate Approved</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {progress.map((p, index) => (
                        <motion.tr key={p.id} variants={itemVariants} custom={index + 2}>
                            <td>{p.volunteer.username}</td>
                            <td>{p.module.title}</td>
                            <td>{p.completed ? 'Yes' : 'No'}</td>
                            <td>{p.certificateApproved ? 'Yes' : 'No'}</td>
                            <td>
                                {!p.certificateApproved && (
                                    <motion.button
                                        onClick={() => approveCertificate(p.id)}
                                        whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Approve Certificate
                                    </motion.button>
                                )}
                            </td>
                        </motion.tr>
                    ))}
                    </tbody>
                </motion.table>
            ) : (
                <motion.p variants={itemVariants} custom={1}>
                    No progress data available.
                </motion.p>
            )}
        </motion.div>
    );
};

export default VolunteerProgress;