import React, { useEffect, useRef } from 'react';

const Cursor = () => {
    const cursorDotRef = useRef(null);
    const cursorGlowRef = useRef(null);

    useEffect(() => {
        const moveCursor = (e) => {
            const { clientX, clientY } = e;
            if (cursorGlowRef.current) {
                cursorGlowRef.current.style.transform = `translate(${clientX}px, ${clientY}px)`;
            }
            if (cursorDotRef.current) {
                cursorDotRef.current.style.transform = `translate(${clientX}px, ${clientY}px)`;
            }
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    return (
        <>
            <div ref={cursorGlowRef} className="cursor-glow"></div>
            <div ref={cursorDotRef} className="cursor-dot"></div>
        </>
    );
};

export default Cursor;