import React from "react";
import { Link } from "react-router-dom";

const ContentWT = () => {
    return (
        <>
        <div className="container">
        <section className="content-WT">
            {/* Welcome Card */}
            <div className="welcome-card3">
                <div className="welcome-text">
                    <h2>Realiza Reservaciones desde nuestra página web</h2>
                    <div>
                        <Link to="/reservaciones">
                            <button>Reservar</button>
                        </Link>
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

export default ContentWT;

