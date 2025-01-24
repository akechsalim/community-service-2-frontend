// src/components/SocialMedia.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFacebook, faInstagram, faTwitter, faYoutube} from '@fortawesome/free-brands-svg-icons';
import './SocialMedia.css'

const SocialMedia = () => {
    return (
        <div className="social-media">
            <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} size="3x"/>
            </a>
            <a href="https://twitter.com/comServMgmtSyt" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} size="3x"/>
            </a>
            <a href="https://www.instagram.com/yourpage" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} size="3x"/>
            </a>
            <a href="https://www.youtube.com/yourpage" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faYoutube} size="3x"/>
            </a>
        </div>
    );
};

export default SocialMedia;