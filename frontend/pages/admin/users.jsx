import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../src/components/adminComponents.jsx/adminSidebar';
import AdminHeader from '../../src/components/adminComponents.jsx/adminHeader';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estado para el formulario de edición
    const [editMode, setEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3456/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar usuarios');
            }

            const data = await response.json();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setEditMode(true);
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3456/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }

            // Actualizar la lista de usuarios
            setUsers(users.filter(user => user.id !== userId));
            alert('Usuario eliminado con éxito');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Lógica para actualizar usuario
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-content">
                <AdminHeader title="Gestión de Usuarios" />
                        <h2>Lista de Usuarios</h2>

                <div className="payments-table">
                    
                    {loading ? (
                        <p>Cargando usuarios...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.lastname}</td>
                                        <td>{user.email}</td>
                                        <td>{user.rol}</td>
                                        <td>
                                            <button 
                                                className="edit-btn" 
                                                onClick={() => handleEdit(user)}
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                className="delete-btn" 
                                                onClick={() => handleDelete(user.id)}
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
                
                {editMode && (
                    <div className="admin-card">
                        <h2>Editar Usuario</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Formulario de edición */}
                            <div className="form-group">
                                <label>Nombre</label>
                                <input 
                                    type="text" 
                                    value={currentUser.name}
                                    onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                                />
                            </div>
                            {/* Más campos del formulario */}
                            <div className="form-actions">
                                <button type="submit" className="save-btn">Guardar</button>
                                <button 
                                    type="button" 
                                    className="cancel-btn"
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
