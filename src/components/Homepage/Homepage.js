import React, { useEffect } from 'react';
import './Homepage.css';

const Homepage = () => {
    useEffect(() => {
        // Scroll effect for the hero headline
        const heroSection = document.querySelector('.hero-section');
        const heroHeadline = document.querySelector('.hero-headline');

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > heroSection.offsetTop - window.innerHeight / 2) {
                heroHeadline.classList.add('animate');
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="homepage">
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-headline">Empowering Communities, Simplifying Service</h1>
                    <p className="hero-subheadline">Manage Your Community Service Activities with Ease</p>
                    <a href="/signup" className="cta-button">Start Your Trial</a>
                </div>
            </div>
        </div>
    );
};

export default Homepage;