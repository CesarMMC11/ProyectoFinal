import React, { useState } from "react";

const ContactModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes implementar la lógica para enviar el formulario
        console.log("Formulario enviado:", formData);
        alert("¡Gracias por contactarnos! Te responderemos pronto.");
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Contáctanos</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="contact-options">
                        <div className="contact-option">
                            <h3>WhatsApp</h3>
                            <p>Contáctanos directamente:</p>
                            <a href="https://wa.me/5804242853055" target="_blank" rel="noopener noreferrer" className="whatsapp-button">
                                <i className="fab fa-whatsapp"></i> +58 0424-2853055
                            </a>
                        </div>
                        
                        <div className="contact-option">
                            <h3>Correo Electrónico</h3>
                            <p>Escríbenos a:</p>
                            <a href="mailto:contacto@commandpark.com" className="email-button">
                                commandPark@gmail.com
                            </a>
                        </div>
                    </div>

                    <div className="contact-form">
                        <h3>Formulario de Contacto</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Nombre:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Correo Electrónico:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Mensaje:</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="submit-button">Enviar Mensaje</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
