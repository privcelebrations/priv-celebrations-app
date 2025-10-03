import React from 'react';

const Hero = ({ onNavClick }) => {
    return (
        <div id="page-home" className="page active">
            {/* The <section> no longer contains the slideshow. It is now effectively transparent,
                allowing the global background (defined in MainWebsite.js) to show through. */}
            <section className="hero">
                {/* The overlay is still here to ensure the text is readable over the background */}
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="animate-on-scroll is-visible">An Elevated Experience</h1>
                    <p className="animate-on-scroll is-visible" style={{ transitionDelay: '0.3s' }}>
                        Host unforgettable private parties, cinematic gaming sessions, and exclusive events in our state-of-the-art luxury theatre rooms designed for the discerning few.
                    </p>
                    <div className="hero-buttons animate-on-scroll is-visible" style={{ transitionDelay: '0.6s' }}>
                        <a href="#booking" onClick={(e) => { e.preventDefault(); onNavClick('page-booking'); }} className="cta-button">Book Your Experience</a>
                        <a href="#theatres" onClick={(e) => { e.preventDefault(); onNavClick('page-theatres'); }} className="cta-button secondary-button">Explore Theatres</a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Hero;