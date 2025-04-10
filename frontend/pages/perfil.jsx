import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../src/components/header';
import Footer from '../src/components/footer';

const Perfil = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
   
    // Estados para las imágenes
    const [profileImage, setProfileImage] = useState("");
    const [coverImage, setCoverImage] = useState("");
   
    // Estado para los amigos
    const [friends, setFriends] = useState([]);
    const [loadingFriends, setLoadingFriends] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
       
        fetchUserData();
        fetchFriends(); // Cargar los amigos al montar el componente
    }, [navigate]);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar datos del perfil');
            }

            const data = await response.json();
            setUserData(data);
            setFormData({
                nombre: data.nombre || '',
                descripcion: data.descripcion || ''
            });
           
            // Establecer las imágenes si existen
            if (data.fotoPerfil) {
                setProfileImage(`${import.meta.env.VITE_API_URL}${data.fotoPerfil}`);
            }
            if (data.fotoPortada) {
                setCoverImage(`${import.meta.env.VITE_API_URL}${data.fotoPortada}`);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', error.message);
            setLoading(false);
        }
    };

    // Función para obtener la lista de amigos
    const fetchFriends = async () => {
        try {
            setLoadingFriends(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/amigos`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar amigos');
            }

            const data = await response.json();
            setFriends(data);
        } catch (error) {
            console.error('Error al cargar amigos:', error);
            showNotification('error', 'No se pudieron cargar los amigos');
        } finally {
            setLoadingFriends(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
        // Resetear el formulario con los datos actuales si se cancela la edición
        if (editMode) {
            setFormData({
                nombre: userData.nombre || '',
                descripcion: userData.descripcion || ''
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar perfil');
            }

            const data = await response.json();
            setUserData({
                ...userData,
                nombre: data.user.name,
                descripcion: data.user.description
            });
           
            setEditMode(false);
            showNotification('success', 'Perfil actualizado con éxito');
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', error.message);
        }
    };

    // Maneja la subida de la foto de perfil
    const handleProfileImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Crear una vista previa local
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);

            // Preparar el formulario para enviar la imagen
            const formData = new FormData();
            formData.append('fotoPerfil', file);

            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile/upload-profile-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al subir la imagen de perfil');
            }

            const data = await response.json();
            // Actualizar la imagen con la URL del servidor
            setProfileImage(`${import.meta.env.VITE_API_URL}${data.profileImg}`);
            showNotification('success', 'Imagen de perfil actualizada con éxito');
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', error.message);
        }
    };

    // Maneja la subida de la foto de portada
    const handleCoverImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Crear una vista previa local
            const imageUrl = URL.createObjectURL(file);
            setCoverImage(imageUrl);

            // Preparar el formulario para enviar la imagen
            const formData = new FormData();
            formData.append('fotoPortada', file);

            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile/upload-cover-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al subir la imagen de portada');
            }

            const data = await response.json();
            // Actualizar la imagen con la URL del servidor
            setCoverImage(`${import.meta.env.VITE_API_URL}${data.coverImg}`);
            showNotification('success', 'Imagen de portada actualizada con éxito');
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', error.message);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, 3000);
    };

    // Renderizar la sección de amigos - MODIFICADO
    const renderFriendsSection = () => {
        if (loadingFriends) {
            return (
                <div className="friends-content">
                    <p className="loading-friends">Cargando amigos...</p>
                    <div className="friends-actions">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/amigos')}
                        >
                            Buscar amigos
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="friends-content">
                <div className="friends-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/amigos')}
                    >
                        Buscar amigos
                    </button>
                </div>
                
                {friends.length === 0 ? (
                    <div className="no-friends">
                        <p>No tienes amigos agregados aún</p>
                    </div>
                ) : (
                    <div className="friends-list">
                        {/* Mostrar máximo 5 amigos en el perfil */}
                        {friends.slice(0, 5).map(friend => (
                            <div className="friend" key={friend.id}>
                                <div className="friend-image">
                                    {friend.profileImg ? (
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}${friend.profileImg}`}
                                            alt={`${friend.name}`}
                                        />
                                    ) : (
                                        <div className="default-friend-image">
                                            {friend.name ? friend.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    )}
                                </div>
                                <h3 className="friend-name">{friend.name} {friend.lastname}</h3>
                                <p className="friend-info">{friend.email}</p>
                            </div>
                        ))}
                        
                        {friends.length > 5 && (
                            <div className="view-all-friends">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/amigos')}
                                >
                                    Ver todos los amigos ({friends.length})
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="loading-container">
                    <p>Cargando perfil...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            {/* Hero Section (Foto de portada) */}
            <section className="hero1">
                <div className='background-profile'>
                    {coverImage ? (
                        <img src={coverImage} alt="Portada" className="cover-image" />
                    ) : (
                        <div className="default-cover">Sube una foto de portada</div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="upload-cover"
                        style={{ display: 'none' }}
                        id="cover-upload"
                    />
                    <label htmlFor="cover-upload" className="upload-label cover-upload-label">
                        Cambiar portada
                    </label>
                </div>
                <div className="hero-content1">
                    <h2 className="hero-title1">PRO</h2>
                    <h1 className="hero-subtitle1">PADEL</h1>
                    <p className="hero-description1">PLAYER</p>
                </div>
            </section>

            {/* Profile Section */}
            <section className="profile-section">
                <div className='profile-container'>
                    <div className="profile-image">
                        {profileImage ? (
                            <img src={profileImage} alt="perfil" />
                        ) : (
                            <div className="default-profile">
                                {userData.nombre ? userData.nombre.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="upload-profile"
                            style={{ display: 'none' }}
                            id="profile-upload"
                        />
                        <label htmlFor="profile-upload" className="change-profile-photo-btn">
                            <i className="fas fa-camera"></i> Cambiar foto
                        </label>
                    </div>

                    <div className="profile-info">
                        {!editMode ? (
                            <>
                                <h1>{userData.nombre} {userData.apellido}</h1>
                                <p>{userData.descripcion || 'Sin descripción'}</p>
                                <button className="btn btn-edit" onClick={handleEditToggle}>
                                    Editar Perfil
                                </button>
                            </>
                        ) : (
                            <form className="profile-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="nombre">Nombre</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="descripcion">Descripción</label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>
                                <div className="form-buttons">
                                    <button type="submit" className="btn btn-save">Guardar</button>
                                    <button type="button" className="btn btn-cancel" onClick={handleEditToggle}>Cancelar</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                <div className="friends-section">
                    <h2>Amigos</h2>
                    {renderFriendsSection()}
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Perfil;
