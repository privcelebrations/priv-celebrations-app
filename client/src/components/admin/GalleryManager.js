import React, { useState } from 'react';
import api from '../../services/api';

const GalleryManager = ({ images, onUpdate }) => {
    const [files, setFiles] = useState([]);
    const [category, setCategory] = useState('Celebrations');
    const [caption, setCaption] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Get the server base URL from environment variables for constructing image preview URLs.
    // This removes the hardcoded 'http://localhost:5000'.
    const apiBaseUrl = process.env.REACT_APP_API_URL.replace('/api', '');

    // Updates the state with the files selected by the user.
    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    // Handles the deletion of a gallery image after a confirmation.
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this image from the gallery?')) {
            try {
                await api.delete(`/admin/gallery/${id}`);
                onUpdate(); // Trigger a data refresh in the parent dashboard component.
            } catch (error) {
                console.error('Failed to delete gallery image:', error);
                // Provide user-friendly feedback on failure.
                alert('Deletion failed. Please try again or check the console for details.');
            }
        }
    };

    // Handles the submission of the new image upload form.
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0) {
            alert('Please select at least one image to upload.');
            return;
        }
        setIsUploading(true);

        // FormData is necessary for sending files to the backend.
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }
        formData.append('category', category);
        formData.append('caption', caption);

        try {
            await api.post('/admin/gallery', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onUpdate(); // Refresh the data to show the newly uploaded images.
            
            // Reset form fields for the next upload.
            setFiles([]);
            setCaption('');
            e.target.reset(); // This is important to visually clear the file input field.
        } catch (error) {
            console.error('Failed to upload images:', error);
            alert(`Upload failed: ${error.response?.data?.msg || 'Please try again.'}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="data-table-section">
            <div className="table-header"><h2>Manage Website Gallery</h2></div>

            {/* Form for uploading new images */}
            <form onSubmit={handleSubmit} className="pretty-form">
                <h4 className="form-title">Upload New Images</h4>
                <div className="form-group grid-full-width">
                    <label>Images (Select multiple)</label>
                    <input type="file" multiple onChange={handleFileChange} accept="image/*" required />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <input name="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Celebrations" required />
                </div>
                <div className="form-group">
                    <label>Caption (Optional)</label>
                    <input name="caption" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g., Romantic Decor Setup" />
                </div>
                <div className="form-actions grid-full-width">
                    <button type="submit" className="submit-btn" disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Upload Images'}
                    </button>
                </div>
            </form>

            {/* Grid to display and manage existing images */}
            <div className="table-header" style={{ marginTop: '40px' }}><h3>Current Gallery Images</h3></div>
            <div className="image-preview-grid gallery-manager-grid">
                {images.map(img => (
                    <div key={img.id} className="image-preview">
                        {/* The src now correctly points to the full server URL from the .env file */}
                        <img src={`${apiBaseUrl}${img.image_url}`} alt={img.caption || 'Gallery image'} />
                        <div className="image-info">
                            <strong>{img.category}</strong>
                            <p>{img.caption || 'No caption'}</p>
                        </div>
                        <button type="button" className="delete-btn" onClick={() => handleDelete(img.id)} title="Delete Image"></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryManager;