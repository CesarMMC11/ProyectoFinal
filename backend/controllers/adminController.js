const { User, Reserva, Torneo, Clase } = require('../models');

const adminController = {
    // Obtener estadísticas para el dashboard
    getStats: async (req, res) => {
        try {
            const totalUsuarios = await User.count();
            const totalReservas = await Reserva.count();
            const totalTorneos = await Torneo.count();
            const totalClases = await Clase.count();

            res.status(200).json({
                totalUsuarios,
                totalReservas,
                totalTorneos,
                totalClases
            });
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
        }
    },

    // Obtener todos los usuarios
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: ['id', 'name', 'lastname', 'email', 'rol', 'profileImg', 'createdAt']
            });
            res.status(200).json(users);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
        }
    },

    // Crear un nuevo administrador
    createAdmin: async (req, res) => {
        try {
            const { name, lastname, email, password } = req.body;
            
            // Verificar si el email ya existe
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'El email ya está registrado' });
            }
            
            // Crear el administrador
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const newAdmin = await User.create({
                name,
                lastname,
                email,
                password: hashedPassword,
                rol: 'admin',
                profileImg: req.body.profileImg || 'default-admin.jpg'
            });
            
            res.status(201).json({ 
                message: 'Administrador creado exitosamente',
                admin: {
                    id: newAdmin.id,
                    name: newAdmin.name,
                    email: newAdmin.email,
                    rol: newAdmin.rol
                }
            });
        } catch (error) {
            console.error('Error al crear administrador:', error);
            res.status(500).json({ message: 'Error al crear administrador', error: error.message });
        }
    }
};

module.exports = adminController;
