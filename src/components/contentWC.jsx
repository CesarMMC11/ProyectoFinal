import React from "react";
import { Link } from "react-router-dom";

const ContentWC = () => {
    return (
        <>
        <div className="container">
        <section className="content-WC">
            {/* Welcome Card */}
            <div className="welcome-card2">
                <div className="welcome-text">
                    <h2>Realiza Reservaciones desde nuestra página web</h2>
                    <div>
                        <Link to="/reservaciones">
                            <button>Reservar</button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tournaments Card */}
            <div className="tournament-card">
                <h2>TORNEOS DISPONIBLES</h2>

                <div className="tournament-item">
                    <div className="tournament-icon">
                        <i className="fas fa-triangle-exclamation"></i>
                    </div>
                    <div className="tournament-info">
                        <h3>PREMIER PADEL</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero.</p>
                    </div>
                </div>

                <div className="tournament-item">
                    <div className="tournament-icon">
                        <i className="fas fa-triangle-exclamation"></i>
                    </div>
                    <div className="tournament-info">
                        <h3>WORLD PADEL TOUR</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero.</p>
                    </div>
                </div>

                <div className="tournament-item">
                    <div className="tournament-icon">
                        <i className="fas fa-triangle-exclamation"></i>
                    </div>
                    <div className="tournament-info">
                        <h3>GRAN TORNEO INAUGURACIÓN</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero.</p>
                    </div>
                </div>
            </div>

        </section>
        </div>
        </>
    );
};

export default ContentWC;

