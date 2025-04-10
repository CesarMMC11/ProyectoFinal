import React from "react";

const AboutUsModal = ({ onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Sobre Nosotros</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <h3>Club Command Park</h3>
                    <p>Somos un club de pádel dedicado a proporcionar la mejor experiencia para los amantes de este deporte. Fundado en [año], Club Command Park se ha convertido en un referente en la comunidad del pádel.</p>
                    
                    <h4>Nuestras Instalaciones</h4>
                    <p>Contamos con modernas instalaciones que incluyen:</p>
                    <ul>
                        <li>X canchas de pádel profesionales</li>
                        <li>Vestuarios con duchas</li>
                        <li>Área de descanso y cafetería</li>
                        <li>Tienda de equipamiento deportivo</li>
                        <li>Estacionamiento gratuito</li>
                    </ul>
                    
                    <h4>Nuestro Equipo</h4>
                    <p>Nuestro equipo está formado por profesionales apasionados por el pádel, dispuestos a ayudarte a mejorar tu juego y disfrutar al máximo de este deporte.</p>
                    
                    <h4>Comunidad</h4>
                    <p>En Club Command Park no solo ofrecemos un lugar para jugar, sino que hemos creado una comunidad donde los jugadores de todos los niveles pueden conectarse, aprender y disfrutar juntos.</p>
                </div>
            </div>
        </div>
    );
};

export default AboutUsModal;
