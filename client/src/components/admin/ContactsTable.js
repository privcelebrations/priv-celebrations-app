import React from 'react';

const ContactsTable = ({ contacts }) => {
    return (
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
    );
};

export default ContactsTable;