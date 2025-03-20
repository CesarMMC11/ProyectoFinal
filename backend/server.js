const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
// const port = process.env.PORT;
// const host = process.env.HOST;


app.use(bodyParser.json());
app.use(cors({
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));




app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});