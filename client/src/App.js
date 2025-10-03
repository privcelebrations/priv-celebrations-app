import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import assets and components
import MainWebsite from './pages/MainWebsite';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import BackgroundSlideshow from './components/main/BackgroundSlideshow'; // <-- Import the new component
import './assets/main.css';
import './assets/admin.css';

/**
 * A wrapper for routes that require authentication.
 */
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/admin" />;
};

/**
 * A helper component that adds a class to the <body> tag on admin routes.
 */
const BodyClassManager = () => {
    const location = useLocation();
    useEffect(() => {
        if (location.pathname.startsWith('/admin')) {
            document.body.classList.add('admin-body');
        } else {
            document.body.classList.remove('admin-body');
        }
    }, [location]);

    return null;
};

function App() {
  // We do not initialize Google Tag Manager here anymore to simplify.
  // It can be added back if needed following previous instructions.

  return (
    <Router>
      <BodyClassManager />
      
      {/* --- THIS IS THE KEY CHANGE --- */}
      {/* The BackgroundSlideshow and SiteOverlay are now rendered here, at the top level, */}
      {/* so they will persist across the entire customer-facing website. */}
      <BackgroundSlideshow />
      <div className="site-overlay"></div>

      <Routes>
        {/* Publicly accessible route for the main website */}
        <Route path="/" element={<MainWebsite />} />
        
        {/* Publicly accessible route for the admin login page */}
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* A protected route for the admin dashboard */}
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        
        {/* A catch-all redirect for any other paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;