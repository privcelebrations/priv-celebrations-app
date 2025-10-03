import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Import all required child components for the dashboard views
import AdminHeader from '../components/admin/AdminHeader';
import AnalyticsView from '../components/admin/AnalyticsView';
import BookingsTable from '../components/admin/BookingsTable';
import ContactsTable from '../components/admin/ContactsTable';
import TheatreManager from '../components/admin/TheatreManager';
import GalleryManager from '../components/admin/GalleryManager';
import PackageManager from '../components/admin/PackageManager';
import AddonManager from '../components/admin/AddonManager';
import OfferManager from '../components/admin/OfferManager';
import CreateBooking from '../components/admin/CreateBooking';

const AdminDashboard = () => {
    // State to track which admin view is currently active (e.g., 'analytics', 'bookings')
    const [activeView, setActiveView] = useState('analytics');
    
    // A single state object to hold all data fetched from the backend
    const [data, setData] = useState({
        analytics: null,
        chartData: null,
        bookings: [],
        contacts: [],
        theatres: [],
        galleryImages: [],
        packages: [],
        addons: [],
    });
    
    // State to manage the overall loading status of the dashboard
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // The handleLogout function is wrapped in useCallback to stabilize it.
    // It only gets recreated if the `navigate` function changes (which it won't).
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        navigate('/admin');
    }, [navigate]);

    // This function fetches all data needed for the entire dashboard from the backend.
    // It now correctly includes `handleLogout` in its dependency array.
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch all admin data in parallel for a faster initial load
            const [
                analyticsRes, chartDataRes, bookingsRes, contactsRes, 
                theatresRes, galleryRes, packagesRes, addonsRes
            ] = await Promise.all([
                api.get('/admin/analytics'),
                api.get('/admin/chart-data'),
                api.get('/admin/bookings'),
                api.get('/admin/contacts'),
                api.get('/admin/theatres'),
                api.get('/admin/gallery'),
                api.get('/admin/packages'),
                api.get('/admin/addons')
            ]);
            
            // Update the state with all the fetched data
            setData({
                analytics: analyticsRes.data,
                chartData: chartDataRes.data,
                bookings: bookingsRes.data,
                contacts: contactsRes.data,
                theatres: theatresRes.data,
                galleryImages: galleryRes.data,
                packages: packagesRes.data,
                addons: addonsRes.data,
            });
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            // If any request fails due to an authentication error (401), log the user out
            if (error.response && error.response.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    }, [handleLogout]); // The dependency array is now correct, satisfying the ESLint rule.

    // This effect runs once when the component first mounts to fetch all initial data
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // This function acts as a router to render the correct view component
    const renderActiveView = () => {
        if (loading) {
            return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Dashboard Content...</div>;
        }
        switch (activeView) {
            case 'bookings':
                return <BookingsTable bookings={data.bookings} />;
            case 'contacts':
                return <ContactsTable contacts={data.contacts} />;
            case 'theatres':
                return <TheatreManager theatres={data.theatres} onUpdate={fetchData} />;
            case 'gallery':
                return <GalleryManager images={data.galleryImages} onUpdate={fetchData} />;
            case 'packages':
                return <PackageManager packages={data.packages} onUpdate={fetchData} />;
            case 'addons':
                return <AddonManager addons={data.addons} onUpdate={fetchData} />;
            case 'offers':
                return <OfferManager />;
            case 'createBooking':
                 return <CreateBooking theatres={data.theatres} packages={data.packages} addons={data.addons} onBookingCreated={fetchData} />;
            case 'analytics':
            default:
                return <AnalyticsView analytics={data.analytics} chartData={data.chartData} />;
        }
    };

    return (
        <div>
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