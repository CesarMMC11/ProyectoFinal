import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../src/components/adminComponents.jsx/adminSidebar';
import AdminHeader from '../../src/components/adminComponents.jsx/adminHeader';
import ImageManager from '../../src/components/adminComponents.jsx/imageMaganer';


const AdminTournaments = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3456/admin/torneos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar torneos');
            }

            const data = await response.json();
            setTournaments(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleDelete = async (tournamentId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este torneo?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3456/admin/torneos/${tournamentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar torneo');
            }

            // Actualizar la lista de torneos
            setTournaments(tournaments.filter(tournament => tournament.id !== tournamentId));
            alert('Torneo eliminado con éxito');
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
                <AdminHeader title="Gestión de Torneos" />

                <ImageManager section="torneo" />

                
                <div className="admin-card">
                    <h2>Todas las Inscripciones a Torneos</h2>
                    
                    {loading ? (
                        <p>Cargando torneos...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <table className="payments-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Nombre</th>
                                    <th>Invitados</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Teléfono</th>
                                    <th>Email</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tournaments.map(tournament => (
                                    <tr key={tournament.id}>
                                        <td>{tournament.id}</td>
                                        <td>{tournament.userID}</td>
                                        <td>{tournament.nombre}</td>
                                        <td>{tournament.invitado}</td>
                                        <td>{formatDate(tournament.fecha)}</td>
                                        <td>{tournament.hora}</td>
                                        <td>{tournament.telefono}</td>
                                        <td>{tournament.email}</td>
                                        <td>
                                            <button 
                                                className="delete-btn" 
                                                onClick={() => handleDelete(tournament.id)}
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

export default AdminTournaments;
