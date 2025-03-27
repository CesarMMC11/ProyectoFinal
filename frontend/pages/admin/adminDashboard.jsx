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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                
                // Aquí deberías tener un endpoint para obtener estadísticas
                // Por ahora, usaremos datos de ejemplo
                // En un caso real, harías una petición al backend
                
                // Ejemplo:
                // const response = await fetch('http://localhost:3456/api/admin/stats', {
                //     headers: {
                //         'Authorization': `Bearer ${token}`
                //     }
                // });
                // const data = await response.json();
                // setStats(data);
                
                // Datos de ejemplo:
                setStats({
                    totalUsers: 25,
                    totalReservations: 150,
                    totalClasses: 45,
                    totalTournaments: 12
                });
                
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
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
                    <p>Cargando estadísticas...</p>
                ) : (
                    <div className="stats-grid">
                        <StatsCard 
                            title="Usuarios" 
                            value={stats.totalUsers} 
                            icon="👤" 
                        />
                        <StatsCard 
                            title="Reservaciones" 
                            value={stats.totalReservations} 
                            icon="📅" 
                        />
                        <StatsCard 
                            title="Clases" 
                            value={stats.totalClasses} 
                            icon="🏋️" 
                        />
                        <StatsCard 
                            title="Torneos" 
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
