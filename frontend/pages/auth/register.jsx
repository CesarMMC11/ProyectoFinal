import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {gsap} from 'gsap';
import Logo from "../../src/components/logo";
import Footer from "../../src/components/footer";

const Registro = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();

        const logoRef = useRef(null);
        const formRef = useRef(null);

        useEffect(() => {
            gsap.fromTo(
                logoRef.current,
                { x: '-100%', opacity: 0},
                { x: '0%', opacity: 1, duration: 1.5, ease: 'power3.out' }
            )
        });

        useEffect(() => {
            gsap.fromTo(
                formRef.current,
                { x: '100%', opacity: 0},
                { x: '0%', opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.5 }
            )
        })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            const response = await fetch('http://localhost:3456/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    lastname: formData.lastname,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message); // Usuario registrado con éxito
                navigate('/login'); // Redirige al usuario a la página de login
            } else {
                alert(data.message); // Error al registrar
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            alert('Error al registrar el usuario.');
        }
    };

    return (
        <>
        <div className="form-team">
        <div ref={logoRef}>
            <Logo />
        </div>
        <div className="form-box1" ref={formRef}> 
            <h2 className="form-title">Sección de Registro</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Nombres</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ingresa tus Nombres" />

                    <label>Apellidos</label>
                    <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} placeholder="Ingresa tus Apellidos" />

                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Ingresa tu Email" />

                    <label>Contraseña</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Crea una contraseña" />

                    <label>Valida tu Contraseña</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Valida tu contraseña" />
                </div>
                <button type="submit" className="submit-btn">Registrarse</button>
            </form>
            <div className="forgot-password">
                <a href="/login">¿Ya tienes una cuenta? Inicia sesión</a>
            </div>
        </div>
        </div>
        <Footer />
        </>
    );
};

export default Registro;
