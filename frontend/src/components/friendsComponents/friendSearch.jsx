import React, { useState } from 'react';

const FriendSearch = () => {
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleSearch = async () => {
if (searchQuery.length < 3) {
    setError('La búsqueda debe tener al menos 3 caracteres');
    return;
}

setLoading(true);
setError('');

try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/amigos/search?query=${searchQuery}`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    });

    const data = await response.json();

    if (response.ok) {
    setSearchResults(data);
    } else {
    setError(data.message || 'Error al buscar usuarios');
    }
} catch (error) {
    console.error('Error en la búsqueda:', error);
    setError('Error al conectar con el servidor');
} finally {
    setLoading(false);
}
};

const handleSendRequest = async (userId) => {
try {
    const token = localStorage.getItem('token');
    const response = await fetch( `${import.meta.env.VITE_API_URL}/amigos/request`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ addresseeId: userId })
    });

    const data = await response.json();

    if (response.ok) {
    // Actualizar el estado del usuario en los resultados
    setSearchResults(prevResults => 
        prevResults.map(user => 
        user.id === userId 
            ? { ...user, friendshipStatus: 'pending', sentByMe: true } 
            : user
        )
    );
    } else {
    setError(data.message || 'Error al enviar solicitud');
    }
} catch (error) {
    console.error('Error al enviar solicitud:', error);
    setError('Error al conectar con el servidor');
}
};

const handleAcceptRequest = async (requestId) => {
try {
    const token = localStorage.getItem('token');
const response = await fetch(`${import.meta.env.VITE_API_URL}/amigos/accept/${requestId}`, {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
}
    });

    const data = await response.json();

    if (response.ok) {
    // Actualizar el estado del usuario en los resultados
    setSearchResults(prevResults => 
        prevResults.map(user => 
        user.friendshipId === requestId 
            ? { ...user, friendshipStatus: 'accepted' } 
            : user
        )
    );
    } else {
    setError(data.message || 'Error al aceptar solicitud');
    }
} catch (error) {
    console.error('Error al aceptar solicitud:', error);
    setError('Error al conectar con el servidor');
}
};

const renderActionButton = (user) => {
if (!user.friendshipStatus) {
    return (
    <button 
        className="friend-request-btn"
        onClick={() => handleSendRequest(user.id)}
    >
        Enviar solicitud
    </button>
    );
} else if (user.friendshipStatus === 'pending') {
    if (user.sentByMe) {
    return <span className="pending-status">Solicitud enviada</span>;
    } else {
    return (
        <button 
        className="accept-request-btn"
        onClick={() => handleAcceptRequest(user.friendshipId)}
        >
        Aceptar solicitud
        </button>
    );
    }
} else if (user.friendshipStatus === 'accepted') {
    return <span className="friend-status">Ya son amigos</span>;
} else if (user.friendshipStatus === 'rejected') {
    return (
    <button 
        className="friend-request-btn"
        onClick={() => handleSendRequest(user.id)}
    >
        Enviar solicitud de nuevo
    </button>
    );
}
};

return (
<div className="friend-search-container">
    <h2>Buscar Amigos</h2>
    
    <div className="search-box">
    <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar por nombre o email"
        className="search-input"
    />
    <button 
        onClick={handleSearch}
        disabled={loading}
        className="search-btn"
    >
        {loading ? 'Buscando...' : 'Buscar'}
    </button>
    </div>
    
    {error && <p className="error-message">{error}</p>}
    
    <div className="search-results">
    {searchResults.length > 0 ? (
        searchResults.map(user => (
        <div key={user.id} className="user-card">
            <div className="user-info">
            <h3>{user.name} {user.lastname}</h3>
            <p>{user.email}</p>
            </div>
            <div className="user-actions">
            {renderActionButton(user)}
            </div>
        </div>
        ))
    ) : (
        <p className="no-results">
        {loading ? 'Buscando usuarios...' : 'No se encontraron resultados'}
        </p>
    )}
    </div>
</div>
);
};

export default FriendSearch;
