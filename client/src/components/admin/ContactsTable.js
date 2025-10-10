import React from 'react';

const ContactsTable = ({ contacts }) => {

    const exportToCSV = () => {
        if (contacts.length === 0) {
            alert("There are no contacts to export.");
            return;
        }

        const headers = ["ID", "Submission Date", "Name", "Email", "Message"];
        const rows = contacts.map(c => [
            c.id,
            new Date(c.created_at).toLocaleString(),
            `"${c.name.replace(/"/g, '""')}"`,
            c.email,
            `"${c.message.replace(/"/g, '""')}"`
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `priv_contacts_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="data-table-section">
            <div className="table-header">
                <h2>Contact Inquiries</h2>
                <button onClick={exportToCSV}>Export to CSV</button>
            </div>
            <div className="table-container">
                {contacts.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Date Submitted</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map(c => (
                                <tr key={c.id}>
                                    <td>{new Date(c.created_at).toLocaleString()}</td>
                                    <td>{c.name}</td>
                                    <td>{c.email}</td>
                                    <td style={{ whiteSpace: 'pre-wrap', minWidth: '300px' }}>{c.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No contact inquiries yet.</p>
                )}
            </div>
        </div>
    );
};

export default ContactsTable;
