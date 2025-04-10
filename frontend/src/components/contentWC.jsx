import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap"; // Importamos GSAP

const ContentWC = () => {
    // Creamos referencias para las tarjetas
    const reservasRef = useRef(null);
    const torneosRef = useRef(null);

    useEffect(() => {
        // Animación de la tarjeta de Reservas (desde la izquierda)
        gsap.fromTo(
            reservasRef.current,
            { x: '-100%', opacity: 0 }, // Posición inicial fuera de la pantalla por la izquierda
            { x: '0%', opacity: 1, duration: 1.5, ease: 'power3.out' } // Posición final
        );

        // Animación de la tarjeta de Torneos (desde la derecha)
        gsap.fromTo(
            torneosRef.current,
            { x: '100%', opacity: 0 }, // Posición inicial fuera de la pantalla por la derecha
            { x: '0%', opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.5 } // Posición final
        );
    }, []);

    return (
        <>
        <div className="container">
            <section className="content-WC">
                {/* Tarjeta de Reservas */}
                <div className="welcome-card" ref={reservasRef}>
                    <div className="welcome-text">
                        <h2>Realiza Reservaciones desde nuestra página web</h2>
                        <div>
                            <Link to="/reservaciones">
                                <button>Reservar</button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tarjeta de Torneos */}
                <div className="tournament-card" ref={torneosRef}>
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
