import React, { useEffect } from 'react';

const Modal = ({ data, onClose, onNavClick }) => {
    // This effect handles closing the modal with the 'Escape' key
    // and prevents the background from scrolling while the modal is open.
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        // Cleanup function to remove the event listener and restore scrolling
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    // Construct the base URL for images from the environment variable
    const apiBaseUrl = process.env.REACT_APP_API_URL.replace('/api', '');

    const handleBookClick = () => {
        onClose(); // Close the modal first
        setTimeout(() => {
            onNavClick('page-booking'); // Then navigate to the booking page
        }, 300); // Small delay for a smoother transition
    };

    // This function determines what content to render inside the modal
    // based on the 'type' of data it receives ('theatre' or 'package').
    const renderContent = () => {
        if (!data) return null;

        if (data.type === 'theatre') {
            return (
                <>
                    <h2>{data.name}</h2>
                    <p>{data.description}</p>
                    
                    {/* --- THIS IS THE CORRECTED PART --- */}
                    {/* We check if images exist and then map over them,
                        prepending the full server URL to each image path. */}
                    {data.images && data.images.length > 0 && (
                        <div className="modal-gallery">
                            {data.images.map((imgUrl, i) => (
                                <img 
                                    key={i} 
                                    src={`${apiBaseUrl}${imgUrl}`} 
                                    alt={`${data.name} gallery ${i + 1}`} 
                                    loading="lazy"
                                />
                            ))}
                        </div>
                    )}

                    <h4>Experience Includes:</h4>
                    {data.details && (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {data.details.map((item, i) => (
                                <li key={i} style={{ marginBottom: '12px', paddingLeft: '25px', position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 0, color: 'var(--accent-color)' }}>✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <a href="#booking" onClick={handleBookClick} className="cta-button">
                            Book {data.name} - ₹{data.price}
                        </a>
                    </div>
                </>
            );
        }

        if (data.type === 'package') {
            return (
                <>
                    <h2>{data.name}</h2>
                    <p>{data.description}</p>
                    <h4>Package Inclusions:</h4>
                    {data.items && (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {data.items.map((item, i) => (
                                <li key={i} style={{ marginBottom: '12px', paddingLeft: '25px', position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 0, color: 'var(--accent-color)' }}>✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="price" style={{ textAlign: 'center', margin: '40px 0' }}>
                        {data.original_price && (
                            <span style={{ fontSize: '0.6em', textDecoration: 'line-through', color: 'var(--secondary-text)', display: 'block', marginBottom: '-15px' }}>
                                ₹{data.original_price}
                            </span>
                        )}
                        ₹{data.price}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <a href="#booking" onClick={handleBookClick} className="cta-button">Add to Booking</a>
                    </div>
                </>
            );
        }

        return null;
    };

    return (
        // The outer div closes the modal when the backdrop is clicked
        <div className="modal show" onClick={onClose}>
            {/* e.stopPropagation() prevents the click from bubbling up to the backdrop */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close-button" onClick={onClose}>×</span>
                {renderContent()}
            </div>
        </div>
    );
};

export default Modal;