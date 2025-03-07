import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import AuthService from '../Auth/Services/authService';
import './CreateTrainingModule.css';

const CreateTrainingModule = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        resourceUrl: '',
        videoUrl: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = { ...formData, createdBy: AuthService.getUserId() };
            const authHeaders = AuthService.getAuthHeaders();
            const response = await axios.post(
                'http://localhost:8080/api/training-modules',
                dataToSubmit,
                { headers: authHeaders }
            );
            alert('Training module created successfully!');
            console.log(response.data);
        } catch (error) {
            console.error('Error creating training module:', error);
            alert('Failed to create training module.');
        }
    };

    const formVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.2 },
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
            className="create-training-module"
            variants={formVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 variants={itemVariants} custom={0}>
                Create New Training Module
            </motion.h1>
            <form onSubmit={handleSubmit}>
                <motion.div variants={itemVariants} custom={1}>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </motion.div>
                <motion.div variants={itemVariants} custom={2}>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </motion.div>
                <motion.div variants={itemVariants} custom={3}>
                    <label>Content:</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    />
                </motion.div>
                <motion.div variants={itemVariants} custom={4}>
                    <label>Resource URL:</label>
                    <input
                        type="url"
                        name="resourceUrl"
                        value={formData.resourceUrl}
                        onChange={handleChange}
                    />
                </motion.div>
                <motion.div variants={itemVariants} custom={5}>
                    <label>Video URL:</label>
                    <input
                        type="url"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleChange}
                    />
                </motion.div>
                <motion.button
                    type="submit"
                    variants={itemVariants}
                    custom={6}
                    whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                    whileTap={{ scale: 0.95 }}
                >
                    Create Module
                </motion.button>
            </form>
        </motion.div>
    );
};

export default CreateTrainingModule;