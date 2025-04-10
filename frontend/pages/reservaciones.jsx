import React, { useState, useEffect } from 'react';
import Header from '../src/components/header';
import Navbar from '../src/components/Navbar';
import ContentWR from '../src/components/contentWR';
import Location from '../src/components/location';
import Footer from '../src/components/footer';
import SectionImg from '../src/components/sectionImg';
import PaymentModal from '../src/components/payment/paymentModal'; 

const Reservaciones = () => {
const [formData, setFormData] = useState({
    fecha: '',
    nombre: '',
    apellido: '',
    hora: '',
    telefono: '',
    email: '',
});

// Estado para las reservaciones del usuario
const [reservaciones, setReservaciones] = useState([]);

// Estado para el modo de edición
const [editMode, setEditMode] = useState(false);
const [editId, setEditId] = useState(null);

// Estado para manejar errores y carga
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Estado para el modal de pago
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [selectedReservation, setSelectedReservation] = useState(null);

// Cargar las reservaciones del usuario al montar el componente
useEffect(() => {
    fetchReservaciones();
}, []);

// Función para cargar las reservaciones del usuario
const fetchReservaciones = async () => {
    setLoading(true);
    setError(null);
    
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.log('Usuario no autenticado');
            setLoading(false);
            return;
        }
        
        // Intentar primero con la ruta específica para usuario autenticado
        let apiUrl = 'http://localhost:3456/reservas/user';
        console.log('Intentando obtener reservaciones desde:', apiUrl);
        
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        });
        
        // Si la primera ruta falla, intentar con la ruta general
        if (response.status === 404) {
            apiUrl = 'http://localhost:3456/reservas';
            console.log('Primera ruta falló, intentando con:', apiUrl);
            
            response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
            });
        }
        
        // Verificar el tipo de contenido de la respuesta
        const contentType = response.headers.get('content-type');
        console.log('Response content type:', contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
            // Si no es JSON, obtener el texto para diagnóstico
            const textResponse = await response.text();
            console.error('Received non-JSON response:', textResponse.substring(0, 200) + '...');
            throw new Error('La respuesta del servidor no es JSON válido');
        }
        
        const data = await response.json();
        console.log('Reservaciones obtenidas:', data);
        
        if (response.ok) {
            // Manejar diferentes formatos de respuesta
            if (Array.isArray(data)) {
                setReservaciones(data);
            } else if (data.reservaciones && Array.isArray(data.reservaciones)) {
                setReservaciones(data.reservaciones);
            } else if (data.data && Array.isArray(data.data)) {
                setReservaciones(data.data);
            } else {
                console.error('Formato de respuesta inesperado:', data);
                setReservaciones([]);
            }
        } else {
            console.error('Error al obtener reservaciones:', data);
            setError(data.message || 'Error al obtener reservaciones');
            setReservaciones([]);
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setError(error.message || 'Error al conectar con el servidor');
        setReservaciones([]);
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
    setLoading(true);
    setError(null);

    console.log('Datos del formulario:', formData);

    try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        if (!token) {
            alert('Debes iniciar sesión para realizar esta acción.');
            setLoading(false);
            return;
        }

        // URL y método según si estamos editando o creando
        const url = editMode
            ? `http://localhost:3456/reservas/update/${editId}`
            : 'http://localhost:3456/reservas/create';
        const method = editMode ? 'PUT' : 'POST';
        
        console.log(`Enviando solicitud ${method} a:`, url);

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData),
        });
        
        // Verificar el tipo de contenido de la respuesta
        const contentType = response.headers.get('content-type');
        console.log('Response content type:', contentType);
        
        let data;
        
        if (!contentType || !contentType.includes('application/json')) {
            // Si no es JSON, obtener el texto para diagnóstico
            const textResponse = await response.text();
            console.error('Received non-JSON response:', textResponse.substring(0, 200) + '...');
            throw new Error('La respuesta del servidor no es JSON válido');
        } else {
            data = await response.json();
            console.log('Respuesta del servidor:', data);
        }

        if (response.ok) {
            const mensaje = editMode
                ? 'Reserva actualizada exitosamente'
                : 'Reserva creada exitosamente';
            alert(mensaje);
            
            // Limpiar formulario y resetear modo de edición
            setFormData({
                fecha: '',
                nombre: '',
                apellido: '',
                hora: '',
                telefono: '',
                email: '',
            });
            setEditMode(false);
            setEditId(null);
            
            // Recargar las reservaciones después de crear/actualizar
            fetchReservaciones();
        } else {
            if (response.status === 403) {
                setError('No tienes permisos para realizar esta acción');
                alert('No tienes permisos para realizar esta acción');
            } else if (response.status === 404) {
                setError('La reserva no existe o ha sido eliminada');
                alert('La reserva no existe o ha sido eliminada');
            } else {
                setError(data?.message || 'Error al procesar la reserva');
                alert(data?.message || 'Error al procesar la reserva');
            }
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        setError(error.message || 'Error al conectar con el servidor');
        alert('Error al conectar con el servidor: ' + error.message);
    } finally {
        setLoading(false);
    }
};

