const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno
dotenv.config();
const port = process.env.PORT;
const host = process.env.HOST;

const app = express();

// Asegurarse de que el directorio de uploads exista
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Directorio de uploads creado:', uploadsDir);
}

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Servir archivos estáticos desde el directorio uploads
app.use('/uploads', express.static(uploadsDir));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Rutas
app.use('/api', require('./routes/userRoutes'));
app.use('/reservas', require('./routes/reservaRoutes'));
app.use('/torneos', require('./routes/torneoRoutes'));
app.use('/clases', require('./routes/clasesRoutes'));
// Ruta admin
app.use('/admin', require('./routes/adminRoutes'));
// Ruta para el perfil de usuario
app.use('/user', require('./routes/userRoutes'));

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en: ${host}:${port}`);
});
