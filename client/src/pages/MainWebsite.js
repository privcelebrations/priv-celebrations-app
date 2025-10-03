import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

// Import all required components
import Preloader from '../components/main/Preloader';
import Cursor from '../components/main/Cursor';
import Header from '../components/main/Header';
import Hero from '../components/main/Hero';
import QuickView from '../components/main/QuickView';
import Theatres from '../components/main/Theatres';
import Packages from '../components/main/Packages';
import Booking from '../components/main/Booking';
import Gallery from '../components/main/Gallery';
import Contact from '../components/main/Contact';
import Footer from '../components/main/Footer';
import Modal from '../components/main/Modal';
import WhatsAppButton from '../components/main/WhatsAppButton';

const MainWebsite = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ theatres: [], packages: [], addons: [], galleryImages: [] });
    const [activePage, setActivePage] = useState('page-home');
    const [modalData, setModalData] = useState(null);
    const [preselectedTheatre, setPreselectedTheatre] = useState(null);
    
    // --- THIS IS THE CORRECTED PART ---
    // The ref definition is now correctly placed here.
    const mainContentRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/data');
                setData(res.data);
            } catch (err) {
                console.error("Could not fetch website data:", err);
            } finally {
                setTimeout(() => setLoading(false), 2500);
            }
        };
        fetchData();
    }, []);

    const handleNavClick = (page) => {
        const contentElement = mainContentRef.current; // Now correctly defined
        if (contentElement) {
            if (preselectedTheatre) setPreselectedTheatre(null);
            contentElement.style.opacity = 0;
            setTimeout(() => {
                setActivePage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                contentElement.style.opacity = 1;
            }, 600);
        }
    };
    
    const handleQuickViewSelect = (theatreName) => {
        const contentElement = mainContentRef.current; // Now correctly defined
        if (contentElement) {
            setPreselectedTheatre(theatreName);
            contentElement.style.opacity = 0;
            setTimeout(() => {
                setActivePage('page-booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                contentElement.style.opacity = 1;
            }, 600);
        }
    };

    if (loading) {
        return <Preloader />;
    }

    // A helper function to render the correct page component based on state
    const PageComponent = () => {
        switch (activePage) {
            case 'page-theatres':
                return <Theatres theatres={data.theatres} onCardClick={setModalData} />;
            case 'page-packages':
                return <Packages packages={data.packages} onCardClick={setModalData} />;
            case 'page-booking':
                return <Booking theatres={data.theatres} packages={data.packages} addons={data.addons} preselectedTheatre={preselectedTheatre} />;
            case 'page-gallery':
                return <Gallery images={data.galleryImages} />;
            case 'page-contact':
                return <Contact />;
            default:
                // For the homepage, we don't render anything inside the <main> tag
                return null;
        }
    };

    return (
        <>
            <Cursor />
            <Header onNavClick={handleNavClick} />
            
            {/* Conditional Rendering: Show Hero+QuickView ONLY on the homepage */}
            {activePage === 'page-home' && (
                <>
                    <Hero onNavClick={handleNavClick} />
                    <QuickView theatres={data.theatres} onTheatreSelect={handleQuickViewSelect} />
                </>
            )}

            {/* The <main> tag is now only used for the pages that need a transition */}
            <main ref={mainContentRef} style={{ transition: 'opacity 0.6s ease-in-out' }}>
                {activePage !== 'page-home' && PageComponent()}
            </main>
            
            <Footer onNavClick={handleNavClick} />
            
            {modalData && <Modal data={modalData} onClose={() => setModalData(null)} onNavClick={handleNavClick} />}
            <WhatsAppButton />
        </>
    );
};

export default MainWebsite;