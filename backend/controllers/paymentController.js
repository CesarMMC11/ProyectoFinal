const fs = require('fs');
const path = require('path');
const { Payment, User, Reserva, Torneo, Clase } = require('../models');

const paymentController = {
// Subir comprobante de pago móvil
uploadPaymentProof: async (req, res) => {
try {
    if (!req.file) {
    return res.status(400).json({ message: 'No se ha subido ningún comprobante' });
    }

    const { itemType, itemId, amount, method } = req.body;
    
    if (!itemType || !itemId || !amount || method !== 'mobile') {
    return res.status(400).json({ message: 'Datos incompletos para el pago' });
    }

    // Crear el registro de pago
    const payment = await Payment.create({
    amount,
    method: 'mobile',
    status: 'pending', // Pendiente de revisión
    proofImage: `/uploads/payments/${req.file.filename}`,
    itemType,
    itemId,
    UserId: req.user.userID
    });

    // Actualizar el estado del ítem según su tipo
    let item;
    switch (itemType) {
    case 'reserva':
        item = await Reserva.findByPk(itemId);
        if (item) await item.update({ paymentStatus: 'pending' });
        break;
    case 'torneo':
        item = await Torneo.findByPk(itemId);
        if (item) await item.update({ paymentStatus: 'pending' });
        break;
    case 'clase':
        item = await Clase.findByPk(itemId);
        if (item) await item.update({ paymentStatus: 'pending' });
        break;
    }

    res.status(201).json({
    message: 'Comprobante de pago subido correctamente',
    payment
    });
} catch (error) {
    console.error('Error al procesar el pago:', error);
    res.status(500).json({ message: 'Error al procesar el pago', error: error.message });
}
},

// Confirmar pago con PayPal
confirmPayPalPayment: async (req, res) => {
try {
    const { paymentId, itemType, itemId, amount } = req.body;
    
    if (!paymentId || !itemType || !itemId || !amount) {
    return res.status(400).json({ message: 'Datos incompletos para el pago' });
    }

    // Crear el registro de pago
    const payment = await Payment.create({
    amount,
    method: 'paypal',
    status: 'completed', // PayPal ya confirmó el pago
    paymentId,
    itemType,
    itemId,
    UserId: req.user.userID
    });

    // Actualizar el estado del ítem según su tipo
    let item;
    switch (itemType) {
    case 'reserva':
        item = await Reserva.findByPk(itemId);
        if (item) await item.update({ paymentStatus: 'paid' });
        break;
    case 'torneo':
        item = await Torneo.findByPk(itemId);
        if (item) await item.update({ paymentStatus: 'paid' });
        break;
    case 'clase':
        item = await Clase.findByPk(itemId);
        if (item) await item.update({ paymentStatus: 'paid' });
        break;
    }

    res.status(200).json({
    message: 'Pago confirmado correctamente',
    payment
    });
} catch (error) {
    console.error('Error al confirmar el pago:', error);
    res.status(500).json({ message: 'Error al confirmar el pago', error: error.message });
}
},

// Para administradores: aprobar o rechazar pagos pendientes
updatePaymentStatus: async (req, res) => {
try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['completed', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Estado de pago inválido' });
    }

    const payment = await Payment.findByPk(id);
    if (!payment) {
    return res.status(404).json({ message: 'Pago no encontrado' });
    }

    // Actualizar el estado del pago
    await payment.update({ status });

    // Si se aprueba el pago, actualizar el estado del ítem
    if (status === 'completed') {
    let item;
    switch (payment.itemType) {
        case 'reserva':
        item = await Reserva.findByPk(payment.itemId);
        if (item) await item.update({ paymentStatus: 'paid' });
        break;
        case 'torneo':
        item = await Torneo.findByPk(payment.itemId);
        if (item) await item.update({ paymentStatus: 'paid' });
        break;
        case 'clase':
        item = await Clase.findByPk(payment.itemId);
        if (item) await item.update({ paymentStatus: 'paid' });
        break;
    }
    } else if (status === 'rejected') {
    // Si se rechaza, actualizar el estado del ítem
    let item;
    switch (payment.itemType) {
        case 'reserva':
        item = await Reserva.findByPk(payment.itemId);
        if (item) await item.update({ paymentStatus: 'unpaid' });
        break;
        case 'torneo':
        item = await Torneo.findByPk(payment.itemId);
        if (item) await item.update({ paymentStatus: 'unpaid' });
        break;
        case 'clase':
        item = await Clase.findByPk(payment.itemId);
        if (item) await item.update({ paymentStatus: 'unpaid' });
        break;
    }
    }

    res.status(200).json({
    message: `Pago ${status === 'completed' ? 'aprobado' : 'rechazado'} correctamente`,
    payment
    });
} catch (error) {
    console.error('Error al actualizar el estado del pago:', error);
    res.status(500).json({ message: 'Error al actualizar el estado del pago', error: error.message });
}
},

// Obtener todos los pagos (para administradores)
getAllPayments: async (req, res) => {
try {
    const payments = await Payment.findAll({
    include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(payments);
} catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({ message: 'Error al obtener pagos', error: error.message });
}
},

// Obtener pagos de un usuario
getUserPayments: async (req, res) => {
try {
    const payments = await Payment.findAll({
    where: { UserId: req.user.userID },
    order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(payments);
} catch (error) {
    console.error('Error al obtener pagos del usuario:', error);
    res.status(500).json({ message: 'Error al obtener pagos del usuario', error: error.message });
}
}
};

module.exports = paymentController;
