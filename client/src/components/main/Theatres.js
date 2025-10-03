import React from 'react';

const Theatres = ({ theatres, onCardClick }) => {
    // Construct the base URL for images from the environment variable.
    // This removes the hardcoded 'http://localhost:5000'.
    const apiBaseUrl = process.env.REACT_APP_API_URL.replace('/api', '');

    return (
        <div id="page-theatres" className="page active">
            <section className="container" style={{ paddingTop: '150px' }}>
                <h2 className="section-title animate-on-scroll is-visible">Our Exclusive Theatres</h2>
                <p className="section-subtitle animate-on-scroll is-visible">
                    Each suite is a meticulously designed world of its own, blending unparalleled comfort with cutting-edge technology to create experiences that transcend ordinary entertainment.
                </p>
                <div className="grid">
                    {theatres.map((theatre, i) => {
                        // Dynamically construct the full image URL.
                        // If an image path exists, prepend the full server URL to it.
                        // Otherwise, use a placeholder.
                        const imageUrl = theatre.images && theatre.images[0] 
                            ? `${apiBaseUrl}${theatre.images[0]}` 
                            : 'https://via.placeholder.com/400x300.png?text=PRIV+Theatre';

                        return (
                            <div 
                                key={theatre.id} 
                                className="card animate-on-scroll is-visible" 
                                style={{ transitionDelay: `${i * 0.2}s` }}
                                onClick={() => onCardClick({ type: 'theatre', ...theatre })}
                            >
                                <img 
                                    src={imageUrl} 
                                    alt={theatre.name} 
                                    loading="lazy" 
                                />
                                <div className="card-content">
                                    <span className="subtitle">{theatre.subtitle}</span>
                                    <h3>{theatre.name}</h3>
                                    <p>{theatre.description}</p>
                                    <ul>
                                        {/* Added optional chaining ?. to prevent crash if details is null */}
                                        {theatre.details?.slice(0, 4).map((detail, index) => <li key={index}>{detail}</li>)}
                                    </ul>
                                    <div className="price">₹{theatre.price}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Theatres;