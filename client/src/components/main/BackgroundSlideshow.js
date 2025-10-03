
import React from 'react';
import { useLocation } from 'react-router-dom';

// Import the images directly from your assets folder.
// Webpack will handle bundling these images for you.
import bgImage1 from '../../assets/hero-birthday.jpg';
import bgImage2 from '../../assets/hero-romantic.jpg';
import bgImage3 from '../../assets/hero-over-the-moon.jpg';

const BackgroundSlideshow = () => {
    const location = useLocation();

    // This check ensures the slideshow does NOT appear on any admin pages.
    if (location.pathname.startsWith('/admin')) {
        return null; // Render nothing if on an admin route
    }

    const imageUrls = [bgImage1, bgImage2, bgImage3];

    return (
        <div className="background-slideshow">
            {imageUrls.map((url, index) => (
                <div key={index} style={{ backgroundImage: `url(${url})` }}></div>
            ))}
        </div>
    );
};

export default BackgroundSlideshow;