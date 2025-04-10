import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap'; // Importamos GSAP
import Logo from '../../src/components/logo';
import Footer from '../../src/components/footer';

const Login = ({ setIsAuthenticated }) => {


    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Creamos referencias para los elementos que animaremos
    const logoRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        // Animación del logo desde la izquierda
        gsap.fromTo(
            logoRef.current, 
            { x: '-100%', opacity: 0 }, 
            { x: '0%', opacity: 1, duration: 1.5, ease: 'power3.out' }
        );

        // Animación del formulario desde la derecha
        gsap.fromTo(
            formRef.current,
            { x: '100%', opacity: 0 },
            { x: '0%', opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.5 }
        );
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch( `${import.meta.env.VITE_API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();
        
            if (response.ok) {
                alert(data.message);
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.user.rol || 'user');
                setIsAuthenticated(true);

                if (data.user.rol === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/home');
                }
            } else {
                setError(data.message || 'Error al iniciar sesión');
            }

        } catch (error) {
            console.error('Error en el login:', error);
            setError('Error al conectar con el servidor');
        }
    };

    return (
        <>
            <div className="form-team">
                {/* Añadimos la referencia al logo */}
                <div ref={logoRef}>
                    <Logo />
                </div>
                <div className="forms-container">
                    {/* Añadimos la referencia al formulario */}
                    <div className="form-box" ref={formRef}>
                        <h2 className="form-title">INICIO DE SESIÓN</h2>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu Email"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu Password"
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-btn">INICIAR SESIÓN</button>
                            <div className="forgot-password">
                                <a href="/registro"> ¿Aún no tienes cuenta? Regístrate aquí! </a>
                                <br />
                                <a href="/forgot-password">¿Olvidaste la Contraseña? Recupérala </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;
