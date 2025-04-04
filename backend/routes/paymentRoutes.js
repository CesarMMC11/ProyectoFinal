const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const paymentController = require('../controllers/paymentController');

// Configurar multer para almacenar comprobantes de pago
const storage = multer.diskStorage({
destination: function (req, file, cb) {
const uploadsDir = path.join(__dirname, '../uploads/payments');
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

// Rutas para pagos
router.post('/upload-proof', auth, upload.single('paymentProof'), paymentController.uploadPaymentProof);
router.post('/confirm-paypal', auth, paymentController.confirmPayPalPayment);
router.put('/:id/status', auth, isAdmin, paymentController.updatePaymentStatus);
router.get('/', auth, isAdmin, paymentController.getAllPayments);
router.get('/user', auth, paymentController.getUserPayments);

module.exports = router;
