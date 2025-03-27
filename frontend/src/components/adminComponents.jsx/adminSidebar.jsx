import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/auth/login');
    };
    
    return (
        <div className="admin-sidebar">
            <h2>Panel de Administración</h2>
            <ul>
                <li className={isActive('/admin/dashboard')}>
                    <Link to="/admin/dashboard">Dashboard</Link>
                </li>
                <li className={isActive('/admin/users')}>
                    <Link to="/admin/users">Usuarios</Link>
                </li>
                <li className={isActive('/admin/reservations')}>
                    <Link to="/admin/reservations">Reservaciones</Link>
                </li>
                <li className={isActive('/admin/classes')}>
                    <Link to="/admin/classes">Clases</Link>
                </li>
                <li className={isActive('/admin/tournaments')}>
                    <Link to="/admin/tournaments">Torneos</Link>
                </li>
            </ul>
            <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
        </div>
    );
};

export default AdminSidebar;
