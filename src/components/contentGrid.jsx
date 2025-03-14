import React from "react";
import { Link } from "react-router-dom";

const ContentGrid = () => {
    return (
        <>
        <div className="container">
        <section className="content-grid">
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

            {/* Classes Card */}
            <div className="tournament-card">
                <h2>CLASES PERSONALIZADAS</h2>

                <div className="tournament-item">
                    <div className="tournament-icon">
                        <i className="fas fa-triangle-exclamation"></i>
                    </div>
                    <div className="tournament-info">
                        <h3>CLASES PRIVADAS</h3>
                        <p>Disfruta de clases personalizadas, solo tú y el entrenador, a tu ritmo, a tu tiempo.</p>
                    </div>
                </div>

                <div className="tournament-item">
                    <div className="tournament-icon">
                        <i className="fas fa-triangle-exclamation"></i>
                    </div>
                    <div className="tournament-info">
                        <h3>CLASES EN GRUPO</h3>
                        <p>Inscríbete en clases grupales con tus amigos, ¡así pueden aprender entre todos!</p>
                    </div>
                </div>

                <div className="tournament-item">
                    <div className="tournament-icon">
                        <i className="fas fa-triangle-exclamation"></i>
                    </div>
                    <div className="tournament-info">
                        <h3>MEJORA TUS HABILIDADES</h3>
                        <p>¡La práctica constante hace al maestro! No esperes más para mejorar tu juego.</p>
                    </div>
                </div>
            </div>
        </section>
        </div>
        </>
    );
};

export default ContentGrid;

