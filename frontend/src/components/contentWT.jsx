import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap"; // Importamos GSAP

const ContentWT = () => {
    // Creamos referencias para las tarjetas
    const welcomeCardRef = useRef(null);
    const classesCardRef = useRef(null);

    useEffect(() => {
        // Animación para la tarjeta Welcome (desde la izquierda)
        gsap.fromTo(
            welcomeCardRef.current,
            { x: '-100%', opacity: 0 }, // Posición inicial fuera de la pantalla por la izquierda
            { x: '0%', opacity: 1, duration: 1.5, ease: 'power3.out' } // Posición final
        );

        // Animación para la tarjeta Classes (desde la derecha)
        gsap.fromTo(
            classesCardRef.current,
            { x: '100%', opacity: 0 }, // Posición inicial fuera de la pantalla por la derecha
            { x: '0%', opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.5 } // Posición final
        );
    }, []);

    return (
        <>
        <div className="container">
            <section className="content-WT">
                {/* Tarjeta de Bienvenida */}
                <div className="welcome-card" ref={welcomeCardRef}>
                    <div className="welcome-text">
                        <h2>Realiza Reservaciones desde nuestra página web</h2>
                        <div>
                            <Link to="/reservaciones">
                                <button>Reservar</button>
                            </Link>
                        </div>
                    </div>
                </div>            

                {/* Tarjeta de Clases */}
                <div className="tournament-card" ref={classesCardRef}>
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

export default ContentWT;
