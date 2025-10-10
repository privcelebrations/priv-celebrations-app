import React from 'react';
import api from '../../services/api';

const BookingsTable = ({ bookings, onUpdate }) => {
    // List of possible statuses for the dropdown menu
    const statusOptions = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

    /**
     * Handles the change event from the status dropdown.
     * @param {string} bookingId - The ID of the booking to update.
     * @param {object} event - The browser's change event object from the <select> element.
     */
    const handleStatusChange = async (bookingId, event) => {
        // --- THIS IS THE KEY CORRECTION ---
        // We get the new status from `event.target.value`.
        const newStatus = event.target.value;

        try {
            // Send the API request to the backend with the new status
            await api.put(`/admin/bookings/${bookingId}/status`, { status: newStatus });
            // onUpdate() is a function passed from the parent (AdminDashboard)
            // that re-fetches all data to show the change immediately.
            if(onUpdate) {
                onUpdate();
            }
        } catch (error)
        {
            console.error("Failed to update booking status:", error);
            alert("Error: Could not update status. Please try again.");
        }
    };

    /**
     * Handles the "Export to CSV" button click.
     * It converts the booking data into a CSV formatted string and triggers a download.
     */
    const exportToCSV = () => {
        if (!bookings || bookings.length === 0) {
            alert("There are no bookings to export.");
            return;
        }

        // Define the headers for the CSV file
        const headers = [
            "ID", "Status", "Customer Name", "Phone", "Event Date", "Theatre", 
            "Package", "Party Size", "Selected Addons", "Special Requests", "Booking Date"
        ];
        
        // Sanitize and format each row of booking data for CSV
        const rows = bookings.map(b => [
            b.id,
            b.status,
            `"${(b.name || '').replace(/"/g, '""')}"`, // Handle names with quotes
            b.phone,
            new Date(b.datetime).toLocaleString(),
            b.theatre_name,
            b.package_name || 'N/A',
            b.party_size,
            `"${(b.selected_addons || 'None').replace(/"/g, '""')}"`,
            `"${(b.requests || 'None').replace(/"/g, '""')}"`,
            new Date(b.created_at).toLocaleDateString()
        ]);

        // Combine headers and rows, ensuring each row is on a new line
        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");

        // Create a temporary link element and trigger the download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
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
                                        {/* The select element triggers handleStatusChange on change */}
                                        <select 
                                            value={b.status} 
                                            // The onChange now correctly passes the event object
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
