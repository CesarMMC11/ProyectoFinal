import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la navegación
import FriendSearch from '../src/components/friendsComponents/friendSearch';
import PendingRequests from '../src/components/friendsComponents/pendingRequest';
import FriendsList from '../src/components/friendsComponents/friendList';

const Amigos = () => {
    

    const [activeTab, setActiveTab] = useState('list');
    const navigate = useNavigate(); // Hook para navegación
    const [pendingRequests, setPendingRequests] = useState([]);


    // Función para obtener las solicitudes pendientes
    const fetchPendingRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            
            const response = await fetch( `${import.meta.env.VITE_API_URL}/amigos/pending`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener solicitudes pendientes');
            }

            const data = await response.json();
            setPendingRequests(data);
        } catch (error) {
            console.error('Error al obtener solicitudes pendientes:', error);
        }
    };
    
    // Cargar las solicitudes pendientes cuando el componente se monta
    useEffect(() => {
        fetchPendingRequests();
    }, []);

    // Función para volver al perfil
    const handleBackToProfile = () => {
        navigate('/perfil');
    };

    return (
        <div className="friends-page">
            <div className="friends-header">
                <h1>Amigos</h1>
                {/* Botón para regresar al perfil */}
                <button
                    className="back-btn"
                    onClick={handleBackToProfile}
                >
                    Volver al perfil
                </button>
            </div>

            <div className="friends-tabs">
                <button
                    className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    Mis Amigos
                </button>
                <button
                    className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Solicitudes Pendientes
                    {pendingRequests.length > 0 && (
                        <span className="notification-badge">
                            {pendingRequests.length}
                        </span>
                    )}
                    <i className="fas fa-bell notification-icon"></i>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
                    onClick={() => setActiveTab('search')}
                >
                    Buscar Amigos
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'list' && <FriendsList />}
                {activeTab === 'pending' && <PendingRequests onRequestsUpdate={fetchPendingRequests} />}
                {activeTab === 'search' && <FriendSearch />}
            </div>
        </div>
    );
};

export default Amigos;
