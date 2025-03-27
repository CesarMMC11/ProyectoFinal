import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../src/components/adminComponents.jsx/adminSidebar';
import AdminHeader from '../../src/components/adminComponents.jsx/adminHeader';

const AdminReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3456/admin/reservas', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar reservaciones');
            }

            const data = await response.json();
            setReservations(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleDelete = async (reservationId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta reservación?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3456/admin/reservas/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar reservación');
            }

            // Actualizar la lista de reservaciones
            setReservations(reservations.filter(res => res.id !== reservationId));
            alert('Reservación eliminada con éxito');
        } catch (error) {
            alert(error.message);
        }
    };

    // Formatear fecha para mostrar
    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-content">
                <AdminHeader title="Gestión de Reservaciones" />
                
                <div className="admin-card">
                    <h2>Todas las Reservaciones</h2>
                    
                    {loading ? (
                        <p>Cargando reservaciones...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Teléfono</th>
                                    <th>Email</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map(reservation => (
                                    <tr key={reservation.id}>
                                        <td>{reservation.id}</td>
                                        <td>{reservation.nombre} {reservation.apellido}</td>
                                        <td>{formatDate(reservation.fecha)}</td>
                                        <td>{reservation.hora}</td>
                                        <td>{reservation.telefono}</td>
                                        <td>{reservation.email}</td>
                                        <td>
                                            <button 
                                                className="delete-btn" 
                                                onClick={() => handleDelete(reservation.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminReservations;