// Función para eliminar una reservación
const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
        return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('Debes iniciar sesión para realizar esta acción.');
            setLoading(false);
            return;
        }
        
        const url = `http://localhost:3456/reservas/delete/${id}`;
        console.log('Enviando solicitud DELETE a:', url);
        
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
        });
        
        if (response.ok) {
            alert('Reserva eliminada exitosamente');
            // Actualizar el estado directamente sin hacer otra petición
            setReservaciones(prevReservaciones =>
                prevReservaciones.filter(res => res.id !== id)
            );
        } else {
            // Intentar obtener el mensaje de error
            try {
                const errorData = await response.json();
                setError(errorData.message || 'Error al eliminar la reserva');
                alert(`Error al eliminar la reserva: ${errorData.message || 'Error desconocido'}`);
            } catch (jsonError) {
                setError('Error al eliminar la reserva');
                alert('Error al eliminar la reserva');
            }
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
        setError(error.message || 'Error al conectar con el servidor');
        alert('Error al conectar con el servidor: ' + error.message);
    } finally {
        setLoading(false);
    }
};

// Función para cargar datos en el formulario para editar
const handleEdit = (reservacion) => {
    console.log('Editando reserva:', reservacion);
    console.log('ID de reserva a editar:', reservacion.id);
    
    setFormData({
        fecha: reservacion.fecha ? reservacion.fecha.split('T')[0] : '', // Formatear fecha para input date
        nombre: reservacion.nombre || '',
        apellido: reservacion.apellido || '',
        hora: reservacion.hora || '',
        telefono: reservacion.telefono || '',
        email: reservacion.email || '',
    });
    setEditMode(true);
    setEditId(reservacion.id); // Usar id según el modelo de Sequelize
    
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
        apellido: '',
        hora: '',
        telefono: '',
        email: '',
    });
    setEditMode(false);
    setEditId(null);
};

// Función para mostrar el modal de pago
const handleShowPaymentModal = (reservacion) => {
    setSelectedReservation(reservacion);
    setShowPaymentModal(true);
};

// Función para manejar el cierre del modal de pago
const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedReservation(null);
};

// Función para manejar cuando se completa un pago
const handlePaymentComplete = () => {
    // Recargar las reservaciones para mostrar el estado actualizado
    fetchReservaciones();
    setShowPaymentModal(false);
};

// Formatear fecha para mostrar
const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

// Función para mostrar el estado del pago
const renderPaymentStatus = (status) => {
    switch(status) {
        case 'paid':
            return <span className="payment-status paid">Pagado</span>;
        case 'pending':
            return <span className="payment-status pending">Pago en revisión</span>;
        case 'unpaid':
        default:
            return <span className="payment-status unpaid">Pendiente de pago</span>;
    }
};

return (
    <>
        <Header />
        <Navbar />
        <SectionImg section="reservas" />

        <div className="container">
            <section className="booking-section">
                <h1 className="booking-title">Reserva tu Pista</h1>
                <div className="booking-card">
                    <div className="booking-tabs">
                        <div className="tab active">Pista</div>
                    </div>
                    <form className="booking-form" onSubmit={handleSubmit}>
                        <h2 className="form-title">
                            {editMode ? 'Actualizar reserva de pista' : 'Reserva tu pista de pádel'}
                        </h2>
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
                                    className="form-control"
                                    placeholder="Tu nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
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
                                        className="form-control"
                                        value={formData.hora}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
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
                                    disabled={loading}
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
                                {loading ? 'Procesando...' : (editMode ? 'Actualizar Reserva' : 'Reservar Pista')}
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
                            Por favor, revisa los detalles antes de confirmar tu reserva
                        </p>
                    </form>
                </div>
            </section>
            
            {/* Sección de reservaciones del usuario */}
            <section className="reservations-section">
                <h2 className="reservations-title">Tus Reservaciones</h2>
                
                {loading && <p className="loading-message">Cargando tus reservaciones...</p>}
                
                {error && !loading && (
                    <p className="error-message">{error}</p>
                )}
                
                {!loading && !error && reservaciones.length === 0 && (
                    <p className="no-reservations">No tienes reservaciones activas.</p>
                )}
                
                {!loading && !error && reservaciones.length > 0 && (
                    <div className="reservations-list">
                        {reservaciones.map((reservacion) => (
                            <div key={reservacion.id || Math.random()} className="reservation-card">
                                <div className="reservation-details">
                                    <p><strong>Nombre:</strong><br></br>{reservacion.nombre} {reservacion.apellido}</p>
                                    <p><strong>Fecha:</strong> <br></br> {formatDate(reservacion.fecha)}</p>
                                    <p><strong>Hora:</strong> <br></br> {reservacion.hora}</p>
                                    <p><strong>Teléfono:</strong> <br></br> {reservacion.telefono}</p>
                                    <p><strong>Email:</strong> <br></br> {reservacion.email}</p>
                                    <p><strong>Estado de pago:</strong> <br></br> {renderPaymentStatus(reservacion.paymentStatus)}</p>
                                </div>
                                <div className="reservation-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(reservacion)}
                                        disabled={loading}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(reservacion.id)}
                                        disabled={loading}
                                    >
                                        Eliminar
                                    </button>
                                    {/* Botón de pago - solo mostrar si no está pagado */}
                                    {(reservacion.paymentStatus === 'unpaid') && (
                                        <button
                                            className="pay-btn"
                                            onClick={() => handleShowPaymentModal(reservacion)}
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
        {selectedReservation && (
            <PaymentModal
                show={showPaymentModal}
                onHide={handleClosePaymentModal}
                item={selectedReservation}
                itemType="reserva"
                onPaymentComplete={handlePaymentComplete}
            />
        )}

        <ContentWR />
        <Location />
        <Footer />
    </>
);
};

export default Reservaciones;

