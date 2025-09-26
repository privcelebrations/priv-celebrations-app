import React, { useState } from 'react';
import api from '../../services/api';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/dark.css';

const CreateBooking = ({ theatres, packages, addons, onBookingCreated }) => {
    const getInitialState = () => ({
        name: '',
        phone: '',
        theatre_name: theatres[0]?.name || '',
        package_name: 'None',
        party_size: 2,
        datetime: new Date(),
        selected_addons: [],
        requests: ''
    });

    const [formData, setFormData] = useState(getInitialState());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleAddonChange = (e) => {
        const { value, checked } = e.target;
        let currentAddons = formData.selected_addons;

        if (checked) {
            currentAddons.push(value);
        } else {
            currentAddons = currentAddons.filter(addon => addon !== value);
        }
        setFormData({ ...formData, selected_addons: currentAddons });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const payload = {
            ...formData,
            selected_addons: formData.selected_addons.join(', ') // Convert array to string for API
        };

        try {
            await api.post('/bookings', payload); // Use the public endpoint
            alert('Booking created successfully!');
            onBookingCreated(); // This will refresh data on the dashboard
            setFormData(getInitialState()); // Reset form
        } catch (error) {
            console.error('Failed to create booking:', error);
            alert('Error creating booking. Please check console for details.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="data-table-section">
            <div className="table-header">
                <h2>Create Phone Booking</h2>
            </div>
            <form onSubmit={handleSubmit} className="pretty-form">
                <h4 className="form-title">Customer and Event Details</h4>
                <div className="form-group">
                    <label>Customer Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Customer Phone</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                 <div className="form-group grid-full-width">
                    <label>Date & Time</label>
                    <Flatpickr
                        value={formData.datetime}
                        data-enable-time
                        onChange={([date]) => setFormData({ ...formData, datetime: date })}
                        options={{ altInput: true, altFormat: "F j, Y at h:i K", dateFormat: "Y-m-d H:i" }}
                        className="pretty-form-input" // Add a class for consistent styling
                    />
                </div>
                <div className="form-group">
                    <label>Theatre</label>
                    <select name="theatre_name" value={formData.theatre_name} onChange={handleChange}>
                        {theatres.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                    </select>
                </div>
                 <div className="form-group">
                    <label>Party Size</label>
                    <input name="party_size" type="number" value={formData.party_size} onChange={handleChange} required />
                </div>
                 <div className="form-group grid-full-width">
                    <label>Base Package</label>
                    <select name="package_name" value={formData.package_name} onChange={handleChange}>
                        <option value="None">None (A La Carte)</option>
                        {packages.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                </div>
                 <div className="form-group grid-full-width">
                    <label>Additional Addons</label>
                    <div className="checkbox-group">
                        {addons.map(addon => (
                            <label key={addon.id} className="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    value={addon.name} 
                                    checked={formData.selected_addons.includes(addon.name)}
                                    onChange={handleAddonChange}
                                />
                                {addon.name} (+₹{addon.price})
                            </label>
                        ))}
                    </div>
                 </div>
                 <div className="form-group grid-full-width">
                    <label>Special Requests</label>
                    <textarea name="requests" value={formData.requests} onChange={handleChange} rows="3" />
                 </div>
                <div className="form-actions grid-full-width">
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Booking'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBooking;