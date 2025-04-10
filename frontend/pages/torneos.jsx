import React, { useState, useEffect } from 'react';
import Header from '../src/components/header';
import Navbar from '../src/components/Navbar';
import ContentWT from '../src/components/contentWT';
import Location from '../src/components/location';
import Footer from '../src/components/footer';
import SectionImg from '../src/components/sectionImg';
import PaymentModal from '../src/components/payment/paymentModal';

const Torneo = () => {
const [formData, setFormData] = useState({
    fecha: '',
    nombre: '',
    invitado: '',
    hora: '',
    telefono: '',
    email: '',
});

// Estado para las inscripciones del usuario
const [inscripciones, setInscripciones] = useState([]);

// Estado para el modo de edición
const [editMode, setEditMode] = useState(false);
const [editId, setEditId] = useState(null);

// Estado para controlar la carga de datos
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Estado para el modal de pago
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [selectedTorneo, setSelectedTorneo] = useState(null);

// Cargar las inscripciones del usuario al montar el componente
useEffect(() => {
    fetchInscripciones();
}, []);

// Función para cargar las inscripciones del usuario
const fetchInscripciones = async () => {
    setLoading(true);
    setError(null);
    
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.log('Usuario no autenticado');
            setLoading(false);
            return;
        }
        
        console.log('Obteniendo inscripciones del usuario...');
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/torneos/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        console.log('Respuesta del servidor:', response.status, response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Datos recibidos:', data);
            
            // Verificar la estructura de la respuesta
            if (Array.isArray(data)) {
                console.log('Datos son un array, longitud:', data.length);
                setInscripciones(data);
            } else if (data.inscripciones && Array.isArray(data.inscripciones)) {
                console.log('Datos contienen array inscripciones, longitud:', data.inscripciones.length);
                setInscripciones(data.inscripciones);
            } else {
                console.error('Formato de respuesta inesperado:', data);
                setInscripciones([]);
            }
        } else {
            const errorData = await response.json().catch(e => ({ message: 'Error al parsear respuesta' }));
            console.error('Error al obtener inscripciones:', errorData);
            setError(errorData.message || 'Error al obtener inscripciones');
            setInscripciones([]);
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setError('Error al conectar con el servidor');
        setInscripciones([]);
    } finally {
        setLoading(false);
    }
};

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Datos del formulario:', formData);

    try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        if (!token) {
            alert('Debes iniciar sesión para realizar esta acción.');
            return;
        }

        // URL y método según si estamos editando o creando
        const url = editMode
            ? `${import.meta.env.VITE_API_URL}/torneos/update/${editId}`
            : `${import.meta.env.VITE_API_URL}/torneos/create`;
        const method = editMode ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            const mensaje = editMode
                ? 'Inscripción actualizada exitosamente'
                : 'Inscripción creada exitosamente, bienvenido al torneo';
            alert(mensaje);
            
            // Limpiar formulario y resetear modo de edición
            setFormData({
                fecha: '',
                nombre: '',
                invitado: '',
                hora: '',
                telefono: '',
                email: '',
            });
            setEditMode(false);
            setEditId(null);
            
            // Actualizar la lista de inscripciones
            fetchInscripciones();
        } else {
            alert(data.message || 'Error al procesar la inscripción al torneo');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error al conectar con el servidor');
    }
};

// Función para eliminar una inscripción
const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta inscripción?')) {
        return;
    }
    
    try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('Debes iniciar sesión para realizar esta acción.');
            setLoading(false);
            return;
        }
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/torneos/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (response.ok) {
            alert('Inscripción eliminada exitosamente');
            // Actualizar la lista de inscripciones
            setInscripciones(prevInscripciones =>
                prevInscripciones.filter(inscripcion => inscripcion.id !== id)
            );
        } else {
            const errorData = await response.json();
            alert(`Error al eliminar la inscripción: ${errorData.message || 'Error desconocido'}`);
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al conectar con el servidor');
    } finally {
        setLoading(false);
    }
};

// Función para cargar datos en el formulario para editar
const handleEdit = (inscripcion) => {
    setFormData({
        fecha: inscripcion.fecha ? inscripcion.fecha.split('T')[0] : '',
        nombre: inscripcion.nombre || '',
        invitado: inscripcion.invitado || '',
        hora: inscripcion.hora || '',
        telefono: inscripcion.telefono || '',
        email: inscripcion.email || '',
    });
    setEditMode(true);
    setEditId(inscripcion.id);
    
    // Desplazar hacia el formulario
    window.scrollTo({
        top: document.querySelector('.booking-form').offsetTop,
        behavior: 'smooth'
    });
};

// Función para cancelar la edición
const handleCancelEdit = () => {
    setFormData({
        fecha: '',
        nombre: '',
        invitado: '',
        hora: '',
        telefono: '',
        email: '',
    });
    setEditMode(false);
    setEditId(null);
};

// Formatear fecha para mostrar
const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

// Mostrar el modal de pago
const handleShowPaymentModal = (torneo) => {
    setSelectedTorneo(torneo);
    setShowPaymentModal(true);
};

// Cerrar el modal de pago
const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedTorneo(null);
};

