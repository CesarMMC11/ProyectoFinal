const Express = require('express');
const router = Express.Router();
const userController = require('../controllers/user');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
    fileFilter: function (req, file, cb) {
        // Validar tipos de archivo
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes'));
        }
    }
});

// Rutas existentes
router.post('/register', userController.Register);
router.post('/login', userController.Login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.put('/change-password', authMiddleware, userController.changePassword);
router.post('/logout', userController.logout);


router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile/update', authMiddleware, userController.updateProfile);
router.post('/profile/upload-profile-image', authMiddleware, upload.single('fotoPerfil'), userController.uploadProfileImage);
router.post('/profile/upload-cover-image', authMiddleware, upload.single('fotoPortada'), userController.uploadCoverImage);

module.exports = router;
