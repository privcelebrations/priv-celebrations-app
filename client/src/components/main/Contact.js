import React from 'react';
import { QuickContactForm } from './Footer';

const Contact = () => {
    // The outer <div className="page active"> has been removed.
    return (
        <section className="container" style={{ paddingTop: '150px' }}>
            <h2 className="section-title animate-on-scroll is-visible">Get In Touch</h2>
            <p className="section-subtitle animate-on-scroll is-visible">
                Ready to create unforgettable memories? Our dedicated team is here to craft the perfect experience for you.
            </p>
            <div className="contact-layout-grid">
                <div className="footer-contact-details animate-on-scroll is-visible">
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
                                <a href="tel:+918121012020">+91 82976 42050</a><br/>
                                <span style={{ fontSize: '0.9em', color: 'var(--accent-color)' }}>
                                    Available 24/7 for bookings
                                </span>
                            </p>
                        </div>
                        <div className="contact-item">
                            <h4>WhatsApp</h4>
                            <p>
                                <a href="https://wa.me/918121012020" target="_blank" rel="noopener noreferrer">+91 81210 12020</a><br/>
                                <span style={{ fontSize: '0.9em', color: 'var(--accent-color)' }}>
                                    Instant responses guaranteed
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="quick-contact-form-wrapper animate-on-scroll is-visible" style={{ transitionDelay: '0.3s' }}>
                    <QuickContactForm />
                </div>
            </div>
        </section>
    );
};

export default Contact;
