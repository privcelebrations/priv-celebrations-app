import React, { useState, useEffect } from 'react';
// --- THIS IS THE CORRECTION: Import the image file directly ---
import logoImage from '../../assets/logo.jpg'; 

const Header = ({ onNavClick }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLinkClick = (e, page) => {
        e.preventDefault();
        onNavClick(page);
    };

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <a href="#home" onClick={(e) => handleLinkClick(e, 'page-home')} className="logo">
                {/* --- THIS IS THE CORRECTION: Use the imported image --- */}
                <img src={logoImage} alt="PRIV Logo" />
            </a>
            
            <nav className="nav">
                <a href="#home" onClick={(e) => handleLinkClick(e, 'page-home')}>Home</a>
                <a href="#theatres" onClick={(e) => handleLinkClick(e, 'page-theatres')}>Theatres</a>
                <a href="#packages" onClick={(e) => handleLinkClick(e, 'page-packages')}>Packages</a>
                <a href="#gallery" onClick={(e) => handleLinkClick(e, 'page-gallery')}>Gallery</a>
                <a href="#contact" onClick={(e) => handleLinkClick(e, 'page-contact')}>Contact</a>
            </nav>
            
            <a href="#booking" onClick={(e) => handleLinkClick(e, 'page-booking')} className="cta-button">Book Now</a>
        </header>
    );
};

export default Header;