'use strict';

module.exports = (sequelize, DataTypes) => {
const Friendship = sequelize.define('Friendship', {
id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
},
requesterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
    model: 'Users',
    key: 'id'
    }
},
addresseeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
    model: 'Users',
    key: 'id'
    }
},
status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending',
    allowNull: false
}
}, {});

Friendship.associate = function(models) {
// Asociaciones
Friendship.belongsTo(models.User, {
    as: 'requester',
    foreignKey: 'requesterId'
});
Friendship.belongsTo(models.User, {
    as: 'addressee',
    foreignKey: 'addresseeId'
});
};

return Friendship;
};
