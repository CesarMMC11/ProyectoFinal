const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron'); // Importar node-cron
const { Reserva, Torneo, Clase } = require('./models'); // Importar los modelos
const { Op } = require('sequelize'); // Importar operadores de Sequelize
// Configuración de la base de datos
const sequelize = require('./config/db');

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

// Configurar tarea programada para eliminar reservas vencidas
// Se ejecutará todos los días a la medianoche (00:00)
cron.schedule('0 0 * * *', async () => {
    console.log('Ejecutando limpieza de reservas vencidas...');
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    try {
        // Eliminar reservas vencidas
        const reservasEliminadas = await Reserva.destroy({
            where: {
                fecha: {
                    [Op.lt]: hoy
                }
            }
        });
        
        // Eliminar inscripciones a torneos vencidos
        const torneosEliminados = await Torneo.destroy({
            where: {
                fecha: {
                    [Op.lt]: hoy
                }
            }
        });
        
        // Eliminar inscripciones a clases vencidas
        const clasesEliminadas = await Clase.destroy({
            where: {
                Fecha: {
                    [Op.lt]: hoy
                }
            }
        });
        
        console.log(`Limpieza completada: ${reservasEliminadas} reservas, ${torneosEliminados} torneos y ${clasesEliminadas} clases eliminadas.`);
    } catch (error) {
        console.error('Error al limpiar reservas vencidas:', error);
    }
});

// Rutas
app.use('/api', require('./routes/userRoutes'));
app.use('/reservas', require('./routes/reservaRoutes'));
app.use('/torneos', require('./routes/torneoRoutes'));
app.use('/clases', require('./routes/clasesRoutes'));
// Ruta admin
app.use('/admin', require('./routes/adminRoutes'));
// Ruta para el perfil de usuario
app.use('/user', require('./routes/userRoutes'));
//ruta de amigos
app.use('/amigos', require('./routes/friendsRoutes'));
//ruta para cargar imagenes
app.use('/images', require('./routes/imagenRoutes'));
//ruta para pagos
app.use('/payments', require('./routes/paymentRoutes'));

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en: ${host}:${port}`);
});
