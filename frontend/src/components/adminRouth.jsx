import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // Verificar si el usuario es admin basado en localStorage
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');
        
        setIsAdmin(!!token && userRole === 'admin');
        setLoading(false);
    }, []);
    
    if (loading) {
        return <div className="loading-spinner">Cargando...</div>;
    }
    
    if (!isAdmin) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return children;
};

export default AdminRoute;
