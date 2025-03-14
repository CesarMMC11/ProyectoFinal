import React from 'react';
import Header from '../src/components/header';
import Footer from '../src/components/footer';


const Perfil = () => {
return (
<>
    <Header/>

    {/* Hero Section */}
    <section className="hero">
        <div className='background-profile'>
        </div>
    <div className="hero-content">
        <h2 className="hero-title">PRO</h2>
        <h1 className="hero-subtitle">PADEL</h1>
        <p className="hero-description">PLAYER</p>
    </div>
    </section>

    {/* Profile Section */}
    <section className="profile-section">
    <div className="profile-image">
        <img
        src="../../imagenes/backgroundPP.jpg"
        alt="perfil"
        />
    </div>

    <div className="friends-section">
        <div className="friend">
        <div className="friend-image">
            <img
            src="/placeholder.svg?height=60&width=60"
            alt="Amigo 1"
            />
        </div>
        <h3 className="friend-name">ELROE</h3>
        <p className="friend-info">7 años</p>
        </div>
        <div className="friend">
        <div className="friend-image">
            <img
            src="/placeholder.svg?height=60&width=60"
            alt="Amigo 2"
            />
        </div>
        <h3 className="friend-name">STREETS</h3>
        <p className="friend-info">7 años</p>
        </div>
        <div className="friend">
        <div className="friend-image">
            <img
            src="/placeholder.svg?height=60&width=60"
            alt="Amigo 3"
            />
        </div>
        <h3 className="friend-name">JACQUES</h3>
        <p className="friend-info">9 años</p>
        </div>
        <div className="friend">
        <div className="friend-image">
            <img
            src="/placeholder.svg?height=60&width=60"
            alt="Amigo 4"
            />
        </div>
        <h3 className="friend-name">ALVINS</h3>
        <p className="friend-info">7 años</p>
        </div>
        <div className="friend">
        <div className="friend-image">
            <img
            src="/placeholder.svg?height=60&width=60"
            alt="Amigo 5"
            />
        </div>
        <h3 className="friend-name">ALICIA</h3>
        <p className="friend-info">7 años</p>
        </div>
    </div>
    </section>
    <Footer />
</>
);
};

export default Perfil;
