import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Usa "Router" como alias para BrowserRouter


import Home from '../pages/home';
import Reservaciones from '../pages/reservaciones';
import Torneo from '../pages/torneos';
import Clases from '../pages/clases'



const App = () => {
  return (
    <Router> {/* Aquí debe comenzar el Router */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservaciones" element={<Reservaciones />} />
        <Route path="/torneos" element={<Torneo />} />
        <Route path="/clases" element={<Clases />} />
      </Routes>
    </Router>
  );
};

export default App;
