import React from 'react';

const BookingsTable = ({ bookings }) => (
    <div className="table-container">
        <table>
            <thead>
                <tr>
                    <th>Date Submitted</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Event Date</th>
                    <th>Theatre</th>
                    <th>Guests</th>
                    <th>Addons</th>
                    <th>Requests</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map(b => (
                    <tr key={b.id}>
                        <td>{new Date(b.created_at).toLocaleString()}</td>
                        <td>{b.name}</td>
                        <td>{b.phone}</td>
                        <td>{new Date(b.datetime).toLocaleString()}</td>
                        <td>{b.theatre_name}</td>
                        <td>{b.party_size}</td>
                        <td>{b.addons || '-'}</td>
                        <td>{b.requests || '-'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default BookingsTable;