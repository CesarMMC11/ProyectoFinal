import React, { useState, useEffect } from 'react';

const FriendsList = () => {
const [friends, setFriends] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
fetchFriends();
}, []);

const fetchFriends = async () => {
try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3456/amigos', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    });

    const data = await response.json();

    if (response.ok) {
    setFriends(data);
    } else {
    setError(data.message || 'Error al obtener lista de amigos');
    }
} catch (error) {
    console.error('Error al obtener amigos:', error);
    setError('Error al conectar con el servidor');
} finally {
    setLoading(false);
}
};

const handleRemoveFriend = async (friendId) => {
if (!window.confirm('¿Estás seguro de que deseas eliminar a este amigo?')) {
    return;
}

try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3456/amigos/${friendId}`, {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    });

    const data = await response.json();

    if (response.ok) {
    // Eliminar el amigo de la lista
    setFriends(prevFriends => 
        prevFriends.filter(friend => friend.id !== friendId)
    );
    } else {
    setError(data.message || 'Error al eliminar amistad');
    }
} catch (error) {
    console.error('Error al eliminar amistad:', error);
    setError('Error al conectar con el servidor');
}
};

if (loading) {
return <div className="loading">Cargando amigos...</div>;
}

return (
<div className="friends-list-container">
    <h2>Mis Amigos</h2>
    
    {error && <p className="error-message">{error}</p>}
    
    {friends.length > 0 ? (
    <div className="friends-grid">
        {friends.map(friend => (
        <div key={friend.id} className="friend-card">
            <div className="friend-info">
            <h3>{friend.name} {friend.lastname}</h3>
            <p>{friend.email}</p>
            </div>
            <div className="friend-actions">
            <button 
                className="remove-friend-btn"
                onClick={() => handleRemoveFriend(friend.id)}
            >
                Eliminar amigo
            </button>
            </div>
        </div>
        ))}
    </div>
    ) : (
    <p className="no-friends">No tienes amigos agregados aún</p>
    )}
</div>
);
};

export default FriendsList;
