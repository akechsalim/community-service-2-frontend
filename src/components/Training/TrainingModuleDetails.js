import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import AuthService from '../Auth/Services/authService';
import { useParams } from 'react-router-dom';
import './TrainingModuleDetails.css';

const TrainingModuleDetails = () => {
    const { moduleId } = useParams();
    const [module, setModule] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const fetchModuleDetails = async () => {
            try {
                const authHeaders = AuthService.getAuthHeaders();
                const response = await axios.get(`http://localhost:8080/api/training-modules/${moduleId}`, {
                    headers: authHeaders,
                });
                setModule(response.data);

                const volunteerId = AuthService.getUserId();
                const progressResponse = await axios.get(
                    `http://localhost:8080/api/training-progress/volunteer/${volunteerId}`,
                    { headers: authHeaders }
                );
                const progress = progressResponse.data.find((p) => p.module.id === parseInt(moduleId));
                if (progress && progress.completed) {
                    setIsCompleted(true);
                }
            } catch (error) {
                console.error('Error fetching module details:', error);
            }
        };
        fetchModuleDetails();
    }, [moduleId]);

    const markAsCompleted = async () => {
        try {
            const authHeaders = AuthService.getAuthHeaders();
            const volunteerId = AuthService.getUserId();
            await axios.post(
                'http://localhost:8080/api/training-progress',
                null,
                {
                    headers: authHeaders,
                    params: { volunteerId, moduleId },
                }
            );
            alert('Module marked as completed!');
            setIsCompleted(true);
        } catch (error) {
            console.error('Error marking module as completed:', error);
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

    if (!module) {
        return <motion.p variants={itemVariants}>Loading...</motion.p>;
    }

    return (
        <motion.div
            className="training-module-details"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 variants={itemVariants} custom={0}>
                {module.title}
            </motion.h1>
            <motion.p variants={itemVariants} custom={1}>
                {module.description}
            </motion.p>
            <motion.div className="content" variants={itemVariants} custom={2}>
                <h2>Content</h2>
                <p>{module.content}</p>
            </motion.div>
            {module.resourceUrl && (
                <motion.div className="resources" variants={itemVariants} custom={3}>
                    <h2>Resources</h2>
                    <a href={module.resourceUrl} target="_blank" rel="noopener noreferrer">
                        Download Resource
                    </a>
                </motion.div>
            )}
            {module.videoUrl && (
                <motion.div className="video" variants={itemVariants} custom={4}>
                    <h2>Video</h2>
                    <iframe
                        width="560"
                        height="315"
                        src={module.videoUrl}
                        title="Training Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </motion.div>
            )}
            {!isCompleted && (
                <motion.button
                    onClick={markAsCompleted}
                    variants={itemVariants}
                    custom={5}
                    whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                    whileTap={{ scale: 0.95 }}
                >
                    Mark as Completed
                </motion.button>
            )}
        </motion.div>
    );
};

export default TrainingModuleDetails;