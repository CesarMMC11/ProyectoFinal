import React from "react";

const MissionModal = ({ onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Misión y Visión</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <h3>Nuestra Misión</h3>
                    <p>En Club Command Park, nuestra misión es promover el pádel como un deporte inclusivo y accesible para personas de todas las edades y niveles de habilidad. Nos comprometemos a proporcionar instalaciones de primera clase, entrenamiento profesional y un ambiente acogedor donde los jugadores puedan desarrollar sus habilidades, mantenerse activos y formar parte de una comunidad vibrante.</p>
                    
                    <h3>Nuestra Visión</h3>
                    <p>Aspiramos a ser reconocidos como el club de pádel líder en la región, estableciendo nuevos estándares de excelencia en instalaciones, servicio al cliente y desarrollo deportivo. Buscamos expandir nuestra comunidad, fomentar el crecimiento del pádel y ser un punto de referencia para torneos y eventos de alto nivel.</p>
                    
                    <h3>Nuestros Valores</h3>
                    <ul>
                        <li><strong>Pasión:</strong> Amamos el pádel y transmitimos ese entusiasmo en todo lo que hacemos.</li>
                        <li><strong>Excelencia:</strong> Nos esforzamos por ofrecer la mejor experiencia posible en todos los aspectos de nuestro club.</li>
                        <li><strong>Comunidad:</strong> Fomentamos un ambiente inclusivo donde todos se sientan bienvenidos.</li>
                        <li><strong>Innovación:</strong> Buscamos constantemente mejorar nuestras instalaciones y servicios.</li>
                        <li><strong>Respeto:</strong> Valoramos a cada miembro, visitante y empleado de nuestra comunidad.</li>
                    </ul>
                    
                    <h3>Objetivos Estratégicos</h3>
                    <ol>
                        <li>Expandir nuestras instalaciones para satisfacer la creciente demanda.</li>
                        <li>Desarrollar programas de entrenamiento para jugadores de todos los niveles.</li>
                        <li>Organizar torneos y eventos que promuevan el pádel en la comunidad.</li>
                        <li>Establecer alianzas con escuelas y organizaciones locales para introducir el pádel a nuevas audiencias.</li>
                        <li>Implementar prácticas sostenibles en todas nuestras operaciones.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default MissionModal;
