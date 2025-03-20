import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
const [isMenuOpen, setIsMenuOpen] = useState(false);

const toggleMenu = () => {
setIsMenuOpen(!isMenuOpen);
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
            <li><Link to="/login">Iniciar Sesión</Link></li>
            <li><Link to="/registro">Registrarse</Link></li>
        </ul>
        </nav>
    </div>
    </div>
</header>
);
};

export default Header;





