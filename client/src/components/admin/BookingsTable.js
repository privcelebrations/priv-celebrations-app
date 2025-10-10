import React from 'react';
import api from '../../services/api';

const BookingsTable = ({ bookings, onUpdate }) => {
    const statusOptions = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

    const handleStatusChange = async (bookingId, event) => {
        const newStatus = event.target.value;
        try {
            await api.put(`/admin/bookings/${bookingId}/status`, { status: newStatus });
            if(onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error("Failed to update booking status:", error);
            alert("Error: Could not update status. Please try again.");
        }
    };

    /**
     * --- THIS IS THE CORRECTED EXPORT FUNCTION ---
     */
    const exportToCSV = () => {
        if (!bookings || bookings.length === 0) {
            alert("There are no bookings to export.");
            return;
        }

        // Helper function to safely format a value for CSV
        const sanitizeCSV = (value) => {
            if (value === null || value === undefined) {
                return '';
            }
            const str = String(value);
            // If the string contains a comma, double quote, or newline, wrap it in double quotes.
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                // Also, escape any existing double quotes by doubling them up.
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        // Define the headers for the CSV file
        const headers = [
            "ID", "Status", "Customer Name", "Phone", "Event Date", "Theatre", 
            "Package", "Party Size", "Selected Addons", "Special Requests", "Booking Date"
        ];
        
        // Convert the booking data into an array of arrays, sanitizing each value
        const rows = bookings.map(b => [
            b.id,
            b.status,
            b.name,
            b.phone,
            new Date(b.datetime).toLocaleString(), // The date will be wrapped in quotes
            b.theatre_name,
            b.package_name || 'N/A',
            b.party_size,
            b.selected_addons || 'None',
            b.requests || 'None',
            new Date(b.created_at).toLocaleDateString()
        ].map(sanitizeCSV)); // Apply the sanitizer to every item in the row

        // Combine headers and rows
        let csvContent = headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");

        // Create a Blob for better file handling
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        // Create a link and trigger the download
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `priv_bookings_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="data-table-section">
            <div className="table-header">
                <h2>Current Bookings</h2>
                <button onClick={exportToCSV}>Export to CSV</button>
            </div>
            <div className="table-container">
                {bookings && bookings.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Customer Details</th>
                                <th>Event Details</th>
                                <th>Package & Addons</th>
                                <th>Requests</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b.id}>
                                    <td>
                                        <select 
                                            value={b.status} 
                                            onChange={(event) => handleStatusChange(b.id, event)}
                                            className={`status-select status-${b.status?.toLowerCase().replace(' ', '-') || 'pending'}`}
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <strong>{b.name}</strong><br/>
                                        <small>{b.phone}</small><br/>
                                        <small>Booked on: {new Date(b.created_at).toLocaleDateString()}</small>
                                    </td>
                                    <td>
                                        <strong>{b.theatre_name}</strong> ({b.party_size} guests)<br/>
                                        <small>{new Date(b.datetime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</small>
                                    </td>
                                    <td>
                                        <strong>Package:</strong> {b.package_name || 'N/A'}<br/>
                                        <small><strong>Addons:</strong> {b.selected_addons || 'None'}</small>
                                    </td>
                                    <td style={{ whiteSpace: 'pre-wrap', minWidth: '250px' }}>
                                        {b.requests || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No bookings found.</p>
                )}
            </div>
        </div>
    );
};

export default BookingsTable;
