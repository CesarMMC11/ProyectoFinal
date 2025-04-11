const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
process.env.DB_NAME,
process.env.DB_USER,
process.env.DB_PASSWORD,
{
host: process.env.DB_HOST,
dialect: 'mysql',
port: process.env.DB_PORT
}
);

sequelize
.authenticate()
.then(() => console.log('¡Conexión exitosa con la base de datos!'))
.catch(err => console.error('Error al conectar la base de datos:', err));

module.exports = sequelize;
