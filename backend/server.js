const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


const dotenv = require('dotenv');
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

// app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(bodyParser.json());
app.use(cors({
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

//ruta de las apis
app.use('/api', require('./routes/userRoutes'));
app.use('/reservas', require('./routes/reservaRoutes'));




app.listen(port, () => {
    console.log(`Servidor corriendo en: ${host}:${port}`);
});