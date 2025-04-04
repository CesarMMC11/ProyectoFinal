import React, { useState, useEffect } from 'react';
import Header from '../src/components/header';
import Navbar from '../src/components/Navbar';
import ContentWC from '../src/components/contentWC';
import Location from '../src/components/location';
import Footer from '../src/components/footer';
import SectionImg from '../src/components/sectionImg';
import PaymentModal from '../src/components/payment/paymentModal';

const Clases = () => {
    // Estado para el formulario
    const [formData, setFormData] = useState({
        Nombre: '',
        Hora: '',
        Telefono: '',
        Fecha: ''
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
    const [selectedClase, setSelectedClase] = useState(null);
   
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
           
            console.log('Obteniendo inscripciones a clases...');
           
            const response = await fetch('http://localhost:3456/clases/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
           
            console.log('Respuesta del servidor:', response.status, response.statusText);
           
            if (response.ok) {
                const data = await response.json();
                console.log('Datos recibidos:', JSON.stringify(data));
               
                // Si data es un array, úsalo directamente
                if (Array.isArray(data)) {
                    console.log('Datos son un array, longitud:', data.length);
                    setInscripciones(data);
                } else if (data.inscripciones && Array.isArray(data.inscripciones)) {
                    console.log('Datos contienen array en propiedad inscripciones:', data.inscripciones.length);
                    setInscripciones(data.inscripciones);
                } else {
                    console.error('Formato de respuesta inesperado:', data);
                    setInscripciones([]);
                }
            } else {
                // Si hay un error, intenta obtener el mensaje de error
                try {
                    const errorData = await response.json();
                    console.error('Error al obtener inscripciones:', errorData);
                    setError(`Error: ${errorData.message || 'Error desconocido'}`);
                } catch (e) {
                    // Si no es JSON, muestra el texto
                    const errorText = await response.text();
                    console.error('Respuesta no es JSON:', errorText);
                    setError(`Error: ${errorText || 'Error desconocido'}`);
                }
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setError(`Error de conexión: ${error.message}`);
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
                ? `http://localhost:3456/clases/${editId}`
                : 'http://localhost:3456/clases/create';
            const method = editMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
           
            // Verificar el tipo de contenido antes de intentar analizar como JSON
            const contentType = response.headers.get("content-type");
           
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
               
                if (response.ok) {
                    const mensaje = editMode
                        ? 'Inscripción actualizada exitosamente'
                        : 'Inscripción creada exitosamente, bienvenido a la clase';
                    alert(mensaje);
                   
                    // Limpiar formulario y resetear modo de edición
                    setFormData({
                        Nombre: '',
                        Hora: '',
                        Telefono: '',
                        Fecha: ''
                    });
                    setEditMode(false);
                    setEditId(null);
                   
                    // Actualizar la lista de inscripciones
                    fetchInscripciones();
                } else {
                    alert(`Error: ${data.message || 'Error desconocido'}`);
                }
            } else {
                // Si no es JSON, mostrar el texto de la respuesta
                const errorText = await response.text();
                alert(`Error en la solicitud: ${errorText}`);
                console.error('Respuesta no es JSON:', errorText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Error al conectar con el servidor: ' + error.message);
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
           
            const response = await fetch(`http://localhost:3456/clases/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
           
            if (response.ok) {
                alert('Inscripción eliminada exitosamente');
                // Actualizar la lista de inscripciones
                setInscripciones(prevInscripciones =>
                    prevInscripciones.filter(inscripcion =>
                        (inscripcion.id || inscripcion._id) !== id
                    )
                );
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
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
            Nombre: inscripcion.Nombre || '',
            Hora: inscripcion.Hora || '',
            Telefono: inscripcion.Telefono || '',
            Fecha: inscripcion.Fecha ? inscripcion.Fecha.split('T')[0] : '',
        });
        setEditMode(true);
        setEditId(inscripcion.id || inscripcion._id);
       
        // Desplazar hacia el formulario
        window.scrollTo({
            top: document.querySelector('.booking-form').offsetTop,
            behavior: 'smooth'
        });
    };
   
    // Función para cancelar la edición
    const handleCancelEdit = () => {
        setFormData({
            Nombre: '',
            Hora: '',
            Telefono: '',
            Fecha: ''
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
    const handleShowPaymentModal = (clase) => {
        setSelectedClase(clase);
        setShowPaymentModal(true);
    };
    
    // Cerrar el modal de pago
    const handleClosePaymentModal = () => {
        setShowPaymentModal(false);
        setSelectedClase(null);
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
        <Header/>
        <Navbar/>
        <SectionImg section="clases" />

        <div className="container">
            <section className="booking-section">
                <h1 className="booking-title">¡Aquí puedes inscribirte en nuestras Clases!</h1>
                <div className="booking-card">
                    <div className="booking-tabs">
                        <div className="tab active">Clases</div>
                    </div>
                    <form className="booking-form" onSubmit={handleSubmit}>
                        <h2 className="form-title">
                            {editMode ? 'Actualizar inscripción a clase' : 'Reserva tu puesto'}
                        </h2>
                        <div className="form-grid">
                            {/* Nombre */}
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    name="Nombre"
                                    value={formData.Nombre}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Tu nombre"
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
                                        name="Hora"
                                        value={formData.Hora}
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
                                    name="Telefono"
                                    value={formData.Telefono}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Tu número de teléfono"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            {/* Fecha */}
                            <div className="form-group">
                                <label>Fecha</label>
                                <input
                                    type="date"
                                    name="Fecha"
                                    value={formData.Fecha}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Selecciona la fecha"
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
                                {loading ? 'Procesando...' : (editMode ? 'Actualizar Inscripción' : 'Inscribirse')}
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
                <h2 className="reservations-title">Mis Clases</h2>
               
                {loading ? (
                    <p className="loading-message">Cargando tus clases...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : inscripciones && inscripciones.length > 0 ? (
                    <div className="reservations-list">
                        {inscripciones.map((inscripcion) => (
                            <div key={inscripcion.id || inscripcion._id || Math.random()} className="reservation-card">
                                <div className="reservation-details">
                                    <h3>{inscripcion.Nombre || 'Sin nombre'}</h3>
                                    <p><strong>Fecha:</strong> {formatDate(inscripcion.Fecha)}</p>
                                    <p><strong>Hora:</strong> {inscripcion.Hora || 'No especificada'}</p>
                                    <p><strong>Teléfono:</strong> {inscripcion.Telefono || 'No especificado'}</p>
                                    <p><strong>Estado de pago:</strong> {renderPaymentStatus(inscripcion.paymentStatus)}</p>
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
                                        onClick={() => handleDelete(inscripcion.id || inscripcion._id)}
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
                ) : (
                    <p className="no-reservations">No tienes inscripciones a clases activas.</p>
                )}
            </section>
        </div>

        {/* Modal de Pago */}
        {selectedClase && (
            <PaymentModal
                show={showPaymentModal}
                onHide={handleClosePaymentModal}
                item={selectedClase}
                itemType="clase"
                onPaymentComplete={handlePaymentComplete}
            />
        )}

        <ContentWC/>
        <Location/>
        <Footer/>
        </>
    );
};

export default Clases;
