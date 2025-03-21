const Express = require('express');
const router = Express.Router();
const { userController } = require('../controllers/user');

//ruta para registrar un usuario

router.post('/register', userController.Register);

//ruta para iniciar sesion

router.post('/login', userController.Login);

//ruta para cambiar la contraseña

router.put('/change-password', userController.changePassword);

// ruta para actualizar el perfil del usuario

router.put('/update-profile', userController.updateProfile);

//ruta para cerrar la sesion

router.post('/logout', userController.logout);

module.exports = router;