import React, { useState, useEffect, useCallback } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/dark.css';
import api from '../../services/api';
import QuickViewCard from './QuickViewCard'; // We use the card component to display results

const QuickView = ({ theatres, onTheatreSelect }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availability, setAvailability] = useState({
        isLoading: true,
        data: {}, // This will store the slot count for each theatre, e.g., { "Imperial Suite": 8 }
    });

    // This function fetches the slot data for ALL theatres for the selected date in a single API call.
    // useCallback ensures the function isn't recreated on every render, which is a performance optimization.
    const fetchAllSlots = useCallback(async () => {
        setAvailability({ isLoading: true, data: {} });

        // Format the date to YYYY-MM-DD for the API query
        const date = selectedDate.toISOString().split('T')[0];

        try {
            const res = await api.get(`/slots/availability?date=${date}`);
            
            // The API returns an array. We convert it into a map (an object) for easy lookups
            // later when rendering the cards. This is more efficient than searching the array for each card.
            const availabilityMap = res.data.availability.reduce((acc, item) => {
                acc[item.name] = item.slots;
                return acc;
            }, {});
            
            setAvailability({
                isLoading: false,
                data: availabilityMap,
            });
        } catch (error) {
            console.error("Failed to fetch all slot availabilities:", error);
            setAvailability({ isLoading: false, data: {} });
        }
    }, [selectedDate]); // This function will re-run only when `selectedDate` changes.

    // This effect calls the fetchAllSlots function whenever the component mounts or the date changes.
    useEffect(() => {
        fetchAllSlots();
    }, [fetchAllSlots]);

    // We'll display a maximum of 3 theatres in this section for a clean layout.
    const theatresToShow = theatres.slice(0, 3);

    return (
        <section className="quick-view-section-enhanced container">
            <h2 className="section-title animate-on-scroll is-visible">Real-Time Availability</h2>
            <div className="quick-view-controls animate-on-scroll is-visible">
                <div className="form-group" style={{ flex: 'none', minWidth: '300px' }}>
                    <label>Check Availability For Date:</label>
                    <Flatpickr
                        value={selectedDate}
                        options={{ 
                            minDate: "today", 
                            dateFormat: "Y-m-d", 
                            altInput: true, 
                            altFormat: "F j, Y" 
                        }}
                        onChange={([date]) => setSelectedDate(date)}
                    />
                </div>
            </div>
            <div className="quick-view-grid animate-on-scroll is-visible">
                {theatresToShow.map(theatre => (
                    <QuickViewCard 
                        key={theatre.id} 
                        theatre={theatre} 
                        // Pass down the specific slot count for this theatre, looking it up from our data map.
                        // Pass null if it's still loading or if there was an error.
                        slots={availability.data[theatre.name] ?? null}
                        isLoading={availability.isLoading}
                        onSelect={onTheatreSelect}
                    />
                ))}
            </div>
        </section>
    );
};

export default QuickView;