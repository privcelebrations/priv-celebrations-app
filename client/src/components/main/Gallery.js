import React from 'react';

const Gallery = ({ images }) => { // Receives 'images' as a prop now
    return (
        <div id="page-gallery" className="page active">
            <section className="container" style={{ paddingTop: '150px' }}>
                <h2 className="section-title animate-on-scroll is-visible">Visual Gallery</h2>
                <p className="section-subtitle animate-on-scroll is-visible">
                    A curated glimpse into the extraordinary experiences and unforgettable moments we craft for our discerning guests.
                </p>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {images.map((image, index) => (
                        <div 
                            key={image.id} 
                            className="card animate-on-scroll is-visible" 
                            style={{ transitionDelay: `${index * 0.05}s` }}
                        >
                            <img src={`http://localhost:5000${image.image_url}`} alt={image.caption || image.category} loading="lazy" />
                            <div className="card-content" style={{ padding: '25px' }}>
                                <span className="subtitle">{image.category}</span>
                                {image.caption && <h3 style={{ fontSize: '1.5rem' }}>{image.caption}</h3>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Gallery;