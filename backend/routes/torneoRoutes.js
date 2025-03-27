const Express = require('express');
const router = Express.Router();
const torneoController = require('../controllers/torneo');
const auth = require('../middleware/auth');

// Ruta para crear una inscripcion
router.post('/create', auth, torneoController.inscribirEnTorneo);

// Ruta para obtener todas las inscripciones (solo admin)
router.get('/', auth, torneoController.obtenerInscripciones);

// Ruta para obtener inscripciones del usuario autenticado
router.get('/user', auth, torneoController.obtenerInscripcionesPorUsuarioAutenticado);

// Ruta para obtener una inscripcion por su ID
router.get('/:id', auth, torneoController.obtenerInscripcionPorId);

// Ruta para obtener inscripcion por usuario
router.get('/user/:userId', auth, torneoController.obtenerInscripcionPorUsuario);

// Ruta para actualizar una inscripcion
router.put('/update/:id', auth, torneoController.actualizarInscripcion);

// Ruta para eliminar una inscripcion
router.delete('/delete/:id', auth, torneoController.eliminarInscripcion);

module.exports = router;
