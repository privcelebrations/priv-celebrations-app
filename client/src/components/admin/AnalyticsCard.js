import React from 'react';

const AnalyticsCard = ({ title, value }) => (
    <div className="card">
        <h3>{title}</h3>
        <p>{value}</p>
    </div>
);

export default AnalyticsCard;