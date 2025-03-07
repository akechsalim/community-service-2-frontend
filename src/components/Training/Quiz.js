import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import AuthService from '../Auth/Services/authService';
import './Quiz.css';

const Quiz = ({ moduleId }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const authHeaders = AuthService.getAuthHeaders();
                const response = await axios.get(`http://localhost:8080/api/quizzes/module/${moduleId}`, {
                    headers: authHeaders,
                });
                setQuizzes(response.data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };
        fetchQuizzes();
    }, [moduleId]);

    const handleSubmit = async () => {
        try {
            const authHeaders = AuthService.getAuthHeaders();
            const response = await axios.post('http://localhost:8080/api/quizzes/submit', answers, {
                headers: authHeaders,
            });
            if (response.data) {
                alert('Quiz submitted successfully!');
            } else {
                alert('Quiz submission failed. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
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
            className="quiz"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h2 variants={itemVariants} custom={0}>
                Quiz
            </motion.h2>
            {quizzes.map((quiz, index) => (
                <motion.div key={quiz.id} variants={itemVariants} custom={index + 1}>
                    <p>{quiz.question}</p>
                    <input
                        type="text"
                        value={answers[quiz.id] || ''}
                        onChange={(e) => setAnswers({ ...answers, [quiz.id]: e.target.value })}
                    />
                </motion.div>
            ))}
            <motion.button
                onClick={handleSubmit}
                variants={itemVariants}
                custom={quizzes.length + 1}
                whileHover={{ scale: 1.1, backgroundColor: '#ffda79' }}
                whileTap={{ scale: 0.95 }}
            >
                Submit
            </motion.button>
        </motion.div>
    );
};

export default Quiz;