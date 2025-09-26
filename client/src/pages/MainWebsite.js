import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

// Import all required components, including the new BackgroundSlideshow
import BackgroundSlideshow from '../components/main/BackgroundSlideshow';
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
    const [data, setData] = useState({ theatres: [], packages: [], addons: [] });
    const [activePage, setActivePage] = useState('page-home');
    const [modalData, setModalData] = useState(null);
    const [preselectedTheatre, setPreselectedTheatre] = useState(null);
    const mainContainerRef = useRef(null);

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
        const contentElement = mainContainerRef.current;
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
        const contentElement = mainContainerRef.current;
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

    const PageComponent = () => {
        switch (activePage) {
            case 'page-theatres':
                return <Theatres theatres={data.theatres} onCardClick={setModalData} />;
            case 'page-packages':
                return <Packages packages={data.packages} onCardClick={setModalData} />;
            case 'page-booking':
                return <Booking theatres={data.theatres} packages={data.packages} addons={data.addons} preselectedTheatre={preselectedTheatre} />;
            case 'page-gallery':
                return <Gallery theatres={data.theatres} />;
            case 'page-contact':
                return <Contact />;
            default: // 'page-home'
                return (
                    <>
                        <Hero onNavClick={handleNavClick} />
                        <QuickView theatres={data.theatres} onTheatreSelect={handleQuickViewSelect} />
                    </>
                );
        }
    };

    return (
        <>
            {/* These are now the global elements that persist across the entire site */}
            <BackgroundSlideshow />
            <div className="site-overlay"></div>
            
            {/* The rest of the site content is rendered on top of the background and overlay */}
            <Cursor />
            <Header onNavClick={handleNavClick} />

            <main ref={mainContainerRef} style={{ transition: 'opacity 0.6s ease-in-out' }}>
                {PageComponent()}
            </main>

            <Footer onNavClick={handleNavClick} />
            
            {modalData && <Modal data={modalData} onClose={() => setModalData(null)} onNavClick={handleNavClick} />}
            <WhatsAppButton />
        </>
    );
};

export default MainWebsite;