import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { motion } from 'framer-motion';
import './SocialMedia.css';

const SocialMedia = () => {
    const iconVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut', type: 'spring', bounce: 0.4, delay: i * 0.2 },
        }),
    };

    return (
        <motion.div
            className="social-media"
            variants={iconVariants}
            custom={1}
            initial="hidden"
            animate="visible"
        >
            <motion.a
                custom={0}
                variants={iconVariants}
                href="https://www.facebook.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.3, rotate: 10, color: '#f4c430' }}
            >
                <FontAwesomeIcon icon={faFacebook} size="3x" />
            </motion.a>
            <motion.a
                custom={1}
                variants={iconVariants}
                href="https://twitter.com/comServMgmtSyt"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.3, rotate: 10, color: '#f4c430' }}
            >
                <FontAwesomeIcon icon={faTwitter} size="3x" />
            </motion.a>
            <motion.a
                custom={2}
                variants={iconVariants}
                href="https://www.instagram.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.3, rotate: 10, color: '#f4c430' }}
            >
                <FontAwesomeIcon icon={faInstagram} size="3x" />
            </motion.a>
            <motion.a
                custom={3}
                variants={iconVariants}
                href="https://www.youtube.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.3, rotate: 10, color: '#f4c430' }}
            >
                <FontAwesomeIcon icon={faYoutube} size="3x" />
            </motion.a>
        </motion.div>
    );
};

export default SocialMedia;