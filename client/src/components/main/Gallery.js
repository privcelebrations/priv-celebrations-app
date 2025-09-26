import React from 'react';

const Gallery = ({ theatres }) => {
    const allImages = theatres.flatMap((theatre, i) => 
        theatre.images.map((img, j) => ({
            src: img,
            alt: theatre.name,
            name: theatre.name,
            subtitle: theatre.subtitle,
            delay: (i * 4 + j) * 0.05
        }))
    );

    // The outer <div className="page active"> has been removed.
    return (
        <section className="container" style={{ paddingTop: '150px' }}>
            <h2 className="section-title animate-on-scroll is-visible">Visual Gallery</h2>
            <p className="section-subtitle animate-on-scroll is-visible">
                A curated glimpse into the extraordinary experiences and unforgettable moments we craft for our discerning guests.
            </p>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {allImages.map((image, index) => (
                    <div key={index} className="card animate-on-scroll is-visible" style={{ transitionDelay: `${image.delay}s` }}>
                        <img src={image.src} alt={image.alt} loading="lazy" />
                        <div className="card-content" style={{ padding: '25px' }}>
                            <span className="subtitle">{image.name}</span>
                            <h3 style={{ fontSize: '1.5rem' }}>{image.subtitle}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Gallery;