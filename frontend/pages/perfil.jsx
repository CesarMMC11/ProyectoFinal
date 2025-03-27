import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../src/components/header';
import Footer from '../src/components/footer';

const API_URL = 'http://localhost:3456';

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        
        fetchUserData();
    }, [navigate]);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/user/profile`, {
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
                setProfileImage(`${API_URL}${data.fotoPerfil}`);
            }
            if (data.fotoPortada) {
                setCoverImage(`${API_URL}${data.fotoPortada}`);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', error.message);
            setLoading(false);
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
            const response = await fetch(`${API_URL}/user/profile/update`, {
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
            const response = await fetch(`${API_URL}/user/profile/upload-profile-image`, {
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
            setProfileImage(`${API_URL}${data.profileImg}`);
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
            const response = await fetch(`${API_URL}/user/profile/upload-cover-image`, {
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
            setCoverImage(`${API_URL}${data.coverImg}`);
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
                    <div className="friend">
                        <div className="friend-image">
                            <img
                                src="https://th.bing.com/th/id/OIP.Da-2nXCspeED9IX088xebwHaLH?rs=1&pid=ImgDetMain"
                                alt="Amigo 1"
                            />
                        </div>
                        <h3 className="friend-name">Gabriel</h3>
                        <p className="friend-info">24 años</p>
                    </div>
                    <div className="friend">
                        <div className="friend-image">
                            <img
                                src="https://th.bing.com/th/id/OIP.sqOuFeRJDikdLOuUQ9lpnAHaEN?rs=1&pid=ImgDetMain"
                                alt="Amigo 2"
                            />
                        </div>
                        <h3 className="friend-name">Sebastian</h3>
                        <p className="friend-info">22 años</p>
                    </div>
                    <div className="friend">
                        <div className="friend-image">
                            <img
                                src="https://img.redbull.com/images/c_crop,x_1453,y_0,h_3648,w_2189/c_fill,w_400,h_660/q_auto:low,f_auto/redbullcom/2022/2/15/gdfrqqnnslpv2bqbkco1/ale-galan-action-portrait"
                                alt="Amigo 3"
                            />
                        </div>
                        <h3 className="friend-name">Carlos</h3>
                        <p className="friend-info">27 años</p>
                    </div>
                    <div className="friend">
                        <div className="friend-image">
                            <img
                                src="https://th.bing.com/th/id/OIP.z9Fdd3EegvBNeywXJQO-9gHaLG?rs=1&pid=ImgDetMain"
                                alt="Amigo 4"
                            />
                        </div>
                        <h3 className="friend-name">Jose</h3>
                        <p className="friend-info">28 años</p>
                    </div>
                    <div className="friend">
                        <div className="friend-image">
                            <img
                                src="https://www.elneverazo.com/wp-content/uploads/2024/04/5-apr_delfi-brea.jpeg"
                                alt="Amigo 5"
                            />
                        </div>
                        <h3 className="friend-name">Alicia</h3>
                        <p className="friend-info">25 años</p>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Perfil;
