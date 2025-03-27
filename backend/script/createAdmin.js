const { User } = require('../models');
const bcrypt = require('bcrypt');

async function createAdmin() {
try {
// Verificar si ya existe un admin
const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });

if (existingAdmin) {
    console.log('El administrador ya existe');
    return;
}

// Crear el administrador
const hashedPassword = await bcrypt.hash('adminPassword123', 10);

await User.create({
    name: 'Admin',
    lastname: 'User',
    email: 'admin@example.com',
    password: hashedPassword,
    rol: 'admin',
    profileImg: 'default-admin.jpg'
});

console.log('Administrador creado exitosamente');
} catch (error) {
console.error('Error al crear administrador:', error);
} finally {
process.exit();
}
}

createAdmin();
