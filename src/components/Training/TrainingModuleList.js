import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import AuthService from '../Auth/Services/authService';
import './TrainingModuleList.css';
import { Link } from 'react-router-dom';

const TrainingModuleList = () => {
    const [modules, setModules] = useState([]);
    const [progress, setProgress] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authHeaders = AuthService.getAuthHeaders();
                const volunteerId = AuthService.getUserId();

                const modulesResponse = await axios.get('http://localhost:8080/api/training-modules', {
                    headers: authHeaders,
                });
                setModules(modulesResponse.data);

                const progressResponse = await axios.get(
                    `http://localhost:8080/api/training-progress/volunteer/${volunteerId}`,
                    { headers: authHeaders }
                );
                setProgress(progressResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const isModuleCompleted = (moduleId) =>
        progress.some((p) => p.module.id === moduleId && p.completed);

    const downloadCertificate = async (moduleId) => {
        try {
            const authHeaders = AuthService.getAuthHeaders();
            const volunteerId = AuthService.getUserId();
            const progressResponse = await axios.get(
                `http://localhost:8080/api/training-progress/volunteer/${volunteerId}`,
                { headers: authHeaders }
            );
            const progress = progressResponse.data.find((p) => p.module.id === parseInt(moduleId));
            if (!progress || !progress.certificateApproved) {
                alert('Certificate download not approved yet.');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/certificates/generate', {
                headers: authHeaders,
                params: { volunteerId, moduleId },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'certificate.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading certificate:', error);
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
            className="training-module-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 variants={itemVariants} custom={0}>
                Training Modules
            </motion.h1>
            {modules.length > 0 ? (
                modules.map((module, index) => (
                    <motion.div
                        key={module.id}
                        className="module-card"
                        variants={itemVariants}
                        custom={index + 1}
                        whileHover={{ scale: 1.05 }}
                    >
                        <h2>
                            <Link to={`/training-modules/${module.id}`}>{module.title}</Link>
                        </h2>
                        <p>{module.description}</p>
                        {isModuleCompleted(module.id) ? (
                            <motion.button
                                onClick={() => downloadCertificate(module.id)}
                                whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Download Certificate
                            </motion.button>
                        ) : (
                            <p>Complete the module to download the certificate.</p>
                        )}
                    </motion.div>
                ))
            ) : (
                <motion.p variants={itemVariants} custom={1}>
                    No training modules available.
                </motion.p>
            )}
        </motion.div>
    );
};

export default TrainingModuleList;