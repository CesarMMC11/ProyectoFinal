const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { User } = require('../models');
const { Reserva } = require('../models'); // Asegúrate de importar tus modelos correctamente
const { Clase } = require('../models');
const { Torneo } = require('../models');

// Middleware para todas las rutas de admin
router.use(auth);
router.use(isAdmin);

// Ruta para obtener todos los usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'lastname', 'email', 'rol', 'createdAt']
        });
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
});




// Ruta para actualizar el rol de un usuario
router.put('/users/:id/role', async (req, res) => {
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
});

// Ruta para eliminar un usuario
router.delete('/users/:id', async (req, res) => {
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
});

// Rutas para gestionar reservaciones
router.get('/reservas', async (req, res) => {
    try {
        const reservas = await Reserva.findAll({
            include: [{
                model: User,
                as: 'user', // Aquí debes usar el alias correcto
                attributes: ['id', 'name', 'lastname', 'email']
            }]
        });
        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener reservaciones:', error);
        res.status(500).json({ message: 'Error al obtener reservaciones', error: error.message });
    }
});


router.delete('/reservas/:id', async (req, res) => {
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
});

// Rutas para gestionar clases
router.get('/clases', async (req, res) => {
    try {
        const clases = await Clase.findAll({
            include: [{
                model: User,
                as: 'user', // Aquí debes usar el alias correcto
                attributes: ['id', 'name', 'lastname', 'email']
            }]
        });
        res.json(clases);
    } catch (error) {
        console.error('Error al obtener clases:', error);
        res.status(500).json({ message: 'Error al obtener clases', error: error.message });
    }
});

router.delete('/clases/:id', async (req, res) => {
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
});

// Rutas para gestionar torneos
router.get('/torneos', async (req, res) => {
    try {
        const torneos = await Torneo.findAll({
            include: [{
                model: User,
                as: 'user', // Aquí debes usar el alias correcto
                attributes: ['id', 'name', 'lastname', 'email']
            }]
        });
        res.json(torneos);
    } catch (error) {
        console.error('Error al obtener torneos:', error);
        res.status(500).json({ message: 'Error al obtener torneos', error: error.message });
    }
});

router.delete('/torneos/:id', async (req, res) => {
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
});

// Ruta para obtener estadísticas para el dashboard
router.get('/stats', async (req, res) => {
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
});

module.exports = router;
