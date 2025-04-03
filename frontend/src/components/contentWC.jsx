import React from "react";
import { Link } from "react-router-dom";

const ContentWC = () => {
    return (
        <>
        <div className="container">
        <section className="content-WC">
            {/* Welcome Card */}
            <div className="welcome-card">
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
                <h2>PROXIMOS TORNEOS </h2>

                <div className="tournament-item">
                    <div className="tournament-icon">
                        <i className="fas fa-triangle-exclamation"></i>
                    </div>
                    <div className="tournament-info">
                        <h3>GRAN TORNEO INAUGURACION</h3>
                        <p>Torneo para celebrar la apertura del club.</p>
                    </div>
                </div>

                <div className="tournament-item">
                    <div className="tournament-icon">
                        <i className="fas fa-triangle-exclamation"></i>
                    </div>
                    <div className="tournament-info">
                        <h3>TORNEO TIPO AMERICANO</h3>
                        <p>Torneo donde vas a poder mostrar tu habilidades, es un torneo Suma 9.</p>
                    </div>
                </div>

                <div className="tournament-item">
                    <div className="tournament-icon">
                        <i className="fas fa-triangle-exclamation"></i>
                    </div>
                    <div className="tournament-info">
                        <h3>TORNEO FEMENINO</h3>
                        <p>Un torneo exclusivo para chicas, ven con tus amigas y disfruta de una tarde de Padel, fecha por confirmarse.</p>
                    </div>
                </div>
            </div>

        </section>
        </div>
        </>
    );
};

export default ContentWC;

