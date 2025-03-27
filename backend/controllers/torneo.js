const { Torneo, User } = require('../models');


const torneoController = {


    inscribirEnTorneo: async (req, res) => {
        try {
            // Extrae los datos de la inscripción del cuerpo de la solicitud
            const { fecha, nombre, invitado, hora, telefono, email, userID } = req.body;
    
            let usuarioID;
    
            // Si el usuario es un administrador, puede especificar un userID
            if (req.user.rol === 'admin' && userID) {
                usuarioID = userID; // Usa el userID proporcionado en la solicitud
            } else if (req.user.rol === 'user') {
                usuarioID = req.user.userID; // Usa el ID del usuario actual
            } else {
                return res.status(403).json({ message: 'No tienes permisos para crear esta inscripción' });
            }
    
            // Crea la inscripción en la base de datos
            const nuevaInscripcion = await Torneo.create({
                userID: usuarioID, // Asocia la inscripción al usuario especificado o al usuario actual
                fecha,
                nombre,
                invitado,
                hora,
                telefono,
                email,
            });
    
            // Respuesta exitosa
            res.status(201).json({ message: 'Inscripción al torneo creada exitosamente', inscripcion: nuevaInscripcion });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al inscribirse en el torneo', error: error.message });
        }
    },





    // Obtener todas las inscripciones a torneos (solo para administradores)
        obtenerInscripciones: async (req, res) => {
        try {
            // Verifica si el usuario tiene el rol 'admin'
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ message: 'Solo los administradores pueden ver todas las inscripciones' });
            }

            // Obtiene todas las inscripciones de la base de datos
            const inscripciones = await Torneo.findAll({
                include: [{ model: User, as: 'user', attributes: ['fecha', 'nombre', 'invitado', 'hora', 'telefono', 'email'] }], // Incluye información del usuario
            });

            // Respuesta exitosa
            res.status(200).json({ inscripciones });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener las inscripciones', error: error.message });
        }
    },





    // Obtener una inscripción por ID (solo para administradores o el usuario que creó la inscripción)
    obtenerInscripcionPorId: async (req, res) => {
        try {
            const { id } = req.params;

            // Busca la inscripción en la base de datos
            const inscripcion = await Torneo.findByPk(id, {
                include: [{ model: User, as: 'user', attributes: ['fecha', 'nombre', 'invitado', 'hora', 'telefono', 'email'] }], // Incluye información del usuario
            });

            if (!inscripcion) {
                return res.status(404).json({ message: 'Inscripción no encontrada' });
            }

            // Verifica si el usuario es administrador o el dueño de la inscripción
            if (req.user.rol !== 'admin' && inscripcion.userID !== req.user.userID) {
                return res.status(403).json({ message: 'No tienes permisos para ver esta inscripción' });
            }

            // Respuesta exitosa
            res.status(200).json({ inscripcion });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener la inscripción', error: error.message });
        }
    },




    obtenerInscripcionPorUsuario: async (req, res) => {
        try {
            const userID = req.params.userId; // Asegúrate de que coincida con el parámetro en la ruta
    
            // Verifica permisos: solo el propio usuario o un admin pueden ver las inscripciones
            if (req.user.rol !== 'admin' && userID != req.user.userID) {
                return res.status(403).json({ 
                    message: 'No tienes permisos para ver las inscripciones de este usuario' 
                });
            }
    
            const inscripciones = await Torneo.findAll({
                where: { userID: userID },
                include: [{ 
                    model: User, 
                    as: 'user', 
                    attributes: ['id', 'nombre', 'email'] // Ajusta estos atributos según tu modelo User
                }]
            });
    
            if (!inscripciones || inscripciones.length === 0) {
                return res.status(404).json({ message: 'Inscripciones no encontradas' });
            } else {
                return res.status(200).json({ inscripciones });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener las inscripciones', error: error.message });
        }
    },
    
    obtenerInscripcionesPorUsuarioAutenticado: async (req, res) => {
        try {
            const userID = req.user.userID;
            console.log('Obteniendo inscripciones para el usuario ID:', userID);
            
            const inscripciones = await Torneo.findAll({
                where: { userID },
            });
            
            console.log('Inscripciones encontradas:', inscripciones.length);
            return res.status(200).json(inscripciones);
        } catch (error) {
            console.error('Error al obtener inscripciones:', error);
            res.status(500).json({ message: 'Error al obtener las inscripciones', error: error.message });
        }
    },
    
    // Actualizar una inscripción (solo para administradores o el usuario que creó la inscripción)
    actualizarInscripcion: async (req, res) => {
        try {
            const { id } = req.params;
            const { fecha, nombre, invitado, hora, telefono, email } = req.body;

            // Busca la inscripción en la base de datos
            const inscripcion = await Torneo.findByPk(id);

            if (!inscripcion) {
                return res.status(404).json({ message: 'Inscripción no encontrada' });
            }

            // Verifica si el usuario es administrador o el dueño de la inscripción
            if (req.user.rol !== 'admin' && inscripcion.userID !== req.user.userID) {
                return res.status(403).json({ message: 'No tienes permisos para actualizar esta inscripción' });
            }

            // Actualiza la inscripción
            await inscripcion.update({
                fecha,
                nombre,
                invitado,
                hora,
                telefono,
                email,
            });

            // Respuesta exitosa
            res.status(200).json({ message: 'Inscripción actualizada exitosamente', inscripcion });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar la inscripción', error: error.message });
        }
    },




    
// Eliminar una inscripción (solo para administradores o el usuario que creó la inscripción)
    eliminarInscripcion: async (req, res) => {
        try {
            const { id } = req.params;

            // Busca la inscripción en la base de datos
            const inscripcion = await Torneo.findByPk(id);

            if (!inscripcion) {
                return res.status(404).json({ message: 'Inscripción no encontrada' });
            }

            // Verifica si el usuario es administrador o el dueño de la inscripción
            if (req.user.rol !== 'admin' && inscripcion.userID !== req.user.userID) {
                return res.status(403).json({ message: 'No tienes permisos para eliminar esta inscripción' });
            }

            // Elimina la inscripción
            await inscripcion.destroy();

            // Respuesta exitosa
            res.status(200).json({ message: 'Inscripción eliminada exitosamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al eliminar la inscripción', error: error.message });
        }
    },
};




module.exports = torneoController;