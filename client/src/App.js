import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainWebsite from './pages/MainWebsite';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './assets/main.css';
import './assets/admin.css';

/**
 * A wrapper for routes that require authentication.
 * If the user is not authenticated (i.e., no token in localStorage),
 * it redirects them to the admin login page.
 */
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/admin" />;
};

/**
 * A helper component that adds a specific class to the <body> tag
 * when the user is on an admin route. This is used to disable the
 * custom cursor and apply other admin-specific base styles.
 */
const BodyClassManager = () => {
    const location = useLocation();
    useEffect(() => {
        // If the current URL path starts with '/admin', add the class
        if (location.pathname.startsWith('/admin')) {
            document.body.classList.add('admin-body');
        } else {
            // Otherwise, remove it
            document.body.classList.remove('admin-body');
        }
    }, [location]); // Re-run this effect whenever the location changes

    return null; // This component does not render any visible elements
};

function App() {
  return (
    <Router>
      <BodyClassManager />
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