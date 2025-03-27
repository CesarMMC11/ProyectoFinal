const Express = require('express');
const router = Express.Router();
const reservaController = require('../controllers/reservas');
const auth = require('../middleware/auth');

// Ruta para crear una reserva
router.post('/create', auth, reservaController.createReserva);

// Ruta para obtener todas las reservas (añadido middleware auth)
router.get('/', auth, reservaController.obtenerReservas);

// Ruta para obtener una reserva por su ID
router.get('/:id', auth, reservaController.obtenerReservaPorId);

// Ruta para obtener reserva por usuario
router.get('/user/:userId', auth, reservaController.obtenerReservaPorUsuario);

// Ruta para obtener solo las reservas del usuario autenticado
router.get('/user', auth, reservaController.obtenerReservasPorUsuarioAutenticado);

// Rutas para actualizar y eliminar (modificadas para coincidir con el frontend)
router.put('/update/:id', auth, reservaController.actualizarReserva);
router.delete('/delete/:id', auth, reservaController.eliminarReserva);

module.exports = router;
