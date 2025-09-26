import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Import all required child components
import AdminHeader from '../components/admin/AdminHeader';
import AnalyticsView from '../components/admin/AnalyticsView';
import BookingsTable from '../components/admin/BookingsTable';
import ContactsTable from '../components/admin/ContactsTable';
import PackageManager from '../components/admin/PackageManager';
import AddonManager from '../components/admin/AddonManager'; // New component
import OfferManager from '../components/admin/OfferManager';   // New component

const AdminDashboard = () => {
    const [activeView, setActiveView] = useState('analytics'); // Default view
    const [data, setData] = useState({
        analytics: null,
        bookings: [],
        contacts: [],
        packages: [],
        addons: [],
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch all data in parallel for efficiency
            const [analyticsRes, bookingsRes, contactsRes, packagesRes, addonsRes] = await Promise.all([
                api.get('/admin/analytics'),
                api.get('/admin/bookings'),
                api.get('/admin/contacts'),
                api.get('/admin/packages'),
                api.get('/admin/addons') // New API call for addons
            ]);
            setData({
                analytics: analyticsRes.data,
                bookings: bookingsRes.data,
                contacts: contactsRes.data,
                packages: packagesRes.data,
                addons: addonsRes.data,
            });
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            if (error.response && error.response.status === 401) handleLogout();
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin');
    };

    // This function determines which component to render based on the activeView state
    const renderActiveView = () => {
        if (loading) {
            return <div>Loading Dashboard Content...</div>;
        }
        switch (activeView) {
            case 'bookings':
                return <BookingsTable bookings={data.bookings} />;
            case 'contacts':
                return <ContactsTable contacts={data.contacts} />;
            case 'packages':
                return <PackageManager packages={data.packages} onUpdate={fetchData} />;
            case 'addons':
                return <AddonManager addons={data.addons} onUpdate={fetchData} />;
            case 'offers':
                return <OfferManager />; // Placeholder for the new feature
            case 'analytics':
            default:
                return <AnalyticsView analytics={data.analytics} />;
        }
    };

    return (
        <div>
            {/* The header is now a separate component */}
            <AdminHeader 
                activeView={activeView}
                onNavClick={setActiveView}
                onLogout={handleLogout} 
            />
            <main className="dashboard-main">
                {renderActiveView()}
            </main>
        </div>
    );
};

export default AdminDashboard;