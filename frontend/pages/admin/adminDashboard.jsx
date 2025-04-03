import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../src/components/adminComponents.jsx/adminSidebar';
import AdminHeader from '../../src/components/adminComponents.jsx/adminHeader';
import StatsCard from '../../src/components/adminComponents.jsx/adminStatcards';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalReservations: 0,
        totalClasses: 0,
        totalTournaments: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                
                if (!token) {
                    throw new Error('No se encontró token de autenticación');
                }
                
                const response = await fetch('http://localhost:3456/admin/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Error al obtener estadísticas: ${response.status}`);
                }
                
                const data = await response.json();
                setStats(data);
                setError(null);
            } catch (error) {
                console.error('Error al cargar estadísticas:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-content">
                <AdminHeader title="Panel de Control" />
               
                {loading ? (
                    <div className="loading-container">
                        <p>Cargando estadísticas...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p>Error: {error}</p>
                        <button 
                            className="retry-button"
                            onClick={() => window.location.reload()}
                        >
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <div className="stats-grid">
                        <StatsCard
                            title="Usuarios Registrados"
                            value={stats.totalUsers}
                            icon="👤"
                        />
                        <StatsCard
                            title="Reservaciones"
                            value={stats.totalReservations}
                            icon="📅"
                        />
                        <StatsCard
                            title="Inscripcion a Clases"
                            value={stats.totalClasses}
                            icon="🏋️"
                        />
                        <StatsCard
                            title="Inscripcion a Torneos"
                            value={stats.totalTournaments}
                            icon="🏆"
                        />
                    </div>
                )}
               
                <div className="admin-card">
                    <h2>Acciones Rápidas</h2>
                    <div className="action-buttons">
                        <button onClick={() => window.location.href = '/admin/users'}>
                            Gestionar Usuarios
                        </button>
                        <button onClick={() => window.location.href = '/admin/reservations'}>
                            Ver Reservaciones
                        </button>
                        <button onClick={() => window.location.href = '/admin/classes'}>
                            Administrar Clases
                        </button>
                        <button onClick={() => window.location.href = '/admin/tournaments'}>
                            Administrar Torneos
                        </button>
                    </div>
                </div>
               
                <div className="admin-card">
                    <h2>Actividad Reciente</h2>
                    <p>Aquí se mostrará la actividad reciente del sistema.</p>
                    {/* Aquí podrías mostrar un registro de actividades recientes */}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
