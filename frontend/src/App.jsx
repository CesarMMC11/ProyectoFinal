import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/home';
import Reservaciones from '../pages/reservaciones';
import Torneo from '../pages/torneos';
import Clases from '../pages/clases';
import Perfil from '../pages/perfil';
import Login from '../pages/auth/login';
import Registro from '../pages/auth/register';
import Header from '../src/components/header';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Función para verificar si hay un token en el localStorage
    const checkAuthentication = () => {
        const token = localStorage.getItem('token');
        return !!token; // Devuelve true si hay un token, false si no
    };

    // Componente de ruta protegida
    const ProtectedRoute = ({ element }) => {
        return checkAuthentication() ? element : <Navigate to="/login" />;
    };

    return (
        <Router>
            <Routes>
                {/* Rutas Públicas */}
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/registro" element={<Registro />} />

                {/* Rutas Protegidas */}
                <Route path="/" element={<ProtectedRoute element={<Home />} />} />
                <Route path="/reservaciones" element={<ProtectedRoute element={<Reservaciones />} />} />
                <Route path="/torneos" element={<ProtectedRoute element={<Torneo />} />} />
                <Route path="/clases" element={<ProtectedRoute element={<Clases />} />} />
                <Route path="/perfil" element={<ProtectedRoute element={<Perfil />} />} />
            </Routes>
        </Router>
    );
};

export default App;