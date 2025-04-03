const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Middleware para todas las rutas de admin
router.use(auth);
router.use(isAdmin);

// Rutas de usuarios
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Rutas de reservas
router.get('/reservas', adminController.getAllReservas);
router.delete('/reservas/:id', adminController.deleteReserva);

// Rutas de clases
router.get('/clases', adminController.getAllClases);
router.delete('/clases/:id', adminController.deleteClase);

// Rutas de torneos
router.get('/torneos', adminController.getAllTorneos);
router.delete('/torneos/:id', adminController.deleteTorneo);

// Ruta para estadísticas
router.get('/stats', adminController.getStats);

module.exports = router;
