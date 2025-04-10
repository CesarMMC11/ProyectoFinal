import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
   
    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };
   
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/auth/login');
    };
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
   
    return (
        <div className="admin-sidebar-wrapper">
            <div className="admin-sidebar-header">
                <h2>Panel de Administración</h2>
                <button className="admin-nav-toggle" onClick={toggleMenu} aria-label="Abrir menú">
                    <span className="admin-hamburger"></span>
                    <span className="admin-hamburger"></span>
                    <span className="admin-hamburger"></span>
                </button>
            </div>
            
            <ul className={isMenuOpen ? "admin-sidebar-menu active" : "admin-sidebar-menu"}>
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
                <li className={isActive('/admin/payments')}>
                    <Link to="/admin/payments">Gestión de Pagos</Link>
                </li>
                <li>
                    <button onClick={handleLogout} className="admin-logout-btn">
                        Cerrar Sesión
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default AdminSidebar;
