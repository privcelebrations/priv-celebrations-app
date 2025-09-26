import React from 'react';

// Import the local images that will be used in the slideshow
import heroBirthdayImage from '../../assets/hero-birthday.jpg';
import heroRomanticImage from '../../assets/hero-romantic.jpg';
import heroOverTheMoonImage from '../../assets/hero-over-the-moon.jpg';

const BackgroundSlideshow = () => {
    return (
        // This component renders the slideshow container. The CSS will handle the
        // fixed positioning and animations.
        <div className="background-slideshow">
            <div style={{ backgroundImage: `url(${heroBirthdayImage})` }}></div>
            <div style={{ backgroundImage: `url(${heroRomanticImage})` }}></div>
            <div style={{ backgroundImage: `url(${heroOverTheMoonImage})` }}></div>
        </div>
    );
};

export default BackgroundSlideshow;