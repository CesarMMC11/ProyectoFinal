import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la navegación
import FriendSearch from '../src/components/friendsComponents/friendSearch';
import PendingRequests from '../src/components/friendsComponents/pendingRequest';
import FriendsList from '../src/components/friendsComponents/friendList';

const Amigos = () => {
    const [activeTab, setActiveTab] = useState('list');
    const navigate = useNavigate(); // Hook para navegación

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
                {activeTab === 'pending' && <PendingRequests />}
                {activeTab === 'search' && <FriendSearch />}
            </div>
        </div>
    );
};

export default Amigos;
