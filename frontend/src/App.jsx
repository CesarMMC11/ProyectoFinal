import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Usa "Router" como alias para BrowserRouter


import Home from '../pages/home';
import Reservaciones from '../pages/reservaciones';
import Torneo from '../pages/torneos';
import Clases from '../pages/clases';
import Perfil from '../pages/perfil';
import Login from '../pages/auth/login';
import Registro from '../pages/auth/register';



const App = () => {
  return (
    <Router> {/* Aquí debe comenzar el Router */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservaciones" element={<Reservaciones />} />
        <Route path="/torneos" element={<Torneo />} />
        <Route path="/clases" element={<Clases />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

      </Routes>
    </Router>
  );
};

export default App;
