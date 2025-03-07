import React from 'react';
import { motion } from 'framer-motion';
import ContactForm from './ContactForm';
import SocialMedia from './SocialMedia';
import './ContactPage.css';

const ContactPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.3 },
        },
    };

    return (
        <motion.div
            className="contact-page"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 variants={containerVariants} className="contact-title">
                Let’s Connect!
            </motion.h1>
            <div className="contact-content">
                <ContactForm />
                <SocialMedia />
            </div>
        </motion.div>
    );
};

export default ContactPage;