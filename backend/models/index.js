'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

require('dotenv').config(); // Asegurarse de que las variables de entorno estén cargadas

let sequelize;
// Usar directamente las variables de entorno en lugar de config.json
sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    logging: console.log, // Puedes cambiar a false para desactivar los logs SQL
    dialectOptions: {
      // Opciones adicionales para la conexión
      connectTimeout: 60000 // aumentar el tiempo de espera para conexiones lentas
    },
    pool: {
      max: 5, // máximo de conexiones en el pool
      min: 0, // mínimo de conexiones en el pool
      acquire: 30000, // tiempo máximo en ms para obtener una conexión antes de lanzar error
      idle: 10000 // tiempo máximo en ms que una conexión puede estar inactiva antes de ser liberada
    }
  }
);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Agregar un manejador para verificar la conexión
sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos establecida correctamente.'))
  .catch(err => console.error('No se pudo conectar a la base de datos:', err));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
