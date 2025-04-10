import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Header = () => {
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [pendingRequests, setPendingRequests] = useState([]);
const [loading, setLoading] = useState(false);
const navigate = useNavigate();

const toggleMenu = () => {
setIsMenuOpen(!isMenuOpen);
};

const handleLogout = () => {
localStorage.removeItem("token");
navigate("/login");
};

// Función para obtener las solicitudes pendientes
const fetchPendingRequests = async () => {
try {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) return;
    
    const response = await fetch( `${import.meta.env.VITE_API_URL}/amigos/pending`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    });

    const data = await response.json();

    if (response.ok) {
    setPendingRequests(data);
    }
} catch (error) {
    console.error('Error al obtener solicitudes pendientes:', error);
} finally {
    setLoading(false);
}
};

// Cargar solicitudes pendientes al montar el componente
useEffect(() => {
fetchPendingRequests();

// Configurar intervalo para verificar periódicamente (cada 60 segundos)
const interval = setInterval(() => {
    fetchPendingRequests();
}, 60000);

// Limpiar intervalo al desmontar
return () => clearInterval(interval);
}, []);

// Manejar clic en el icono de notificación
const handleNotificationClick = () => {
// Redirigir a la sección de solicitudes en la página de perfil
navigate("/amigos");
};

return (
<header>
    <div className="container">
    <div className="header-content">
        <Link to="" className="logo">
        <img src="../../imagenes/logoCP.jpg" alt="" />
        PADEL CLUB COMMAND PARK
        </Link>
        <nav>
        <button className="nav-toggle" onClick={toggleMenu} aria-label="Abrir menú">
            <span className="hamburger"></span>
            <span className="hamburger"></span>
            <span className="hamburger"></span>
        </button>
        <ul className={isMenuOpen ? "active" : ""}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/reservaciones">Reservaciones</Link></li>
            <li><Link to="/torneos">Torneos</Link></li>
            <li><Link to="/clases">Clases</Link></li>
            <li><Link to="/perfil">Perfil</Link></li>
            <li>
            <div className="notification-icon" onClick={handleNotificationClick}>
                <i className="fas fa-bell"></i>
                {pendingRequests.length > 0 && (
                <span className="notification-badge">{pendingRequests.length}</span>
                )}
            </div>
            </li>
            <li>
            <button onClick={handleLogout} className="logout-btn-user">Cerrar Sesión</button>
            </li>
        </ul>
        </nav>
    </div>
    </div>
</header>
);
};

export default Header;
