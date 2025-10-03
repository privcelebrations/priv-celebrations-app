import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/dark.css';
import api from '../../services/api';

const Booking = ({ theatres, packages, addons, preselectedTheatre }) => {
    
    const getInitialState = () => ({
        name: '',
        phone: '',
        theatre_name: preselectedTheatre || theatres[0]?.name || '',
        package_name: 'None',
        party_size: 2,
        datetime: new Date(),
        requests: ''
    });

    const [formData, setFormData] = useState(getInitialState());
    const [selectedAddons, setSelectedAddons] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // This effect ensures the form resets with the correct pre-selected theatre if the prop changes
    useEffect(() => {
        setFormData(getInitialState());
    }, [preselectedTheatre, theatres]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddonChange = (e) => {
        setSelectedAddons({ ...selectedAddons, [e.target.name]: e.target.checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const addonsString = Object.keys(selectedAddons).filter(key => selectedAddons[key]).join(', ');

        try {
            await api.post('/bookings', { ...formData, selected_addons: addonsString });
            alert('Booking request sent successfully! Our team will contact you shortly to confirm.');
            setFormData(getInitialState());
            setSelectedAddons({});
        } catch (error) {
            console.error("Booking submission failed:", error);
            alert('An error occurred while submitting your booking. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div id="page-booking" className="page active">
            <section className="container booking-form-container">
                <h2 className="section-title animate-on-scroll is-visible">Reserve Your Experience</h2>
                <p className="section-subtitle animate-on-scroll is-visible">Your private world of luxury entertainment is just a few clicks away.</p>
                
                {/* --- NEW PRETTY FORM STRUCTURE --- */}
                <form className="pretty-booking-form animate-on-scroll is-visible" onSubmit={handleSubmit}>
                    
                    {/* --- Section 1: Event Details --- */}
                    <div className="form-section">
                        <h3 className="form-section-title"><span>1</span>Event Details</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="theatre_name">Select Theatre</label>
                                <select id="theatre_name" name="theatre_name" value={formData.theatre_name} onChange={handleChange} required>
                                    {theatres.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="party_size">Party Size</label>
                                <input type="number" id="party_size" name="party_size" value={formData.party_size} onChange={handleChange} min="1" max="20" required />
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="datetime">Select Date & Time</label>
                                <Flatpickr
                                    id="datetime"
                                    data-enable-time
                                    value={formData.datetime}
                                    onChange={([date]) => setFormData({ ...formData, datetime: date })}
                                    options={{ altInput: true, altFormat: "F j, Y at h:i K", dateFormat: "Y-m-d H:i", minDate: "today" }}
                                    placeholder="Click to choose a date and time"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- Section 2: Customization --- */}
                    <div className="form-section">
                        <h3 className="form-section-title"><span>2</span>Customization</h3>
                        <div className="form-group">
                            <label htmlFor="package_name">Choose a Base Package (Optional)</label>
                            <select id="package_name" name="package_name" value={formData.package_name} onChange={handleChange}>
                               <option value="None">None (A La Carte Booking)</option>
                               {packages.map(p => <option key={p.id} value={p.name}>{p.name} (+₹{p.price})</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Select Additional Add-ons</label>
                            <div className="addon-group">
                                {addons.map(addon => (
                                    <label key={addon.id} className="addon-checkbox-label">
                                        <input 
                                            type="checkbox" 
                                            name={addon.name} 
                                            checked={!!selectedAddons[addon.name]} 
                                            onChange={handleAddonChange} 
                                        />
                                        <div className="addon-details">
                                            <span className="addon-name">{addon.name} (+₹{addon.price})</span>
                                            <span className="addon-desc">{addon.description}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- Section 3: Your Information --- */}
                    <div className="form-section">
                        <h3 className="form-section-title"><span>3</span>Your Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="name">Your Name</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 1234567890" required />
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="requests">Special Requests</label>
                                <textarea id="requests" name="requests" value={formData.requests} onChange={handleChange} rows="4" placeholder="Share any special requirements, themes, or surprise elements..."></textarea>
                            </div>
                        </div>
                    </div>

                    {/* --- Final Submit Button --- */}
                    <div className="form-submit-area">
                        <button type="submit" className="cta-button" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Send Booking Request'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default Booking;