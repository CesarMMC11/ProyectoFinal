import React from 'react'
import Header from '../src/components/header';
import Navbar from '../src/components/Navbar';
import ContentWC from '../src/components/contentWC'
import Location from '../src/components/location';
import Footer from '../src/components/footer';

const Clases = () => {
    return (
        <>
        <Header/>
        <Navbar/>

        <div className="container">

            <section className="booking-section">
                <h1 className="booking-title">¡ Aqui puedes incribirte en nuestras Clases !</h1>
                <div className="booking-card">
                    <div className="booking-tabs">
                        <div className="tab active">Clases </div>
                    </div>
                    <form className="booking-form">
                        <h2 className="form-title">Reserva tu puesto</h2>
                        <div className="form-grid">
                            {/* Nombre */}
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tu nombre"
                                />
                            </div>
                            {/* Hora */}
                            <div className="form-group">
                                <label>Hora</label>
                                <div className="icon-input">
                                    <input
                                        type="time"
                                        className="form-control"
                                        placeholder="Selecciona hora"
                                    />
                                </div>
                            </div>
                            {/* Teléfono */}
                            <div className="form-group">
                                <label>Teléfono de contacto</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder="Tu número de teléfono"
                                />
                            </div>
                            {/* Email */}
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Tu correo electrónico"
                                />
                            </div>
                        </div>
                        {/* Botón de enviar */}
                        <button type="submit" className="submit-btn">
                            Inscribirse
                        </button>
                        <p className="form-footer">
                            Por favor, revisa los detalles antes de confirmar tu inscripcion
                        </p>
                    </form>
                </div>
            </section>
        </div>

        <ContentWC/>
        <Location/>
        <Footer/>
        </>
    )
}

export default Clases;