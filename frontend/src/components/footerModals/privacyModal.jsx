import React from "react";

const PrivacyModal = ({ onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Políticas y Privacidad</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <h3>Política de Privacidad</h3>
                    <p>En Club Command Park, respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política de privacidad explica cómo recopilamos, utilizamos y protegemos tu información cuando utilizas nuestro sitio web y servicios.</p>
                    
                    <h4>Información que recopilamos</h4>
                    <p>Podemos recopilar información personal como tu nombre, dirección de correo electrónico, número de teléfono y otra información relevante cuando te registras en nuestro sitio, reservas una cancha o te suscribes a nuestro boletín.</p>
                    
                    <h4>Cómo utilizamos tu información</h4>
                    <p>Utilizamos tu información para:</p>
                    <ul>
                        <li>Gestionar tus reservas y membresías</li>
                        <li>Enviarte información sobre eventos y promociones</li>
                        <li>Mejorar nuestros servicios</li>
                        <li>Responder a tus consultas</li>
                    </ul>
                    
                    <h4>Protección de datos</h4>
                    <p>Implementamos medidas de seguridad para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.</p>
                    
                    <h4>Cookies</h4>
                    <p>Nuestro sitio web utiliza cookies para mejorar tu experiencia de navegación. Puedes configurar tu navegador para rechazar todas las cookies o para que te avise cuando se envía una cookie.</p>
                    
                    <h4>Contacto</h4>
                    <p>Si tienes preguntas sobre nuestra política de privacidad, contáctanos a través de contacto@commandpark.com</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyModal;
