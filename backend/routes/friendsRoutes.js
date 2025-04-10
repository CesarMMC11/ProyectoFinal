const express = require('express');
const router = express.Router();
const friendshipController = require('../controllers/friendships');
const authMiddleware = require('../middleware/auth'); // Tu middleware de autenticación

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Enviar solicitud de amistad
router.post('/request', friendshipController.sendFriendRequest);

// Aceptar solicitud de amistad
router.put('/accept/:requestId', friendshipController.acceptFriendRequest);

// Rechazar solicitud de amistad
router.put('/reject/:requestId', friendshipController.rejectFriendRequest);

// Eliminar amistad
router.delete('/:friendId', friendshipController.removeFriend);

// Obtener lista de amigos
router.get('/', friendshipController.getFriends);

// Obtener solicitudes pendientes
router.get('/pending', friendshipController.getPendingRequests);


// Buscar usuarios para añadir como amigos
router.get('/search', friendshipController.searchUsers);

module.exports = router;
