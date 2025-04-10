import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Páginas de usuario
import Home from '../pages/home';
import Reservaciones from '../pages/reservaciones';
import Torneo from '../pages/torneos';
import Clases from '../pages/clases';
import Perfil from '../pages/perfil';
import Amigos from '../pages/amigos';
import Login from '../pages/auth/login';
import Registro from '../pages/auth/register';
import ResetPassword from '../pages/auth/resetPassword';
import ForgotPassword from '../pages/auth/forgotPassword';
import PendingRequests from '../src/components/friendsComponents/pendingRequest';

// Páginas de administrador
import AdminDashboard from '../pages/admin/adminDashboard';
import AdminUsers from '../pages/admin/users';
import AdminReservations from '../pages/admin/reservas';
import AdminClasses from '../pages/admin/clases';
import AdminTournaments from '../pages/admin/torneo';
import PaymentManagement from '../pages/admin/pagos'

// Componente de protección para rutas de administrador
import AdminRoute from './components/adminRouth';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    // Verificar autenticación y rol al cargar el componente
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        
        if (token) {
            setIsAuthenticated(true);
            setUserRole(role);
        }
    }, []);

    // Función para verificar si hay un token en el localStorage
    const checkAuthentication = () => {
        const token = localStorage.getItem('token');
        return !!token; // Devuelve true si hay un token, false si no
    };

    // Componente de ruta protegida para usuarios
    const ProtectedRoute = ({ element }) => {
        return checkAuthentication() ? element : <Navigate to="/login" />;
    };

    return (
        <Router>
            <Routes>
                {/* Rutas Públicas */}
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                <Route path="/" element={<Navigate to="/login" />} />


                {/* Rutas Protegidas para usuarios regulares */}
                <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
                <Route path="/reservaciones" element={<ProtectedRoute element={<Reservaciones />} />} />
                <Route path="/torneos" element={<ProtectedRoute element={<Torneo />} />} />
                <Route path="/clases" element={<ProtectedRoute element={<Clases />} />} />
                <Route path="/perfil" element={<ProtectedRoute element={<Perfil />} />} />
                <Route path="/amigos" element={<ProtectedRoute element={<Amigos />} />} /> 
                <Route path="/solicitudes-pendientes" element={<PendingRequests />} />



                {/* Rutas Protegidas para administradores */}
                <Route 
                    path="/admin/dashboard" 
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    } 
                />
                <Route 
                    path="/admin/users" 
                    element={
                        <AdminRoute>
                            <AdminUsers />
                        </AdminRoute>
                    } 
                />
                <Route 
                    path="/admin/reservations" 
                    element={
                        <AdminRoute>
                            <AdminReservations />
                        </AdminRoute>
                    } 
                />
                <Route 
                    path="/admin/classes" 
                    element={
                        <AdminRoute>
                            <AdminClasses />
                        </AdminRoute>
                    } 
                />
                <Route 
                    path="/admin/tournaments" 
                    element={
                        <AdminRoute>
                            <AdminTournaments />
                        </AdminRoute>
                    } 
                />

<Route 
                    path="/admin/payments" 
                    element={
                        <AdminRoute>
                            <PaymentManagement />
                        </AdminRoute>
                    } 
                />

                {/* Ruta por defecto - redirige a login si no está autenticado */}
                <Route path="*" element={<Navigate to={checkAuthentication() ? "/" : "/login"} />} />
            </Routes>
        </Router>
    );
};

export default App;
