import React, { useState, useEffect } from 'react';

const PendingRequests = () => {
const [pendingRequests, setPendingRequests] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
fetchPendingRequests();
}, []);

const fetchPendingRequests = async () => {
try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3456/amigos/pending', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    });

    const data = await response.json();

    if (response.ok) {
    setPendingRequests(data);
    } else {
    setError(data.message || 'Error al obtener solicitudes pendientes');
    }
} catch (error) {
    console.error('Error al obtener solicitudes:', error);
    setError('Error al conectar con el servidor');
} finally {
    setLoading(false);
}
};

const handleAcceptRequest = async (requestId) => {
try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3456/amigos/accept/${requestId}`, {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    });

    const data = await response.json();

    if (response.ok) {
    // Eliminar la solicitud aceptada de la lista
    setPendingRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
    );
    } else {
    setError(data.message || 'Error al aceptar solicitud');
    }
} catch (error) {
    console.error('Error al aceptar solicitud:', error);
    setError('Error al conectar con el servidor');
}
};

const handleRejectRequest = async (requestId) => {
try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3456/amigos/reject/${requestId}`, {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    });

    const data = await response.json();

    if (response.ok) {
    // Eliminar la solicitud rechazada de la lista
    setPendingRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
    );
    } else {
    setError(data.message || 'Error al rechazar solicitud');
    }
} catch (error) {
    console.error('Error al rechazar solicitud:', error);
    setError('Error al conectar con el servidor');
}
};

if (loading) {
return <div className="loading">Cargando solicitudes...</div>;
}

return (
<div className="pending-requests-container">
    <h2>Solicitudes de Amistad Pendientes</h2>
    
    {error && <p className="error-message">{error}</p>}
    
    {pendingRequests.length > 0 ? (
    <div className="requests-list">
        {pendingRequests.map(request => (
        <div key={request.id} className="request-card">
            <div className="requester-info">
            <h3>{request.requester.name} {request.requester.lastname}</h3>
            <p>{request.requester.email}</p>
            <p className="request-date">
                Solicitud enviada el {new Date(request.createdAt).toLocaleDateString()}
            </p>
            </div>
            <div className="request-actions">
            <button 
                className="accept-btn"
                onClick={() => handleAcceptRequest(request.id)}
            >
                Aceptar
            </button>
            <button 
                className="reject-btn"
                onClick={() => handleRejectRequest(request.id)}
            >
                Rechazar
            </button>
            </div>
        </div>
        ))}
    </div>
    ) : (
    <p className="no-requests">No tienes solicitudes de amistad pendientes</p>
    )}
</div>
);
};

export default PendingRequests;
