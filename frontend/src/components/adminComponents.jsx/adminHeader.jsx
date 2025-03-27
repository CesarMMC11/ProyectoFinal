import React from 'react';

const AdminHeader = ({ title }) => {
    return (
        <div className="admin-header">
            <h1>{title}</h1>
            <div className="admin-header-actions">
                <span className="admin-date">{new Date().toLocaleDateString()}</span>
            </div>
        </div>
    );
};

export default AdminHeader;
