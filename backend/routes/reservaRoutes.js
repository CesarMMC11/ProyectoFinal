const Express = require('express');
const router = Express.Router();
const  reservaController  = require('../controllers/reservas');
const auth = require('../middleware/auth');

//ruta para crear una reserva
router.post('/create', auth, reservaController.createReserva);

//ruta para obtener todas las reservas
router.get('/', reservaController.obtenerReservas);

//ruta para obtener una reserva por su ID
router.get('/:id', auth, reservaController.obtenerReservaPorId);

//ruta para obtener reserva por usuario
router.get('/user/:userId', auth, reservaController.obtenerReservaPorUsuario);

//ruta para actualizar una reserva
router.put('/:id', auth, reservaController.actualizarReserva);

//ruta para eliminar una reserva
router.delete('/:id', auth, reservaController.eliminarReserva);

module.exports = router;