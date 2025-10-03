import React from 'react';

const QuickViewCard = ({ theatre, slots, isLoading, onSelect }) => {
    
    // The card's content is now determined by the props passed from its parent
    const renderSlotInfo = () => {
        if (isLoading) {
            return <span>Checking...</span>;
        }
        // If slots is a number (including 0), display it
        if (typeof slots === 'number') {
            return (
                <>
                    <span className="slot-count">{slots}</span>
                    <span>Slots Available Today</span>
                </>
            );
        }
        // Fallback for an error state
        return (
            <>
                <span className="slot-count">!</span>
                <span>Error</span>
            </>
        );
    };

    return (
        // The entire card is clickable, triggering the onSelect handler
        <div className="quick-view-card" onClick={() => onSelect(theatre.name)}>
            <div className="quick-view-card-image-container">
                {/* Use the theatre's own primary image */}
                <img 
                    src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${theatre.images[0]}` || 'https://via.placeholder.com/400x300.png?text=PRIV+Theatre'} 
                    alt={theatre.name} 
                />
            </div>
            <div className="quick-view-card-content">
                <h3>{theatre.name}</h3>
                <div className="quick-view-card-slots">
                    {renderSlotInfo()}
                </div>
            </div>
        </div>
    );
};

export default QuickViewCard;