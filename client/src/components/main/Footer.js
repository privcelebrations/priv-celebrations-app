import React, { useState } from 'react';
import api from '../../services/api';

/**
 * QuickContactForm Component
 * This form is used in the footer and on the dedicated Contact page.
 * We add 'export' so it can be imported by other files (like Contact.js).
 */
export const QuickContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/contacts', formData);
            alert('Your inquiry has been sent! We will get back to you soon.');
            setFormData({ name: '', email: '', message: '' }); // Reset form
        } catch (error) {
            console.error("Contact form submission failed:", error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="quick-contact-container">
            <h3>Quick Inquiry</h3>
            <form id="quickContactForm" className="quick-contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="qcf-name">Your Name</label>
                    <input type="text" id="qcf-name" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
                </div>
                <div className="form-group">
                    <label htmlFor="qcf-email">Your Email</label>
                    <input type="email" id="qcf-email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required />
                </div>
                <div className="form-group">
                    <label htmlFor="qcf-message">Your Message</label>
                    <textarea id="qcf-message" name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="Tell us about your event requirements..." required></textarea>
                </div>
                <button type="submit" className="cta-button secondary-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </button>
            </form>
        </div>
    );
};

/**
 * Main Footer Component
 * This is the default export for this file. It builds the entire footer structure.
 */
const Footer = ({ onNavClick }) => {
    const handleLinkClick = (pageId) => (e) => {
        e.preventDefault();
        if (typeof onNavClick === 'function') {
            onNavClick(pageId);
        }
    };

    // Dummy handler for placeholder links like Privacy Policy
    const handlePlaceholderClick = (e) => {
        e.preventDefault();
        alert("This link is a placeholder.");
    };

    return (
        <footer id="site-footer" className="site-footer">
            {/* --- THIS DIV IS NOW CORRECTED TO USE .footer-main --- */}
            <div className="footer-main">
                <div className="footer-contact-details animate-on-scroll">
                    <h2>Get In Touch</h2>
                    <p className="section-subtitle" style={{ textAlign: 'left', margin: '0 0 40px 0', maxWidth: '100%' }}>
                        Ready to create unforgettable memories? Our dedicated team is here to craft the perfect experience for you.
                    </p>
                    <div className="contact-grid">
                        <div className="contact-item">
                            <h4>Visit Our Location</h4>
                            <p>
                                <a href="https://www.google.com/maps/search/?api=1&query=3-9-585/1,+4th+floor+SBI+Bank+Building,+L+B+Nagar,+Hyderabad" target="_blank" rel="noopener noreferrer">
                                    3-9-585/1, 4th floor<br/>
                                    SBI Bank Building, beside KFC<br/>
                                    L B Nagar, Hyderabad, 500068
                                </a>
                            </p>
                        </div>
                        <div className="contact-item">
                            <h4>Operating Hours</h4>
                            <p>
                                Monday - Thursday: 9:00 AM - 11:30 PM<br/>
                                Friday - Sunday: 9:00 AM - 12:00 AM<br/>
                                <span style={{ color: 'var(--accent-color)', fontSize: '0.9em' }}>
                                    Extended hours available upon request
                                </span>
                            </p>
                        </div>
                        <div className="contact-item">
                            <h4>Call Us</h4>
                            <p>
                                <a href="tel:+918121012020">+91 81210 12020</a><br/>
                                <span style={{ fontSize: '0.9em', color: 'var(--accent-color)' }}>
                                    Available 24/7 for bookings
                                </span>
                            </p>
                        </div>
                        <div className="contact-item">
                            <h4>WhatsApp</h4>
                            <p>
                                <a href="https://wa.me/918121012020" target="_blank" rel="noopener noreferrer">+9181210 12020</a><br/>
                                <span style={{ fontSize: '0.9em', color: 'var(--accent-color)' }}>
                                    Instant responses guaranteed
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* <div className="quick-contact-form-wrapper animate-on-scroll" style={{ transitionDelay: '0.3s' }}>
                    <QuickContactForm />
                </div> */}
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-grid">
                    <div className="footer-bottom-col">
                        <h4>PRIV</h4>
                        <p style={{ margin: '15px 0', lineHeight: '1.6' }}>
                            Creating unforgettable private theatre experiences for celebrations, corporate events, gaming sessions, and special occasions that deserve nothing but the best.
                        </p>
                    </div>
                    <div className="footer-bottom-col">
                        <h4>Quick Navigation</h4>
                        <a href="#home" onClick={handleLinkClick('page-home')}>Home</a>
                        <a href="#theatres" onClick={handleLinkClick('page-theatres')}>Luxury Theatres</a>
                        <a href="#packages" onClick={handleLinkClick('page-packages')}>Premium Packages</a>
                        <a href="#gallery" onClick={handleLinkClick('page-gallery')}>Experience Gallery</a>
                        <a href="#booking" onClick={handleLinkClick('page-booking')}>Book Now</a>
                    </div>
                    <div className="footer-bottom-col">
                        <h4>Our Services</h4>
                        <a href="#packages" onClick={handleLinkClick('page-packages')}>Private Movie Screenings</a>
                        <a href="#packages" onClick={handleLinkClick('page-packages')}>Birthday Celebrations</a>
                        <a href="#packages" onClick={handleLinkClick('page-packages')}>Corporate Events</a>
                        <a href="#packages" onClick={handleLinkClick('page-packages')}>Gaming Tournaments</a>
                        <a href="#packages" onClick={handleLinkClick('page-packages')}>Special Occasions</a>
                    </div>
                    <div className="footer-bottom-col">
                        <h4>Connect With Us</h4>
                        <a href="https://wa.me/918121012020" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                        <a href="tel:+918121012020">Phone Support</a>
                        <a href="mailto:business@privcelebrations.com">Email Us</a>
                        <a href="#booking" onClick={handleLinkClick('page-booking')}>Event Planning</a>
                    </div>
                </div>
            </div>
            <div className="copyright">
                © 2025 PRIV by PrivCelebrations.com. All rights reserved.
                <span style={{ margin: '0 20px' }}>|</span>
                <a href="#privacy" onClick={handlePlaceholderClick}>Privacy Policy</a>
                <span style={{ margin: '0 10px' }}>|</span>
                <a href="#terms" onClick={handlePlaceholderClick}>Terms of Service</a>
            </div>
        </footer>
    );
};

export default Footer;
