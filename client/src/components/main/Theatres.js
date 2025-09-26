import React from 'react';

const Theatres = ({ theatres, onCardClick }) => {
    // The outer <div className="page active"> has been removed.
    // The component now returns the <section> tag directly as its root element.
    return (
        <section className="container" style={{ paddingTop: '150px' }}>
            <h2 className="section-title animate-on-scroll is-visible">Our Exclusive Theatres</h2>
            <p className="section-subtitle animate-on-scroll is-visible">
                Each suite is a meticulously designed world of its own, blending unparalleled comfort with cutting-edge technology to create experiences that transcend ordinary entertainment.
            </p>
            <div className="grid">
                {theatres.map((theatre, i) => (
                    <div 
                        key={theatre.id} 
                        className="card animate-on-scroll is-visible" 
                        style={{ transitionDelay: `${i * 0.2}s` }}
                        onClick={() => onCardClick({ type: 'theatre', ...theatre })}
                    >
                        <img 
                            src={theatre.images[0] || 'https://via.placeholder.com/400x300.png?text=PRIV+Theatre'} 
                            alt={theatre.name} 
                            loading="lazy" 
                        />
                        <div className="card-content">
                            <span className="subtitle">{theatre.subtitle}</span>
                            <h3>{theatre.name}</h3>
                            <p>{theatre.description}</p>
                            <ul>
                                {theatre.details.slice(0, 4).map((detail, index) => <li key={index}>{detail}</li>)}
                            </ul>
                            <div className="price">₹{theatre.price}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Theatres;