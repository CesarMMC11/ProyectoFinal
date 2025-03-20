import React from "react";
import Header from "../../src/components/header";
import Logo from "../../src/components/logo";
import Footer from "../../src/components/footer";

const Login = () => {
    return (
        <>
        <Header />

        <div className="form-team">
        <Logo />

        <div className="forms-container">
            <div className="form-box">
                <h2 className="form-title">LOGIN</h2>
                <form>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" placeholder="Ingresa tu Email" />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" placeholder="Ingresa tu Password" />
                    </div>
                    <button type="submit" className="submit-btn">LOGIN</button>
                    
                    <div className="forgot-password">
                        <a href="/registro"> ¿Aún no tienes cuenta? Registrate aqui! </a>
                        <br />
                        <a href="#">¿Olvidaste la Contraseña? Recuperala </a>
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
