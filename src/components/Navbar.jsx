import React from "react";
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <>
        <div className="container">
        <section className="hero">
            <div className="hero-title">
                <div className="side-text left">
                    <Link to='/Ubicacion'>Ubicacion</Link>
                </div>
                    <h1>PADEL CLUB COMMAND PARK</h1>
                <div className="side-text right">
                    <Link to='/Perfil'>Perfil</Link>
                </div>
            </div>
            <div className="divider"></div>
        </section>
        </div>
        
        </>
        
    );
};

export default Navbar;