// Manejar el pago completado
const handlePaymentComplete = () => {
    fetchInscripciones(); // Actualizar la lista de inscripciones para reflejar el nuevo estado de pago
};

// Renderizar el estado de pago
const renderPaymentStatus = (status) => {
    if (!status) return <span className="payment-status unpaid">No pagado</span>;
    
    switch(status) {
        case 'paid':
            return <span className="payment-status paid">Pagado</span>;
        case 'pending':
            return <span className="payment-status pending">Pendiente</span>;
        case 'unpaid':
        default:
            return <span className="payment-status unpaid">No pagado</span>;
    }
};

return (
    <>
    <Header />
    <Navbar />
    <SectionImg section="torneos" />

    <div className="container">
        <section className="booking-section">
            <h1 className="booking-title">¡Aquí puedes inscribirte en nuestros Torneos Disponibles!</h1>
            <div className="booking-card">
                <div className="booking-tabs">
                    <div className="tab active">Torneos</div>
                </div>
                <form className="booking-form" onSubmit={handleSubmit}>
                    <h2 className="form-title">
                        {editMode ? 'Actualizar inscripción al torneo' : 'Reserva tu puesto'}
                    </h2>
                    <div className="form-grid">
                        {/* Fecha */}
                        <div className="form-group">
                            <label>Fecha</label>
                            <div className="icon-input">
                                <input
                                    type="date"
                                    name="fecha"
                                    value={formData.fecha}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Selecciona fecha"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        {/* Nombre */}
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Tu nombre"
                                required
                                disabled={loading}
                            />
                        </div>
                        {/* Invitado */}
                        <div className="form-group">
                            <label>Invitado</label>
                            <input
                                type="text"
                                name="invitado"
                                value={formData.invitado}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Nombre del invitado"
                                required
                                disabled={loading}
                            />
                        </div>
                        {/* Hora */}
                        <div className="form-group">
                            <label>Hora</label>
                            <div className="icon-input">
                                <input
                                    type="time"
                                    name="hora"
                                    value={formData.hora}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Selecciona hora"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        {/* Teléfono */}
                        <div className="form-group">
                            <label>Teléfono de contacto</label>
                            <input
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Tu número de teléfono"
                                required
                                disabled={loading}
                            />
                        </div>
                        {/* Email */}
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Tu correo electrónico"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    
                    {/* Mostrar mensaje de error si existe */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    
                    {/* Botones de acción */}
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : (editMode ? 'Actualizar Inscripción' : 'Inscribirse en el torneo')}
                        </button>
                        
                        {editMode && (
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={handleCancelEdit}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                    <p className="form-footer">
                        Por favor, revisa los detalles antes de confirmar tu inscripción
                    </p>
                </form>
            </div>
        </section>
        
        {/* Sección de inscripciones del usuario */}
        <section className="reservations-section">
            <h2 className="reservations-title">Tus Inscripciones a Torneos</h2>
            
            {loading && <p className="loading-message">Cargando tus inscripciones...</p>}
            
            {error && !loading && (
                <p className="error-message">{error}</p>
            )}
            
            {!loading && !error && inscripciones.length === 0 && (
                <p className="no-reservations">No tienes inscripciones a torneos activas.</p>
            )}
            
            {!loading && !error && inscripciones.length > 0 && (
                <div className="reservations-list">
                    {inscripciones.map((inscripcion) => (
                        <div key={inscripcion.id || Math.random()} className="reservation-card">
                            <div className="reservation-details">
                                <p><strong>Nombre:</strong><br />{inscripcion.nombre}</p>
                                <p><strong>Fecha:</strong> <br /> {formatDate(inscripcion.fecha)}</p>
                                <p><strong>Hora:</strong> <br /> {inscripcion.hora}</p>
                                <p><strong>Invitado:</strong> <br /> {inscripcion.invitado}</p>
                                <p><strong>Teléfono:</strong> <br />{inscripcion.telefono}</p>
                                <p><strong>Email:</strong> <br />{inscripcion.email}</p>
                                <p><strong>Estado de pago:</strong> <br /> {renderPaymentStatus(inscripcion.paymentStatus)}</p>
                            </div>
                            <div className="reservation-actions">
                                <button
                                    className="edit-btn"
                                    onClick={() => handleEdit(inscripcion)}
                                    disabled={loading}
                                >
                                    Editar
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(inscripcion.id)}
                                    disabled={loading}
                                >
                                    Eliminar
                                </button>
                                {/* Botón de pago - solo mostrar si no está pagado */}
                                {(inscripcion.paymentStatus === 'unpaid' || !inscripcion.paymentStatus) && (
                                    <button
                                        className="pay-btn"
                                        onClick={() => handleShowPaymentModal(inscripcion)}
                                        disabled={loading}
                                    >
                                        Pagar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    </div>

    {/* Modal de Pago */}
    {selectedTorneo && (
        <PaymentModal
            show={showPaymentModal}
            onHide={handleClosePaymentModal}
            item={selectedTorneo}
            itemType="torneo"
            onPaymentComplete={handlePaymentComplete}
        />
    )}

    <ContentWT/>
    <Location />
    <Footer />
    </>
);
};

export default Torneo;

