const Express = require('express');
const router = Express.Router();
const classController = require('../controllers/clases');
const auth = require('../middleware/auth');

// Ruta para crear una inscripción
router.post('/create', auth, classController.inscribirEnClase);

// Ruta para obtener inscripciones del usuario autenticado (DEBE IR ANTES DE LAS RUTAS CON PARÁMETROS)
router.get('/user', auth, classController.obtenerInscripcionesPorUsuarioAutenticado);

// Ruta para obtener inscripción por usuario
router.get('/user/:userId', auth, classController.obtenerInscripcionesPorUsuario);

// Ruta para obtener todas las inscripciones
router.get('/', auth, classController.obtenerInscripciones);

// Ruta para obtener una inscripción por su ID (DEBE IR DESPUÉS DE LAS RUTAS ESPECÍFICAS)
router.get('/:id', auth, classController.obtenerInscripcionPorId);

// Ruta para actualizar una inscripción
router.put('/:id', auth, classController.actualizarInscripcion);

// Ruta para eliminar una inscripción
router.delete('/:id', auth, classController.eliminarInscripcion);

module.exports = router;
