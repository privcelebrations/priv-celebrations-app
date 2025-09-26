import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const QuickViewCard = ({ theatre, onSelect }) => {
    // State to manage the API response and loading status for this specific card
    const [availability, setAvailability] = useState({
        isLoading: true,
        slots: null,
    });

    // Fetches the slot count for today
    const fetchSlotsForToday = useCallback(async () => {
        setAvailability({ isLoading: true, slots: null });

        const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD

        try {
            const res = await api.get(`/slots/availability?theatreName=${encodeURIComponent(theatre.name)}&date=${today}`);
            setAvailability({
                isLoading: false,
                slots: res.data.availableSlots,
            });
        } catch (error) {
            console.error(`Failed to fetch availability for ${theatre.name}:`, error);
            setAvailability({
                isLoading: false,
                slots: '!', // Use an exclamation mark to indicate an error
            });
        }
    }, [theatre.name]);

    // This effect runs once when the component first mounts
    useEffect(() => {
        fetchSlotsForToday();
    }, [fetchSlotsForToday]);

    const handleClick = () => {
        onSelect(theatre.name);
    };

    return (
        <div className="quick-view-card" onClick={handleClick}>
            <div className="quick-view-card-image-container">
                <img src={theatre.images[0] || 'https://via.placeholder.com/400x300.png?text=PRIV+Theatre'} alt={theatre.name} />
            </div>
            <div className="quick-view-card-content">
                <h3>{theatre.name}</h3>
                <div className="quick-view-card-slots">
                    {availability.isLoading ? (
                        <span>Checking...</span>
                    ) : (
                        <>
                            <span className="slot-count">{availability.slots}</span>
                            <span>Slots Available Today</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuickViewCard;