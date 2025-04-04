import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../src/components/logo';
import Footer from '../../src/components/footer';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch('http://localhost:3456/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                // Opcionalmente, puedes redirigir después de un tiempo
                // setTimeout(() => navigate('/login'), 5000);
            } else {
                setError(data.message || 'Error al procesar la solicitud');
            }
        } catch (error) {
            console.error('Error al solicitar recuperación:', error);
            setError('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="form-team">
                <Logo />
                <div className="forms-container">
                    <div className="form-box">
                        <h2 className="form-title">RECUPERAR CONTRASEÑA</h2>
                        
                        {message && <p className="success-message">{message}</p>}
                        {error && <p className="error-message">{error}</p>}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Ingresa tu Email"
                                    required
                                />
                                <p className="form-help-text">
                                    Te enviaremos un enlace para restablecer tu contraseña.
                                </p>
                            </div>
                            
                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? 'ENVIANDO...' : 'ENVIAR ENLACE'}
                            </button>
                            
                            <div className="forgot-password">
                                <a href="/login">Volver al inicio de sesión</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ForgotPassword;
