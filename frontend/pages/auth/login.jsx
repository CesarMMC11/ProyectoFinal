import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../src/components/logo';
import Footer from '../../src/components/footer';

const Login = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3456/api/login', {
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
        
            // En la función handleSubmit de tu componente Login.jsx
            if (response.ok) {
                alert(data.message); // Inicio de sesión exitoso
                localStorage.setItem('token', data.token); // Guarda el token
                
                // Guardar el rol del usuario
                localStorage.setItem('userRole', data.user.rol || 'user');
                
                setIsAuthenticated(true); // Actualiza el estado de autenticación
                
                // Redirigir según el rol
                if (data.user.rol === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/'); // Redirige al usuario regular a la página de inicio
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
                <Logo />
                <div className="forms-container">
                    <div className="form-box">
                        <h2 className="form-title">LOGIN</h2>
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
                            <button type="submit" className="submit-btn">LOGIN</button>
                            <div className="forgot-password">
                                <a href="/registro"> ¿Aún no tienes cuenta? Regístrate aquí! </a>
                                <br />
                                <a href="#">¿Olvidaste la Contraseña? Recupérala </a>
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
