import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Logo from '../../src/components/logo';
import Footer from '../../src/components/footer';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);
    
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            setError('Token no proporcionado');
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            return setError('Las contraseñas no coinciden');
        }
        
        if (formData.newPassword.length < 6) {
            return setError('La contraseña debe tener al menos 6 caracteres');
        }
        
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch('http://localhost:3456/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    token, 
                    newPassword: formData.newPassword 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                // Redirigir al login después de 3 segundos
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.message || 'Error al restablecer la contraseña');
                if (data.message === 'El enlace ha expirado o no es válido') {
                    setTokenValid(false);
                }
            }
        } catch (error) {
            console.error('Error al restablecer contraseña:', error);
            setError('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    if (!tokenValid) {
        return (
            <>
                <div className="form-team">
                    <Logo />
                    <div className="forms-container">
                        <div className="form-box">
                            <h2 className="form-title">ENLACE INVÁLIDO</h2>
                            <p className="error-message">{error || 'El enlace ha expirado o no es válido'}</p>
                            <button 
                                onClick={() => navigate('/forgot-password')} 
                                className="submit-btn"
                            >
                                SOLICITAR NUEVO ENLACE
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <div className="form-team">
                <Logo />
                <div className="forms-container">
                    <div className="form-box">
                        <h2 className="form-title">NUEVA CONTRASEÑA</h2>
                        
                        {message && <p className="success-message">{message}</p>}
                        {error && <p className="error-message">{error}</p>}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Nueva Contraseña</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu nueva contraseña"
                                    required
                                />
                            </div>
                            
                            <div className="input-group">
                                <label>Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirma tu nueva contraseña"
                                    required
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? 'ACTUALIZANDO...' : 'ACTUALIZAR CONTRASEÑA'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ResetPassword;
