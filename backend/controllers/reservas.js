const { Reserva, User } = require('../models');

const reservaController = {
    createReserva: async (req, res) => {
        try {
            console.log('Datos recibidos:', req.body);
            console.log('Usuario autenticado:', req.user);

            // Verifica si el usuario tiene el rol 'user' o 'admin'
            if (req.user.rol !== 'user' && req.user.rol !== 'admin') {
                return res.status(403).json({ message: 'Solo los usuarios y administradores pueden crear reservas' });
            }

            // Extrae los datos de la reserva del cuerpo de la solicitud
            const { fecha, nombre, apellido, hora, telefono, email } = req.body;

            // Crea la reserva en la base de datos
            const nuevaReserva = await Reserva.create({
                userID: req.user.userID,
                fecha,
                nombre,
                apellido,
                hora,
                telefono,
                email
            });

            // Respuesta exitosa
            res.status(201).json({ message: 'Reserva creada exitosamente', reserva: nuevaReserva });
        } catch (error) {
            console.error('Error en createReserva:', error);
            res.status(500).json({ message: 'Error al crear la reserva', error: error.message });
        }
    },

    // Obtener todas las reservas (solo para administradores)
   // Obtener todas las reservas (para administradores) o las propias (para usuarios)
obtenerReservas: async (req, res) => {
    try {
        // Si es administrador, obtiene todas las reservas
        if (req.user.rol === 'admin') {
            const reservas = await Reserva.findAll({
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['name', 'lastname', 'email', 'profileImg']
                }],
            });
            return res.status(200).json(reservas);
        } 
        // Si es usuario normal, obtiene solo sus reservas
        else {
            const userID = req.user.userID;
            const reservas = await Reserva.findAll({
                where: { userID },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['name', 'lastname', 'email', 'profileImg']
                }],
            });
            return res.status(200).json(reservas);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las reservas', error: error.message });
    }
},

// Método específico para obtener reservas del usuario autenticado
obtenerReservasPorUsuarioAutenticado: async (req, res) => {
    try {
        const userID = req.user.userID;
        console.log('Obteniendo reservas para el usuario autenticado:', userID);

        const reservas = await Reserva.findAll({
            where: { userID },
            include: [{
                model: User,
                as: 'user',
                attributes: ['name', 'lastname', 'email', 'profileImg']
            }],
        });

        // Respuesta exitosa con las reservas
        res.status(200).json(reservas);
    } catch (error) {
        console.error('Error al obtener reservas del usuario autenticado:', error);
        res.status(500).json({ message: 'Error al obtener tus reservaciones', error: error.message });
    }
},


    // Obtener una reserva por ID (solo para administradores o el usuario que creó la reserva)
    obtenerReservaPorId: async (req, res) => {
        try {
            const { id } = req.params;
            console.log('ID de reserva solicitada:', id);

            const reserva = await Reserva.findByPk(id, {
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['name', 'lastname', 'email', 'profileImg']
                }],
            });

            if (!reserva) {
                return res.status(404).json({ message: 'Reserva no encontrada' });
            }

            // Verifica si el usuario es administrador o el dueño de la reserva
            if (req.user.rol !== 'admin' && reserva.userID !== req.user.userID) {
                return res.status(403).json({ message: 'No tienes permisos para ver esta reserva' });
            }

            // Respuesta exitosa
            res.status(200).json(reserva);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener la reserva', error: error.message });
        }
    },

    // Obtener reservas por usuario (solo para administradores)
    obtenerReservaPorUsuario: async (req, res) => {
        try {
            // Verifica si el usuario tiene el rol 'admin'
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ message: 'Solo los administradores pueden ver las reservas de otros usuarios' });
            }

            const { userId } = req.params;
            console.log('Buscando reservas para el usuario:', userId);

            // Busca las reservas del usuario en la base de datos
            const reservas = await Reserva.findAll({
                where: { userID: userId },
                include: [{ 
                    model: User, 
                    as: 'user', 
                    attributes: ['name', 'lastname', 'email', 'profileImg'] 
                }],
            });

            // Respuesta exitosa
            res.status(200).json(reservas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener las reservas del usuario', error: error.message });
        }
    },

    // Actualizar una reserva (solo para administradores o el usuario que creó la reserva)
    actualizarReserva: async (req, res) => {
        try {
            const { id } = req.params;
            console.log('ID de reserva a actualizar:', id);
            console.log('Datos de actualización:', req.body);
            
            const { fecha, nombre, apellido, hora, telefono, email } = req.body;

            // Busca la reserva en la base de datos
            const reserva = await Reserva.findByPk(id);

            if (!reserva) {
                return res.status(404).json({ message: 'Reserva no encontrada' });
            }

            // Verifica si el usuario es administrador o el dueño de la reserva
            if (req.user.rol !== 'admin' && reserva.userID !== req.user.userID) {
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
    },

    // Eliminar una reserva (solo para administradores o el usuario que creó la reserva)
    eliminarReserva: async (req, res) => {
        try {
            const { id } = req.params;
            console.log('ID de reserva a eliminar:', id);

            // Busca la reserva en la base de datos
            const reserva = await Reserva.findByPk(id);

            if (!reserva) {
                return res.status(404).json({ message: 'Reserva no encontrada' });
            }

            // Verifica si el usuario es administrador o el dueño de la reserva
            if (req.user.rol !== 'admin' && reserva.userID !== req.user.userID) {
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
    }
};

module.exports = reservaController;
