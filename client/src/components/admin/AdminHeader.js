import React from 'react';

const AdminHeader = ({ activeView, onNavClick, onLogout }) => {
    const navItems = [
        { key: 'analytics', label: 'Analytics' },
        { key: 'bookings', label: 'Bookings' },
        { key: 'contacts', label: 'Contacts' },
        { key: 'theatres', label: 'Manage Theatres' },
        { key: 'gallery', label: 'Manage Gallery' }, // New Item
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