const { User, Reserva, Clase, Torneo } = require('../models');

const adminController = {
// Usuarios
getAllUsers: async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'lastname', 'email', 'rol', 'createdAt']
        });
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
},

updateUserRole: async (req, res) => {
    try {
        const { rol } = req.body;
        const userId = req.params.id;
        
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        await user.update({ rol });
        
        res.json({
            message: 'Rol actualizado correctamente',
            user: {
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                rol: user.rol
            }
        });
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        res.status(500).json({ message: 'Error al actualizar rol', error: error.message });
    }
},

deleteUser: async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        await user.destroy();
        
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
    }
},

// Reservas
getAllReservas: async (req, res) => {
    try {
        const reservas = await Reserva.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'lastname', 'email']
            }]
        });
        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener reservaciones:', error);
        res.status(500).json({ message: 'Error al obtener reservaciones', error: error.message });
    }
},

deleteReserva: async (req, res) => {
    try {
        const reservaId = req.params.id;
        
        const reserva = await Reserva.findByPk(reservaId);
        if (!reserva) {
            return res.status(404).json({ message: 'Reservación no encontrada' });
        }
        
        await reserva.destroy();
        
        res.json({ message: 'Reservación eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar reservación:', error);
        res.status(500).json({ message: 'Error al eliminar reservación', error: error.message });
    }
},

// Clases
getAllClases: async (req, res) => {
    try {
        const clases = await Clase.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'lastname', 'email']
            }]
        });
        res.json(clases);
    } catch (error) {
        console.error('Error al obtener clases:', error);
        res.status(500).json({ message: 'Error al obtener clases', error: error.message });
    }
},

deleteClase: async (req, res) => {
    try {
        const claseId = req.params.id;
        
        const clase = await Clase.findByPk(claseId);
        if (!clase) {
            return res.status(404).json({ message: 'Clase no encontrada' });
        }
        
        await clase.destroy();
        
        res.json({ message: 'Clase eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar clase:', error);
        res.status(500).json({ message: 'Error al eliminar clase', error: error.message });
    }
},

// Torneos
getAllTorneos: async (req, res) => {
    try {
        const torneos = await Torneo.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'lastname', 'email']
            }]
        });
        res.json(torneos);
    } catch (error) {
        console.error('Error al obtener torneos:', error);
        res.status(500).json({ message: 'Error al obtener torneos', error: error.message });
    }
},

deleteTorneo: async (req, res) => {
    try {
        const torneoId = req.params.id;
        
        const torneo = await Torneo.findByPk(torneoId);
        if (!torneo) {
            return res.status(404).json({ message: 'Torneo no encontrado' });
        }
        
        await torneo.destroy();
        
        res.json({ message: 'Torneo eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar torneo:', error);
        res.status(500).json({ message: 'Error al eliminar torneo', error: error.message });
    }
},

// Estadísticas
getStats: async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalReservations = await Reserva.count();
        const totalClasses = await Clase.count();
        const totalTournaments = await Torneo.count();
        
        res.json({
            totalUsers,
            totalReservations,
            totalClasses,
            totalTournaments
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
    }
}
};

module.exports = adminController;
