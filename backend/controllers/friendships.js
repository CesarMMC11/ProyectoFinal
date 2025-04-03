const { User, Friendship } = require('../models');
const { Op } = require('sequelize');

const friendshipController = {
// Enviar solicitud de amistad
sendFriendRequest: async (req, res) => {
try {
    const { addresseeId } = req.body;
    const requesterId = req.user.userID; // Asumiendo que tienes middleware de autenticación
    
    // Verificar que no se envíe solicitud a sí mismo
    if (requesterId === parseInt(addresseeId)) {
    return res.status(400).json({ message: 'No puedes enviarte una solicitud a ti mismo' });
    }
    
    // Verificar que el destinatario existe
    const addressee = await User.findByPk(addresseeId);
    if (!addressee) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Verificar si ya existe una solicitud o amistad
    const existingFriendship = await Friendship.findOne({
    where: {
        [Op.or]: [
        { requesterId, addresseeId },
        { requesterId: addresseeId, addresseeId: requesterId }
        ]
    }
    });
    
    if (existingFriendship) {
    if (existingFriendship.status === 'accepted') {
        return res.status(400).json({ message: 'Ya son amigos' });
    } else if (existingFriendship.status === 'pending') {
        if (existingFriendship.requesterId === requesterId) {
        return res.status(400).json({ message: 'Ya has enviado una solicitud a este usuario' });
        } else {
        // El otro usuario ya te envió una solicitud, acéptala automáticamente
        existingFriendship.status = 'accepted';
        await existingFriendship.save();
        return res.status(200).json({ message: 'Solicitud aceptada automáticamente' });
        }
    } else if (existingFriendship.status === 'rejected') {
        // Actualizar la solicitud rechazada a pendiente
        existingFriendship.status = 'pending';
        existingFriendship.requesterId = requesterId;
        existingFriendship.addresseeId = addresseeId;
        await existingFriendship.save();
        return res.status(200).json({ message: 'Solicitud de amistad enviada' });
    }
    }
    
    // Crear nueva solicitud de amistad
    await Friendship.create({
    requesterId,
    addresseeId,
    status: 'pending'
    });
    
    res.status(201).json({ message: 'Solicitud de amistad enviada' });
} catch (error) {
    console.error('Error al enviar solicitud de amistad:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
}
},

// Aceptar solicitud de amistad
acceptFriendRequest: async (req, res) => {
try {
    const { requestId } = req.params;
    const userId = req.user.userID;
    
    const friendship = await Friendship.findOne({
    where: {
        id: requestId,
        addresseeId: userId,
        status: 'pending'
    }
    });
    
    if (!friendship) {
    return res.status(404).json({ message: 'Solicitud de amistad no encontrada' });
    }
    
    friendship.status = 'accepted';
    await friendship.save();
    
    res.status(200).json({ message: 'Solicitud de amistad aceptada' });
} catch (error) {
    console.error('Error al aceptar solicitud de amistad:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
}
},

// Rechazar solicitud de amistad
rejectFriendRequest: async (req, res) => {
try {
    const { requestId } = req.params;
    const userId = req.user.userID;
    
    const friendship = await Friendship.findOne({
    where: {
        id: requestId,
        addresseeId: userId,
        status: 'pending'
    }
    });
    
    if (!friendship) {
    return res.status(404).json({ message: 'Solicitud de amistad no encontrada' });
    }
    
    friendship.status = 'rejected';
    await friendship.save();
    
    res.status(200).json({ message: 'Solicitud de amistad rechazada' });
} catch (error) {
    console.error('Error al rechazar solicitud de amistad:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
}
},

// Eliminar amistad
removeFriend: async (req, res) => {
try {
    const { friendId } = req.params;
    const userId = req.user.userID;
    
    const friendship = await Friendship.findOne({
    where: {
        [Op.or]: [
        { requesterId: userId, addresseeId: friendId },
        { requesterId: friendId, addresseeId: userId }
        ],
        status: 'accepted'
    }
    });
    
    if (!friendship) {
    return res.status(404).json({ message: 'Amistad no encontrada' });
    }
    
    await friendship.destroy();
    
    res.status(200).json({ message: 'Amistad eliminada' });
} catch (error) {
    console.error('Error al eliminar amistad:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
}
},

// Obtener lista de amigos
getFriends: async (req, res) => {
try {
    const userId = req.user.userID;
    
    // Buscar amistades donde el usuario es el solicitante
    const friendsAsRequester = await Friendship.findAll({
    where: {
        requesterId: userId,
        status: 'accepted'
    },
    include: [{
        model: User,
        as: 'addressee',
        attributes: ['id', 'name', 'lastname', 'email', 'profileImg']
    }]
    });
    
    // Buscar amistades donde el usuario es el destinatario
    const friendsAsAddressee = await Friendship.findAll({
    where: {
        addresseeId: userId,
        status: 'accepted'
    },
    include: [{
        model: User,
        as: 'requester',
        attributes: ['id', 'name', 'lastname', 'email', 'profileImg']
    }]
    });
    
    // Combinar y formatear resultados
    const friends = [
    ...friendsAsRequester.map(f => ({
        id: f.addressee.id,
        name: f.addressee.name,
        lastname: f.addressee.lastname,
        email: f.addressee.email,
        profileImg: f.addressee.profileImg || null, 
        friendshipId: f.id
    })),
    ...friendsAsAddressee.map(f => ({
        id: f.requester.id,
        name: f.requester.name,
        lastname: f.requester.lastname,
        email: f.requester.email,
        profileImg: f.requester.profileImg || null, 
        friendshipId: f.id
    }))
    ];
    
    res.status(200).json(friends);
} catch (error) {
    console.error('Error al obtener lista de amigos:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
}
},

// Obtener solicitudes de amistad pendientes
getPendingRequests: async (req, res) => {
try {
    const userId = req.user.userID;
    
    const pendingRequests = await Friendship.findAll({
    where: {
        addresseeId: userId,
        status: 'pending'
    },
    include: [{
        model: User,
        as: 'requester',
        attributes: ['id', 'name', 'lastname', 'email']
    }]
    });
    
    const formattedRequests = pendingRequests.map(request => ({
    id: request.id,
    requester: {
        id: request.requester.id,
        name: request.requester.name,
        lastname: request.requester.lastname,
        email: request.requester.email
    },
    createdAt: request.createdAt
    }));
    
    res.status(200).json(formattedRequests);
} catch (error) {
    console.error('Error al obtener solicitudes pendientes:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
}
},

// Buscar usuarios para añadir como amigos

searchUsers: async (req, res) => {
    try {
        const { query } = req.query;
        const userId = req.user.userID;

        if (!query || query.length < 3) { // Corregido: length en lugar de legth
            return res.status(400).json({ message: 'La búsqueda debe tener al menos 3 caracteres' });
        }

        const users = await User.findAll({
            where: {
                id: { [Op.ne]: userId },
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } }, // Corregido: Op.like en minúscula
                    { lastname: { [Op.like]: `%${query}%` } }, // Corregido: Op.like en minúscula
                    { email: { [Op.like]: `%${query}%` } } // Corregido: Op.like en minúscula
                ]
            },
            attributes: ['id', 'name', 'lastname', 'email'],
            limit: 10
        });

        const friendships = await Friendship.findAll({
            where: {
                [Op.or]: [
                    { requesterId: userId, addresseeId: { [Op.in]: users.map(u => u.id) } },
                    { addresseeId: userId, requesterId: { [Op.in]: users.map(u => u.id) } }
                ]
            }
        });

        const usersWithFriendshipStatus = users.map(user => {
            const friendship = friendships.find(f =>
                (f.requesterId === userId && f.addresseeId === user.id) ||
                (f.addresseeId === userId && f.requesterId === user.id)
            );
        
            let friendshipStatus = null;
            let friendshipId = null;
        
            if (friendship) {
                friendshipStatus = friendship.status;
                friendshipId = friendship.id;
            }
        
            return {
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                friendshipStatus,
                friendshipId,
                // Determinar si el usuario actual envió la solicitud o la recibió
                sentByMe: friendship ? friendship.requesterId === userId : false
            };
        });
    
        res.status(200).json(usersWithFriendshipStatus);
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
    }
}
};

module.exports = friendshipController;
