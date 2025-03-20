const { Torneo, User } = require('../models');

const torneoController = {

    getAllTorneos: async (request, response) => {
        try {
            const torneos = await Torneo.findAll({
                include: [{
                    model: User, as: 'user', attributes: ['id', 'fecha', 'nombre', 'invitado', 'hora', 'telefono', 'email']
                }],
            });

            response.status(200).json(torneos)
        } catch (error) {
            console.log('Error al obtener todos los torneos', error);
            response.status(500).json({ message: 'Error al obtener los torneos'})
        }
    },

    getTorneoByID: async (request, response) => {
        try {
            const { id } = request.params;
            const torneo = await Torneo.findByPk(id, {
                include: [{
                    model: User, as: 'user', attributes: ['id', 'fecha', 'nombre', 'invitado', 'hora', 'telefono', 'email']
                }]
            });

            if (!torneo) {
                return response.status(404).json({ message: 'Torneo no encontrado'})
            }

            response.status(200).json(torneo)

        } catch (error) {
            console.log('Error al obtener torneo por ID ', error)
            response.status(500).json({ message: 'Error al obtener el torneo por su ID'})
        }
    },

    getTorneoByUser: async (request, response) => {
        try {
            const { userID } = request.params;
            const torneos = await Torneo.findAll({
                where: { userID },
                include: [{
                    model: User, as: 'user', attributes: ['id', 'fecha', 'nombre', 'invitado', 'hora', 'telefono', 'email']
                }]
            });

            if (!torneos || torneos.length == 0) {
                response.status(404).json({ message: 'No se encontraron torneos para el usuario: ' +  userID})
            }

            response.status(200).json(torneos)

        } catch (error) {
            console.log('Error al obtener torneo por el usuario', error)
        }
    },


    createTorneo: async (request, response) => {
        try {
            const { userID, fecha, nombre, invitado, hora, telefono, email } = request.body;
        } catch (error) {
            console.log('Error al crear ')
        }
    }

}