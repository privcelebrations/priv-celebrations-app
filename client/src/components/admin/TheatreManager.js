import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const TheatreManager = ({ theatres, onUpdate }) => {
    const initialState = { name: '', subtitle: '', description: '', details: '', price: '', images: [], existingImages: [] };
    const [currentTheatre, setCurrentTheatre] = useState(initialState);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get the server base URL from environment variables for image previews
    const apiBaseUrl = process.env.REACT_APP_API_URL.replace('/api', '');

    useEffect(() => {
        if (isEditing && !theatres.find(t => t.id === currentTheatre.id)) {
            handleCancel();
        }
    }, [theatres, isEditing, currentTheatre.id]);

    const handleEdit = (theatre) => {
        setCurrentTheatre({
            ...theatre,
            details: theatre.details ? theatre.details.join(', ') : '',
            images: [],
            existingImages: theatre.images || []
        });
        setIsEditing(true);
        document.querySelector('.pretty-form').scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancel = () => {
        setCurrentTheatre(initialState);
        setIsEditing(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this theatre? This will also delete its images.')) {
            try {
                await api.delete(`/admin/theatres/${id}`);
                onUpdate(); // Refresh data on success
            } catch (error) {
                console.error('Failed to delete theatre:', error);
                // Provide user-friendly feedback on failure
                alert('Deletion failed. The theatre might be associated with existing bookings or another error occurred.');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentTheatre({ ...currentTheatre, [name]: value });
    };

    const handleFileChange = (e) => {
        setCurrentTheatre({ ...currentTheatre, images: e.target.files });
    };

    const handleRemoveImage = (imgUrlToRemove) => {
        const updatedImages = currentTheatre.existingImages.filter(img => img !== imgUrlToRemove);
        setCurrentTheatre({ ...currentTheatre, existingImages: updatedImages });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const formData = new FormData();
        Object.keys(currentTheatre).forEach(key => {
            if (key === 'images') {
                for (let i = 0; i < currentTheatre.images.length; i++) {
                    formData.append('images', currentTheatre.images[i]);
                }
            } else if (key === 'existingImages') {
                 formData.append(key, JSON.stringify(currentTheatre.existingImages));
            } else {
                formData.append(key, currentTheatre[key]);
            }
        });

        try {
            if (isEditing) {
                await api.put(`/admin/theatres/${currentTheatre.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/admin/theatres', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            onUpdate();
            handleCancel();
        } catch (error) {
            console.error('Failed to save theatre:', error);
            alert(`Save failed: ${error.response?.data?.msg || 'Please check console for details.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="data-table-section">
            <div className="table-header"><h2>Manage Theatres</h2></div>
            <div className="table-container">
                {/* Table to display theatres */}
                <table>
                    <thead><tr><th>Name</th><th>Subtitle</th><th>Price</th><th>Actions</th></tr></thead>
                    <tbody>
                        {theatres.map(t => (
                            <tr key={t.id}>
                                <td>{t.name}</td><td>{t.subtitle}</td><td>₹{t.price}</td>
                                <td className="action-buttons">
                                    <button className="edit-btn" onClick={() => handleEdit(t)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(t.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <form onSubmit={handleSubmit} className="pretty-form">
                <h4 className="form-title">{isEditing ? `Editing "${currentTheatre.name}"` : 'Add New Theatre'}</h4>
                
                {/* Form inputs remain the same */}
                <div className="form-group grid-col-2"><label>Name</label><input name="name" value={currentTheatre.name} onChange={handleChange} required /></div>
                <div className="form-group"><label>Subtitle</label><input name="subtitle" value={currentTheatre.subtitle} onChange={handleChange} /></div>
                <div className="form-group"><label>Price</label><input name="price" type="number" step="0.01" value={currentTheatre.price} onChange={handleChange} required /></div>
                <div className="form-group grid-full-width"><label>Description</label><textarea name="description" value={currentTheatre.description} onChange={handleChange} rows="3"></textarea></div>
                <div className="form-group grid-full-width"><label>Details (comma-separated)</label><textarea name="details" value={currentTheatre.details} onChange={handleChange} rows="3"></textarea></div>
                
                <div className="form-group grid-full-width">
                    <label>Upload New Images (Max 5)</label>
                    <input type="file" name="images" multiple onChange={handleFileChange} accept="image/*" />
                </div>
                {isEditing && currentTheatre.existingImages?.length > 0 && (
                    <div className="form-group grid-full-width">
                        <label>Current Images</label>
                        <div className="image-preview-grid">
                            {currentTheatre.existingImages.map(imgUrl => (
                                <div key={imgUrl} className="image-preview">
                                    {/* The src now correctly points to the full server URL from the .env file */}
                                    <img src={`${apiBaseUrl}${imgUrl}`} alt="preview" />
                                    <button type="button" onClick={() => handleRemoveImage(imgUrl)} title="Remove Image"></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="form-actions grid-full-width">
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : (isEditing ? 'Update Theatre' : 'Create Theatre')}</button>
                    {isEditing && <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>}
                </div>
            </form>
        </div>
    );
};

export default TheatreManager;