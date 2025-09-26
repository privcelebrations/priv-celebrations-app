import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const PackageManager = ({ packages, onUpdate }) => {
    // Define the initial (empty) state for the form
    const initialState = { name: '', price: '', original_price: '', description: '', items: '' };
    const [currentPackage, setCurrentPackage] = useState(initialState);
    const [isEditing, setIsEditing] = useState(false);

    // This effect ensures that if the 'packages' prop updates, the form resets if it was editing a deleted package.
    useEffect(() => {
        if (isEditing && !packages.find(p => p.id === currentPackage.id)) {
            handleCancel();
        }
    }, [packages, isEditing, currentPackage.id]);


    // Set the form fields when an admin clicks the "Edit" button
    const handleEdit = (pkg) => {
        // Convert the 'items' array to a comma-separated string for easy editing in a textarea
        const packageToEdit = { ...pkg, items: pkg.items.join(', ') };
        setCurrentPackage(packageToEdit);
        setIsEditing(true);
    };

    // Reset the form to its initial empty state and clear the "isEditing" flag
    const handleCancel = () => {
        setCurrentPackage(initialState);
        setIsEditing(false);
    };

    // Handle the deletion of a package after a confirmation prompt
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
            try {
                await api.delete(`/admin/packages/${id}`);
                onUpdate(); // Trigger a data refresh in the parent dashboard component
            } catch (error) {
                console.error('Failed to delete package:', error);
                alert('Deletion failed. Please try again.');
            }
        }
    };

    // Update the state as the admin types in the form fields
    const handleChange = (e) => {
        setCurrentPackage({ ...currentPackage, [e.target.name]: e.target.value });
    };

    // Handle the form submission for creating or updating a package
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Before sending, convert the comma-separated items string back into an array
        const payload = {
            ...currentPackage,
            items: currentPackage.items.split(',').map(item => item.trim()).filter(Boolean) // also remove any empty items
        };

        try {
            if (isEditing) {
                await api.put(`/admin/packages/${currentPackage.id}`, payload);
            } else {
                await api.post('/admin/packages', payload);
            }
            onUpdate(); // Refresh the data to show the changes
            handleCancel(); // Reset the form
        } catch (error) {
            console.error('Failed to save package:', error);
            alert('Save failed. Please check the console for details.');
        }
    };

    return (
        <div className="data-table-section">
            <div className="table-header">
                <h2>Manage Main Packages (Combos)</h2>
            </div>
            
            {/* Table to display existing packages */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Discounted Price</th>
                            <th>Original Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map(pkg => (
                            <tr key={pkg.id}>
                                <td>{pkg.name}</td>
                                <td>₹{pkg.price}</td>
                                <td>₹{pkg.original_price}</td>
                                <td className="action-buttons">
                                    <button className="edit-btn" onClick={() => handleEdit(pkg)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(pkg.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Form for creating or editing a package */}
            <form onSubmit={handleSubmit} className="pretty-form">
                <h4 className="form-title">{isEditing ? `Editing "${currentPackage.name}"` : 'Add New Package'}</h4>
                
                <div className="form-group grid-col-2">
                    <label htmlFor="name">Package Name</label>
                    <input id="name" name="name" value={currentPackage.name} onChange={handleChange} placeholder="e.g., Family Combo" required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="price">Discounted Price</label>
                    <input id="price" name="price" type="number" step="0.01" value={currentPackage.price} onChange={handleChange} placeholder="e.g., 3299.00" required />
                </div>

                <div className="form-group">
                    <label htmlFor="original_price">Original Price</label>
                    <input id="original_price" name="original_price" type="number" step="0.01" value={currentPackage.original_price} onChange={handleChange} placeholder="e.g., 4130.00" />
                </div>
                
                <div className="form-group grid-full-width">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" value={currentPackage.description} onChange={handleChange} rows="3" placeholder="A short, catchy description for the customer."></textarea>
                </div>

                <div className="form-group grid-full-width">
                    <label htmlFor="items">Items (comma-separated)</label>
                    <textarea id="items" name="items" value={currentPackage.items} onChange={handleChange} rows="4" placeholder="e.g., Custom Party Props, LED Number Display, Professional Fog Effect"></textarea>
                </div>
                
                <div className="form-actions grid-full-width">
                    <button type="submit" className="submit-btn">
                        {isEditing ? 'Update Package' : 'Create Package'}
                    </button>
                    {isEditing && <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>}
                </div>
            </form>
        </div>
    );
};

export default PackageManager;