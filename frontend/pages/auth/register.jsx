import React from "react";
import Header from "../../src/components/header";
import Logo from "../../src/components/logo";
import Footer from "../../src/components/footer";

const Registro = () => {
    return (
        <>
        <Header />

        <div className="form-team">
        <Logo />

        <div className="form-box1">
            <h2 className="form-title">Registro</h2>
            <form>
                <div className="input-group">
                    <label>Nombre y Apellido</label>
                    <input type="text" placeholder="Ingresa tu Nombre y Apellido" />

                    <label>Email</label>
                    <input type="email" placeholder="Ingresa tu Email" />

                    <label>Numero de Telefono</label>
                    <input type="text" placeholder="Ingresa tu Telefono" />
                </div>

                <div className="input-group">
                    
                    <label>Crea una Contraseña</label>
                    <input type="text" placeholder="Ingresa tu Contraseña" />

                    <label>Valida tu Contraseña</label>
                    <input type="password" placeholder="Ingresa tu Contraseña" />

                </div>
                <div className="checkbox-group">
                    <input type="checkbox" id="terms" />

                    <label htmlFor="terms">
                        Estoy de acuerdo con los terminos establecidos.
                    </label>
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
