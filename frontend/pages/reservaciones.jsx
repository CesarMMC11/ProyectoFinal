import React, { useState } from 'react';
import Header from '../src/components/header';
import Navbar from '../src/components/Navbar';
import ContentWR from '../src/components/contentWR';
import Location from '../src/components/location';
import Footer from '../src/components/footer';

const Reservaciones = () => {
    const [formData, setFormData] = useState({
        fecha: '',
        nombre: '',
        apellido: '',
        hora: '',
        telefono: '',
        email: '',
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log('Datos del formulario:', formData); // Verifica los datos enviados
    
        try {
            const token = localStorage.getItem('token'); // Obtén el token del localStorage
            console.log('Token:', token); // Verifica el token
    
            if (!token) {
                alert('Debes iniciar sesión para realizar esta acción.');
                return;
            }
    
            const response = await fetch('http://localhost:3456/reservas/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Envía el token en el encabezado
                },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert('Reserva creada exitosamente');
                console.log('Reserva creada:', data.reserva);
            } else {
                alert(data.message || 'Error al crear la reserva');
                console.error('Error del servidor:', data);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Error al conectar con el servidor');
        }
    };
    

    return (
        <>
            <Header />
            <Navbar />
            <div className="container">
                <section className="booking-section">
                    <h1 className="booking-title">Reserva tu Pista</h1>
                    <div className="booking-card">
                        <div className="booking-tabs">
                            <div className="tab active">Pista</div>
                        </div>
                        <form className="booking-form" onSubmit={handleSubmit}>
                            <h2 className="form-title">Reserva tu pista de pádel</h2>
                            <div className="form-grid">
                                {/* Fecha */}
                                <div className="form-group">
                                    <label>Fecha</label>
                                    <div className="icon-input">
                                        <input
                                            type="date"
                                            name="fecha"
                                            className="form-control"
                                            value={formData.fecha}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Nombre */}
                                <div className="form-group">
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        className="form-control"
                                        placeholder="Tu nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {/* Apellido */}
                                <div className="form-group">
                                    <label>Apellido</label>
                                    <input
                                        type="text"
                                        name="apellido"
                                        className="form-control"
                                        placeholder="Tu Apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {/* Hora */}
                                <div className="form-group">
                                    <label>Hora</label>
                                    <div className="icon-input">
                                        <input
                                            type="time"
                                            name="hora"
                                            className="form-control"
                                            value={formData.hora}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Teléfono */}
                                <div className="form-group">
                                    <label>Teléfono de contacto</label>
                                    <input
                                        type="number"
                                        name="telefono"
                                        className="form-control"
                                        placeholder="Tu número de teléfono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {/* Email */}
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Tu correo electrónico"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            {/* Botón de enviar */}
                            <button type="submit" className="submit-btn">
                                Reservar Pista
                            </button>
                            <p className="form-footer">
                                Por favor, revisa los detalles antes de confirmar tu reserva
                            </p>
                        </form>
                    </div>
                </section>
            </div>
            <ContentWR />
            <Location />
            <Footer />
        </>
    );

};

export default Reservaciones;