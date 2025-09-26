import React, { useEffect } from 'react';

const Modal = ({ data, onClose }) => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    const renderContent = () => {
        if (data.type === 'theatre') {
            return (
                <>
                    <h2>{data.name}</h2>
                    <p>{data.description}</p>
                    <div className="modal-gallery">
                        {data.images.map((img, i) => <img key={i} src={img} alt={`${data.name} gallery ${i+1}`} />)}
                    </div>
                    <h4>Experience Includes:</h4>
                    <ul>{data.details.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </>
            );
        }
        if (data.type === 'package') {
            return (
                <>
                    <h2>{data.name}</h2>
                    <p>{data.description}</p>
                    <h4>Package Inclusions:</h4>
                    <ul>{data.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
                    <div className="price" style={{ textAlign: 'center', margin: '40px 0' }}>
                        <span style={{ fontSize: '0.6em', textDecoration: 'line-through', color: 'var(--secondary-text)', display: 'block', marginBottom: '-15px' }}>
                            ₹{data.original_price}
                        </span>
                        ₹{data.price}
                    </div>
                </>
            );
        }
        return null;
    };

    return (
        <div className="modal show" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close-button" onClick={onClose}>×</span>
                {renderContent()}
            </div>
        </div>
    );
};

export default Modal;