import React from 'react';

const AdminHeader = ({ activeView, onNavClick, onLogout }) => {
    // Defines the navigation links and their corresponding view keys
    const navItems = [
        { key: 'analytics', label: 'Analytics Dashboard' },
        { key: 'createBooking', label: 'Create Phone Booking' },
        { key: 'bookings', label: 'View Bookings' },
        { key: 'contacts', label: 'View Contacts' },
        { key: 'packages', label: 'Manage Packages' },
        { key: 'addons', label: 'Manage Addons' },
        { key: 'offers', label: 'Create Offer' },
    ];

    return (
        <header className="admin-header">
            <div className="admin-header-logo">
                <h1>Admin Portal</h1>
            </div>
            <nav className="admin-nav">
                {navItems.map(item => (
                    <button 
                        key={item.key}
                        // Applies the 'active' class if the button's key matches the current view
                        className={`admin-nav-link ${activeView === item.key ? 'active' : ''}`}
                        onClick={() => onNavClick(item.key)}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="admin-header-actions">
                <button id="logout-btn" onClick={onLogout}>Logout</button>
            </div>
        </header>
    );
};

export default AdminHeader;