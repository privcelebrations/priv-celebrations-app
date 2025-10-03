import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AddonManager = ({ addons, onUpdate }) => {
    // Define the initial (empty) state for the form fields
    const initialState = { name: '', description: '', price: '' };
    const [currentAddon, setCurrentAddon] = useState(initialState);
    const [isEditing, setIsEditing] = useState(false);

    // This effect ensures the form resets if an admin deletes an addon they are currently editing
    useEffect(() => {
        if (isEditing && !addons.find(a => a.id === currentAddon.id)) {
            handleCancel();
        }
    }, [addons, isEditing, currentAddon.id]);

    // Set the form fields when an admin clicks the "Edit" button on an existing addon
    const handleEdit = (addon) => {
        setCurrentAddon(addon);
        setIsEditing(true);
    };

    // Reset the form to its initial empty state and clear the "isEditing" flag
    const handleCancel = () => {
        setCurrentAddon(initialState);
        setIsEditing(false);
    };

    // Handle the deletion of an addon after a browser confirmation prompt
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this addon? This action cannot be undone.')) {
            try {
                await api.delete(`/admin/addons/${id}`);
                onUpdate(); // Trigger a data refresh in the parent dashboard component
            } catch (error) {
                console.error('Failed to delete addon:', error);
                alert('Deletion failed. Please try again.');
            }
        }
    };

    // Update the state as the admin types in the form fields
    const handleChange = (e) => {
        setCurrentAddon({ ...currentAddon, [e.target.name]: e.target.value });
    };

    // Handle the form submission for creating or updating an addon
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...currentAddon };

        try {
            if (isEditing) {
                // If editing, send a PUT request to update the existing addon
                await api.put(`/admin/addons/${currentAddon.id}`, payload);
            } else {
                // If not editing, send a POST request to create a new addon
                await api.post('/admin/addons', payload);
            }
            onUpdate(); // Refresh the data to show the changes
            handleCancel(); // Reset the form
        } catch (error) {
            console.error('Failed to save addon:', error);
            alert('Save failed. Please check the console for details.');
        }
    };

    return (
        <div className="data-table-section">
            <div className="table-header">
                <h2>Manage Individual Addons</h2>
            </div>
            
            {/* Table to display existing addons */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {addons.map(addon => (
                            <tr key={addon.id}>
                                <td>{addon.name}</td>
                                <td>{addon.description}</td>
                                <td>₹{addon.price}</td> {/* <-- CORRECTED SYMBOL */}
                                <td className="action-buttons">
                                    <button className="edit-btn" onClick={() => handleEdit(addon)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(addon.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Form for creating or editing an addon, using the same "pretty-form" class */}
            <form onSubmit={handleSubmit} className="pretty-form">
                <h4 className="form-title">{isEditing ? `Editing "${currentAddon.name}"` : 'Add New Addon'}</h4>
                
                <div className="form-group grid-col-2">
                    <label htmlFor="addon-name">Addon Name</label>
                    <input id="addon-name" name="name" value={currentAddon.name} onChange={handleChange} placeholder="e.g., Rose Petal Path" required />
                </div>
                 
                 <div className="form-group">
                    <label htmlFor="addon-price">Price</label>
                    <input id="addon-price" name="price" type="number" step="0.01" value={currentAddon.price} onChange={handleChange} placeholder="e.g., 499.00" required />
                </div>
                
                <div className="form-group grid-full-width">
                    <label htmlFor="addon-description">Description</label>
                    <textarea id="addon-description" name="description" value={currentAddon.description} onChange={handleChange} rows="3" placeholder="A short description for the customer booking form."></textarea>
                </div>
                
                <div className="form-actions grid-full-width">
                    <button type="submit" className="submit-btn">
                        {isEditing ? 'Update Addon' : 'Create Addon'}
                    </button>
                    {isEditing && <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>}
                </div>
            </form>
        </div>
    );
};

export default AddonManager;