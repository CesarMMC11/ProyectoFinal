const { or } = require('sequelize');
const { Reserva, User } = require('../models'); 

// Crear una reserva (para usuarios con rol 'user' o 'admin')
const createReserva = async (req, res) => {
    try {
        // Verifica si el usuario tiene el rol 'user' o 'admin'
        if (req.user.rol !== 'user' || req.user.rol !== 'admin') {
            return res.status(403).json({ message: 'Solo los usuarios y administradores pueden crear reservas' });
        }

        // Extrae los datos de la reserva del cuerpo de la solicitud
        const { fecha, nombre, apellido, hora, telefono, email } = req.body;

        // Crea la reserva en la base de datos
        const nuevaReserva = await Reserva.create({
            userID: req.user.id, 
            fecha,
            nombre,
            apellido,
            hora,
            telefono,
            email,
        });

        // Respuesta exitosa
        res.status(201).json({ message: 'Reserva creada exitosamente', reserva: nuevaReserva });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la reserva', error: error.message });
    }
};

// Obtener todas las reservas (solo para administradores)
const obtenerReservas = async (req, res) => {
    try {
        // Verifica si el usuario tiene el rol 'admin'
        if (req.user.rol !== 'admin') {
            return res.status(403).json({ message: 'Solo los administradores pueden ver todas las reservas' });
        }

        // Obtiene todas las reservas de la base de datos
        const reservas = await Reserva.findAll({
            include: [{ model: User, as: 'user', attributes: ['name', 'email'] }], // Incluye información del usuario
        });

        // Respuesta exitosa
        res.status(200).json({ reservas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las reservas', error: error.message });
    }
};

// Obtener una reserva por ID (solo para administradores o el usuario que creó la reserva)
const obtenerReservaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        // Busca la reserva en la base de datos
        const reserva = await Reserva.findByPk(id, {
            include: [{ model: User, as: 'user', attributes: ['name', 'email'] }], // Incluye información del usuario
        });

        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        // Verifica si el usuario es administrador o el dueño de la reserva
        if (req.user.rol !== 'admin' || reserva.userID !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permisos para ver esta reserva' });
        }

        // Respuesta exitosa
        res.status(200).json({ reserva });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la reserva', error: error.message });
    }
};

// Actualizar una reserva (solo para administradores o el usuario que creó la reserva)
const actualizarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, nombre, apellido, hora, telefono, email } = req.body;

        // Busca la reserva en la base de datos
        const reserva = await Reserva.findByPk(id);

        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        // Verifica si el usuario es administrador o el dueño de la reserva
        if (req.user.rol !== 'admin' || reserva.userID !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permisos para actualizar esta reserva' });
        }

        // Actualiza la reserva
        await reserva.update({
            fecha,
            nombre,
            apellido,
            hora,
            telefono,
            email,
        });

        // Respuesta exitosa
        res.status(200).json({ message: 'Reserva actualizada exitosamente', reserva });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la reserva', error: error.message });
    }
};

// Eliminar una reserva (solo para administradores o el usuario que creó la reserva)
const eliminarReserva = async (req, res) => {
    try {
        const { id } = req.params;

        // Busca la reserva en la base de datos
        const reserva = await Reserva.findByPk(id);

        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        // Verifica si el usuario es administrador o el dueño de la reserva
        if (req.user.rol !== 'admin' || reserva.userID !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permisos para eliminar esta reserva' });
        }

        // Elimina la reserva
        await reserva.destroy();

        // Respuesta exitosa
        res.status(200).json({ message: 'Reserva eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la reserva', error: error.message });
    }
};

module.exports = {
    createReserva,
    obtenerReservas,
    obtenerReservaPorId,
    actualizarReserva,
    eliminarReserva,
};