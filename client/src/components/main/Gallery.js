import React from 'react';

const Gallery = ({ images }) => {
    // --- THIS IS THE KEY FIX ---
    // Get the server's base URL from the environment variable.
    // This removes the hardcoded 'http://localhost:5000'.
    // The fallback to an empty string ('') prevents a crash if the variable is somehow missing during a build step.
    const apiBaseUrl = (process.env.REACT_APP_API_URL || '').replace('/api', '');

    // A check to handle the case where the images array might not be available yet.
    if (!images || images.length === 0) {
        return (
            <div id="page-gallery" className="page active">
                <section className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
                    <h2 className="section-title animate-on-scroll is-visible">Visual Gallery</h2>
                    <p className="section-subtitle animate-on-scroll is-visible">
                        Our gallery is currently being updated. Please check back soon!
                    </p>
                </section>
            </div>
        );
    }
    
    return (
        <div id="page-gallery" className="page active">
            <section className="container" style={{ paddingTop: '150px' }}>
                <h2 className="section-title animate-on-scroll is-visible">Visual Gallery</h2>
                <p className="section-subtitle animate-on-scroll is-visible">
                    A curated glimpse into the extraordinary experiences and unforgettable moments we craft for our discerning guests.
                </p>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {images.map((image, index) => {
                        // --- THIS IS THE CORRECTED IMAGE SRC ---
                        // It now prepends the full server URL (from the .env file) to the relative image path.
                        const imageUrl = `${apiBaseUrl}${image.image_url}`;

                        return (
                            <div 
                                key={image.id} 
                                className="card animate-on-scroll is-visible" 
                                style={{ transitionDelay: `${index * 0.05}s` }}
                            >
                                <img src={imageUrl} alt={image.caption || image.category} loading="lazy" />
                                <div className="card-content" style={{ padding: '25px' }}>
                                    <span className="subtitle">{image.category}</span>
                                    {image.caption && <h3 style={{ fontSize: '1.5rem' }}>{image.caption}</h3>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Gallery;