import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap"; // Importamos GSAP

const ContentWR = () => {
    // Creamos referencias para las tarjetas
    const torneosRef = useRef(null);
    const clasesRef = useRef(null);

    useEffect(() => {
        // Animación de la tarjeta de Torneos (desde la izquierda)
        gsap.fromTo(
            torneosRef.current,
            { x: '-100%', opacity: 0 }, // Posición inicial fuera de la pantalla por la izquierda
            { x: '0%', opacity: 1, duration: 1.5, ease: 'power3.out' } // Posición final
        );

        // Animación de la tarjeta de Clases (desde la derecha)
        gsap.fromTo(
            clasesRef.current,
            { x: '100%', opacity: 0 }, // Posición inicial fuera de la pantalla por la derecha
            { x: '0%', opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.5 } // Posición final
        );
    }, []);

    return (
        <>
        <div className="container">
            <section className="content-WR">
                {/* Tarjeta de Torneos */}
                <div className="tournament-card" ref={torneosRef}>
                    <h2>PROXIMOS TORNEOS </h2>

                    <div className="tournament-item">
                        <div className="tournament-icon">
                            <i className="fas fa-exclamation"></i>
                        </div>
                        <div className="tournament-info">
                            <h3>GRAN TORNEO INAUGURACION</h3>
                            <p>Torneo para celebrar la apertura del club.</p>
                        </div>
                    </div>

                    <div className="tournament-item">
                        <div className="tournament-icon">
                            <i className="fas fa-exclamation"></i>
                        </div>
                        <div className="tournament-info">
                            <h3>TORNEO TIPO AMERICANO</h3>
                            <p>Torneo donde vas a poder mostrar tu habilidades, es un torneo Suma 9.</p>
                        </div>
                    </div>

                    <div className="tournament-item">
                        <div className="tournament-icon">
                            <i className="fas fa-exclamation"></i>
                        </div>
                        <div className="tournament-info">
                            <h3>TORNEO FEMENINO</h3>
                            <p>Un torneo exclusivo para chicas, ven con tus amigas y disfruta de una tarde de Padel, fecha por confirmarse.</p>
                        </div>
                    </div>
                </div>

                {/* Tarjeta de Clases */}
                <div className="tournament-card" ref={clasesRef}>
                    <h2>CLASES PERSONALIZADAS</h2>

                    <div className="tournament-item">
                        <div className="tournament-icon">
                            <i className="fas fa-exclamation"></i>
                        </div>
                        <div className="tournament-info">
                            <h3>CLASES PRIVADAS</h3>
                            <p>Disfruta de clases personalizadas, solo tú y el entrenador, a tu ritmo, a tu tiempo.</p>
                        </div>
                    </div>

                    <div className="tournament-item">
                        <div className="tournament-icon">
                            <i className="fas fa-exclamation"></i>
                        </div>
                        <div className="tournament-info">
                            <h3>CLASES EN GRUPO</h3>
                            <p>Inscríbete en clases grupales con tus amigos, ¡así pueden aprender entre todos!</p>
                        </div>
                    </div>

                    <div className="tournament-item">
                        <div className="tournament-icon">
                            <i className="fas fa-exclamation"></i>
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

export default ContentWR;
