import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../src/components/adminComponents.jsx/adminSidebar';
import AdminHeader from '../../src/components/adminComponents.jsx/adminHeader';


const AdminClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3456/admin/clases', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar clases');
            }

            const data = await response.json();
            setClasses(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleDelete = async (classId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta clase?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3456/admin/clases/${classId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar clase');
            }

            // Actualizar la lista de clases
            setClasses(classes.filter(cls => cls.id !== classId));
            alert('Clase eliminada con éxito');
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
                <AdminHeader title="Gestión de Clases" />
                
                <div className="admin-card">
                    <h2>Todas las Inscripciones a Clases</h2>
                    
                    {loading ? (
                        <p>Cargando clases...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Nombre</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Teléfono</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map(cls => (
                                    <tr key={cls.id}>
                                        <td>{cls.id}</td>
                                        <td>{cls.userID}</td>
                                        <td>{cls.Nombre}</td>
                                        <td>{formatDate(cls.Fecha)}</td>
                                        <td>{cls.Hora}</td>
                                        <td>{cls.Telefono}</td>
                                        <td>
                                            <button 
                                                className="delete-btn" 
                                                onClick={() => handleDelete(cls.id)}
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

export default AdminClasses;
