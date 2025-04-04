module.exports = (sequelize, DataTypes) => {
const Payment = sequelize.define('Payment', {
    amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
    },
    method: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
        isIn: [['paypal', 'mobile']]
    }
    },
    status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    validate: {
        isIn: [['pending', 'completed', 'rejected']]
    }
    },
    paymentId: {
    type: DataTypes.STRING,
    allowNull: true // Para pagos con PayPal
    },
    proofImage: {
    type: DataTypes.STRING,
    allowNull: true // Para pagos móviles
    },
    itemType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
        isIn: [['reserva', 'torneo', 'clase']]
    }
    },
    itemId: {
    type: DataTypes.INTEGER,
    allowNull: false
    }
});

Payment.associate = (models) => {
    Payment.belongsTo(models.User);
};

return Payment;
};
