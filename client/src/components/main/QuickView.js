import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import QuickViewCard from './QuickViewCard'; // Assuming QuickViewCard is in the same folder

const QuickView = ({ theatres, onTheatreSelect }) => {
    // We'll display a maximum of 3 theatres in this section
    const theatresToShow = theatres.slice(0, 3);

    return (
        // --- THIS IS THE CORRECTED LINE ---
        // I've replaced "quick-view-section-enhanced container" with a new class
        // and removed the inline style to eliminate the unwanted space and border.
        <section className="quick-view-wrapper">
            <div className="container">
                <h2 className="section-title animate-on-scroll is-visible">Quick View Availability</h2>
                <p className="section-subtitle animate-on-scroll is-visible">
                    Check today's real-time availability. Click a theatre to book your slot now.
                </p>
                <div className="quick-view-grid animate-on-scroll is-visible">
                    {theatresToShow.map(theatre => (
                        <QuickViewCard 
                            key={theatre.id} 
                            theatre={theatre} 
                            onSelect={onTheatreSelect}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuickView;