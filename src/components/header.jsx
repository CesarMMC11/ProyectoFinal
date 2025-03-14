import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header>
            <div className="container">
                <div className="header-content">
                    <Link to="" className="logo">
                    <img src="../../imagenes/logoCP.jpg" alt="" />
                        PADEL CLUB COMMAND PARK
                    </Link>
                    <nav>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/reservaciones">Reservaciones</Link></li>
                            <li><Link to="/torneos">Torneos</Link></li>
                            <li><Link to="/clases">Clases</Link></li>
                            <li><Link to="/contacto">Contacto</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;




