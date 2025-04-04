module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        section: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['reservas', 'torneos', 'clases']]
            }
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mimetype: {
            type: DataTypes.STRING,
            allowNull: false
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    
    return Image;
};
