import React from 'react';

const Packages = ({ packages, onCardClick }) => {
    // The outer <div className="page active"> has been removed.
    return (
        <section className="container" style={{ paddingTop: '150px' }}>
            <h2 className="section-title animate-on-scroll is-visible">Experience Packages</h2>
            <p className="section-subtitle animate-on-scroll is-visible">
                Curated enhancements and premium add-ons to elevate your experience from memorable to absolutely unforgettable.
            </p>
            <div className="grid">
                {packages.map((pkg, i) => (
                    <div 
                        key={pkg.id} 
                        className="card animate-on-scroll is-visible" 
                        style={{ transitionDelay: `${i * 0.1}s` }}
                        onClick={() => onCardClick({ type: 'package', ...pkg })}
                    >
                        <div className="card-content">
                             <span className="subtitle">
                                <del style={{ color: 'var(--secondary-text)', marginRight: '10px', fontWeight: 400 }}>₹{pkg.original_price}</del>
                                <span>₹{pkg.price}</span>
                            </span>
                            <h3>{pkg.name}</h3>
                            <p>{pkg.description}</p>
                            <ul style={{ margin: '25px 0' }}>
                                {pkg.items.slice(0, 3).map((item, index) => <li key={index}>{item}</li>)}
                                {pkg.items.length > 3 && <li style={{ color: 'var(--accent-color)' }}>+ More inclusions</li>}
                            </ul>
                            <span className="cta-button secondary-button" style={{ marginTop: 'auto', display: 'inline-block', textAlign: 'center' }}>View Full Details</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Packages;