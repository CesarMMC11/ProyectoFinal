import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../src/components/adminComponents.jsx/adminSidebar';
import AdminHeader from '../../src/components/adminComponents.jsx/adminHeader';


const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed', 'rejected'

    // Función para obtener todos los pagos
    const fetchPayments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:3456/payments', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los pagos');
            }

            const data = await response.json();
            setPayments(data);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Cargar pagos al montar el componente
    useEffect(() => {
        fetchPayments();
    }, []);

    // Función para actualizar el estado de un pago
    const updatePaymentStatus = async (paymentId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:3456/payments/${paymentId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estado del pago');
            }

            // Actualizar la lista de pagos
            fetchPayments();
            
            // Mostrar notificación
            setNotification({
                show: true,
                type: 'success',
                message: `Pago ${newStatus === 'completed' ? 'aprobado' : 'rechazado'} correctamente`
            });
            
            // Ocultar notificación después de 3 segundos
            setTimeout(() => {
                setNotification({ show: false, type: '', message: '' });
            }, 3000);
        } catch (error) {
            console.error('Error:', error);
            setNotification({
                show: true,
                type: 'error',
                message: error.message
            });
            
            setTimeout(() => {
                setNotification({ show: false, type: '', message: '' });
            }, 3000);
        }
    };

    // Filtrar pagos según el estado seleccionado
    const filteredPayments = filter === 'all' 
        ? payments 
        : payments.filter(payment => payment.status === filter);

    // Función para mostrar el tipo de ítem en español
    const getItemTypeText = (type) => {
        switch (type) {
            case 'reserva': return 'Reserva';
            case 'torneo': return 'Torneo';
            case 'clase': return 'Clase';
            default: return type;
        }
    };

    // Función para mostrar el método de pago en español
    const getPaymentMethodText = (method) => {
        switch (method) {
            case 'paypal': return 'PayPal';
            case 'mobile': return 'Pago Móvil';
            default: return method;
        }
    };

    // Función para mostrar el estado del pago en español
    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'completed': return 'Completado';
            case 'rejected': return 'Rechazado';
            default: return status;
        }
    };

    // Función para obtener la clase CSS según el estado
    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'completed': return 'status-completed';
            case 'rejected': return 'status-rejected';
            default: return '';
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-content">
                    <AdminHeader title="Gestión de Pagos" />
                
                {notification.show && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                )}
                
                <div className="filter-controls">
                    <label>Filtrar por estado:</label>
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Todos</option>
                        <option value="pending">Pendientes</option>
                        <option value="completed">Completados</option>
                        <option value="rejected">Rechazados</option>
                    </select>
                </div>
                
                {loading ? (
                    <div className="loading-spinner">Cargando pagos...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : filteredPayments.length === 0 ? (
                    <div className="no-data-message">No hay pagos {filter !== 'all' ? `con estado "${getStatusText(filter)}"` : ''}</div>
                ) : (
                    <div className="payments-table-container">
                        <table className="payments-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Tipo</th>
                                    <th>Método</th>
                                    <th>Monto</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                    <th>Comprobante</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map(payment => (
                                    <tr key={payment.id}>
                                        <td>{payment.id}</td>
                                        <td>{payment.User ? `${payment.User.name} (${payment.User.email})` : 'Usuario desconocido'}</td>
                                        <td>{getItemTypeText(payment.itemType)} #{payment.itemId}</td>
                                        <td>{getPaymentMethodText(payment.method)}</td>
                                        <td>${payment.amount}</td>
                                        <td className={getStatusClass(payment.status)}>
                                            {getStatusText(payment.status)}
                                        </td>
                                        <td>{new Date(payment.createdAt).toLocaleString()}</td>
                                        <td>
                                            {payment.proofImage && (
                                                <button 
                                                    className="view-proof-btn"
                                                    onClick={() => window.open(`http://localhost:3456${payment.proofImage}`, '_blank')}
                                                >
                                                    Ver comprobante
                                                </button>
                                            )}
                                        </td>
                                        <td>
                                            {payment.status === 'pending' && (
                                                <div className="action-buttons-payments">
                                                    <button 
                                                        className="approve-btn"
                                                        onClick={() => updatePaymentStatus(payment.id, 'completed')}
                                                    >
                                                        Aprobar
                                                    </button>
                                                    <button 
                                                        className="reject-btn"
                                                        onClick={() => updatePaymentStatus(payment.id, 'rejected')}
                                                    >
                                                        Rechazar
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentManagement;
