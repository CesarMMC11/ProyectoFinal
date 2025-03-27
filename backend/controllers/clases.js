const { Clase, User } = require('../models');

const classController = {
    inscribirEnClase: async (req, res) => {
        try {
            // Log para depuración
            console.log('Datos recibidos:', req.body);
            console.log('Usuario actual:', req.user);

            // Extrae los datos de la inscripción del cuerpo de la solicitud
            const { Nombre, Hora, Telefono, Fecha, userID } = req.body;

            let usuarioID;

            // Si el usuario es un administrador, puede especificar un userID
            if (req.user.rol === 'admin' && userID) {
                usuarioID = userID; // Usa el userID proporcionado en la solicitud
            } else if (req.user.rol === 'user') {
                if (!req.user.userID) {
                    return res.status(400).json({ message: 'ID de usuario no encontrado' });
                }
                usuarioID = req.user.userID;
            } else {
                return res.status(403).json({ message: 'No tienes permisos para crear esta inscripción' });
            }

            // Crea la inscripción en la base de datos
            const nuevaInscripcion = await Clase.create({
                userID: usuarioID,
                Nombre,
                Hora,
                Telefono,
                Fecha,
            });

            // Log para depuración
            console.log('Inscripción creada:', nuevaInscripcion);

            // Respuesta exitosa
            res.status(201).json({ 
                message: 'Inscripción a la clase creada exitosamente', 
                inscripcion: nuevaInscripcion 
            });
        } catch (error) {
            console.error('Error detallado:', error);
            
            // Manejo específico para errores de validación de Sequelize
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    message: 'Error de validación',
                    errors: error.errors.map(e => ({ field: e.path, message: e.message }))
                });
            }
            
            res.status(500).json({ 
                message: 'Error al inscribirse en la clase', 
                error: error.message 
            });
        }
    },

    // Obtener todas las inscripciones a clases (solo para administradores)
    obtenerInscripciones: async (req, res) => {
        try {
            // Log para depuración
            console.log('Usuario actual:', req.user);

            // Verifica si el usuario tiene el rol 'admin'
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ message: 'Solo los administradores pueden ver todas las inscripciones' });
            }

            // Obtiene todas las inscripciones de la base de datos
            const inscripciones = await Clase.findAll({
                include: [{ 
                    model: User, 
                    as: 'user', 
                    attributes: ['id', 'nombre', 'email'] // Corregido para usar atributos reales de User
                }]
            });

            // Respuesta exitosa
            res.status(200).json({ inscripciones });
        } catch (error) {
            console.error('Error detallado:', error);
            res.status(500).json({ 
                message: 'Error al obtener las inscripciones', 
                error: error.message 
            });
        }
    },

    // Obtener una inscripción por ID (solo para administradores o el usuario que creó la inscripción)
    obtenerInscripcionPorId: async (req, res) => {
        try {
            const { id } = req.params;

            // Busca la inscripción en la base de datos
            const inscripcion = await Clase.findByPk(id, {
                include: [{ 
                    model: User, 
                    as: 'user', 
                    attributes: ['id', 'nombre', 'email'] // Corregido para usar atributos reales de User
                }]
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
            console.error('Error detallado:', error);
            res.status(500).json({ 
                message: 'Error al obtener la inscripción', 
                error: error.message 
            });
        }
    },

    // Obtener inscripciones por usuario
    obtenerInscripcionesPorUsuario: async (req, res) => {
        try {
            const userId = req.params.userId;

            // Log para depuración
            console.log('ID de usuario solicitado:', userId);
            console.log('Usuario actual:', req.user);

            // Verifica permisos: solo el propio usuario o un admin pueden ver las inscripciones
            if (req.user.rol !== 'admin' && userId != req.user.userID) {
                return res.status(403).json({
                    message: 'No tienes permisos para ver las inscripciones de este usuario'
                });
            }

            // Busca todas las inscripciones del usuario
            const inscripciones = await Clase.findAll({
                where: { userID: userId },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'nombre', 'email'] // Corregido para usar atributos reales de User
                }]
            });

            // Respuesta exitosa
            res.status(200).json({ inscripciones });
        } catch (error) {
            console.error('Error detallado:', error);
            res.status(500).json({
                message: 'Error al obtener las inscripciones del usuario',
                error: error.message
            });
        }
    },

    // Obtener inscripciones del usuario autenticado
obtenerInscripcionesPorUsuarioAutenticado: async (req, res) => {
    try {
        const userID = req.user.userID;
        
        console.log('Obteniendo inscripciones para el usuario autenticado ID:', userID);
        
        // Busca todas las inscripciones del usuario
        const inscripciones = await Clase.findAll({
            where: { userID },
            // include: [{
            //     model: User,
            //     as: 'user',
            //     attributes: ['id', 'nombre', 'email']
            // }]
        });
        
        // Respuesta exitosa
        res.status(200).json(inscripciones);
    } catch (error) {
        console.error('Error detallado:', error);
        res.status(500).json({
            message: 'Error al obtener las inscripciones del usuario',
            error: error.message
        });
    }
},


    // Actualizar una inscripción (solo para administradores o el usuario que creó la inscripción)
    actualizarInscripcion: async (req, res) => {
        try {
            const { id } = req.params;
            const { Nombre, Hora, Telefono, Fecha } = req.body;

            // Log para depuración
            console.log('Datos recibidos para actualización:', req.body);

            // Validación de datos
            if (!Nombre || !Hora || !Telefono || !Fecha) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            // Busca la inscripción en la base de datos
            const inscripcion = await Clase.findByPk(id);

            if (!inscripcion) {
                return res.status(404).json({ message: 'Inscripción no encontrada' });
            }

            // Verifica si el usuario es administrador o el dueño de la inscripción
            if (req.user.rol !== 'admin' && inscripcion.userID !== req.user.userID) {
                return res.status(403).json({ message: 'No tienes permisos para actualizar esta inscripción' });
            }

            // Actualiza la inscripción
            await inscripcion.update({
                Nombre,
                Hora,
                Telefono,
                Fecha,
            });

            // Respuesta exitosa
            res.status(200).json({ 
                message: 'Inscripción actualizada exitosamente', 
                inscripcion 
            });
        } catch (error) {
            console.error('Error detallado:', error);
            
            // Manejo específico para errores de validación de Sequelize
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    message: 'Error de validación',
                    errors: error.errors.map(e => ({ field: e.path, message: e.message }))
                });
            }
            
            res.status(500).json({ 
                message: 'Error al actualizar la inscripción', 
                error: error.message 
            });
        }
    },

    // Eliminar una inscripción (solo para administradores o el usuario que creó la inscripción)
    eliminarInscripcion: async (req, res) => {
        try {
            const { id } = req.params;

            // Busca la inscripción en la base de datos
            const inscripcion = await Clase.findByPk(id);

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
            console.error('Error detallado:', error);
            res.status(500).json({ 
                message: 'Error al eliminar la inscripción', 
                error: error.message 
            });
        }
    },
};

module.exports = classController;
