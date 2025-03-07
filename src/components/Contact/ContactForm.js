import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './ContactForm.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/contact', formData);
            console.log(response.data);
            alert('Thank you for your message!');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form, please try again.');
        }
    };

    const formVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut', type: 'spring', bounce: 0.4, delay: i * 0.2 },
        }),
    };

    return (
        <motion.div
            className="contact-container"
            variants={formVariants}
            custom={0}
            initial="hidden"
            animate="visible"
        >
            <div className="contact-card">
                <form onSubmit={handleSubmit} className="contact-form">
                    <motion.h1 custom={0} variants={formVariants}>
                        Contact Us
                    </motion.h1>
                    <motion.div custom={1} variants={formVariants}>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </motion.div>
                    <motion.div custom={2} variants={formVariants}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </motion.div>
                    <motion.div custom={3} variants={formVariants}>
                        <label htmlFor="message">Message:</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                    </motion.div>
                    <motion.button
                        custom={4}
                        variants={formVariants}
                        type="submit"
                        whileHover={{ scale: 1.1, backgroundColor: '#f4c430' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Send Message
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};

export default ContactForm;