const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const imagenController = require('../controllers/imagencontroller');

// Configurar multer para almacenar archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Rutas para imágenes
router.post('/upload', auth, isAdmin, upload.single('image'), imagenController.uploadImage);
router.get('/section/:section', imagenController.getImageBySection);
router.delete('/:id', auth, isAdmin, imagenController.deleteImage);

module.exports = router;
