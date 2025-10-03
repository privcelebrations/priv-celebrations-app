import React, { useEffect } from 'react';

const Cursor = () => {

    useEffect(() => {
        // This is the core of the new, efficient logic.
        // It simply updates CSS variables with the mouse coordinates.
        const updateCursorPosition = (e) => {
            document.documentElement.style.setProperty('--x', e.clientX + 'px');
            document.documentElement.style.setProperty('--y', e.clientY + 'px');
        };

        // We only need one event listener.
        window.addEventListener('mousemove', updateCursorPosition);

        // This effect also handles adding a class to the body when hovering over links.
        // The CSS will handle the "magnetic" animation based on this class.
        const handleMouseOver = (e) => {
            if (e.target.closest('a, button, input, select, textarea, .card, .modal-trigger')) {
                document.body.classList.add('cursor-hover');
            }
        };

        const handleMouseOut = (e) => {
            if (e.target.closest('a, button, input, select, textarea, .card, .modal-trigger')) {
                document.body.classList.remove('cursor-hover');
            }
        };

        document.body.addEventListener('mouseover', handleMouseOver);
        document.body.addEventListener('mouseout', handleMouseOut);

        // Cleanup function
        return () => {
            window.removeEventListener('mousemove', updateCursorPosition);
            document.body.removeEventListener('mouseover', handleMouseOver);
            document.body.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    // The JSX is now much simpler.
    return (
        <>
            <div className="cursor-dot"></div>
            <div className="cursor-circle"></div>
        </>
    );
};

export default Cursor;