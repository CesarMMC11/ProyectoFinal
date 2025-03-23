import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../src/components/header';
import Footer from '../src/components/footer';

const Perfil = () => {
    const navigate = useNavigate();

    // Estados para las imágenes
    const [profileImage, setProfileImage] = useState("");
    const [coverImage, setCoverImage] = useState("");

    const handleLogout = () => {
        localStorage.removeItem('token'); // Elimina el token del localStorage
        navigate('/login'); // Redirige al usuario a la página de login
    };

    // Maneja la subida de la foto de perfil
    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file); // Crea una URL temporal para la vista previa
            setProfileImage(imageUrl);
            // Aquí podrías enviar la imagen al servidor
        }
    };

    // Maneja la subida de la foto de portada
    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file); // Crea una URL temporal para la vista previa
            setCoverImage(imageUrl);
            // Aquí podrías enviar la imagen al servidor
        }
    };

    return (
        <>
            <Header />

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
                    <label htmlFor="cover-upload" className="upload-label">
                        Subir portada
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
                        <img src={profileImage} alt="perfil" />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="upload-profile"
                            style={{ display: 'none' }}
                            id="profile-upload"
                        />
                        <label htmlFor="profile-upload" className="upload-label">
                            Subir foto de perfil
                        </label>
                    </div>

                    <div className="profile-info">
                        <h1>Agus Tapia</h1>
                        <p>24 años, jugador profesional de Padel, N1 del mundo.</p>
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