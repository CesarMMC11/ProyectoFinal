const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//COnfiguracion de JWT


const userController = {
    
    Register: async (request, response) => {
        try {
            const { email, password, name, lastname } = request.body;

                //Verificar si el correo electronico ya existe
            const existingUser = await User.findOne({ where: { email}})
            if (existingUser) {
                return response.status(400).json({ message: 'El correo electronico ya esta registrado'})
            }
            //Hashear la contraseña
            const hashedPassword = await bcrypt.hash(password, 10)
            
            //Crear un nuevo usuario
            const newUser = await User.create({
                name,
                lastname,
                email, 
                password: hashedPassword
            });
            response.status(201).json({ message: 'Usuario registrado con Exito'})
        } catch (error) {
            console.log('Error al registrar el usuario', error);
            response.status(500).json({ message: 'Error al registrar el usuario', error: error.message})
        }
    },

    Login: async (request, response) => {
        try {
            const { email, password } = request.body;

            //Verificar si el usuario existe
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return response.status(401).json({ message: 'Usuario no encontrado'});
            }

            //Verificar la contraseña
            const passwordValid = await bcrypt.compare(password, user.password);
            if (!passwordValid) {
                return response.status(401).json({ message: 'Contraseña incorrecta'});
            }

            //Generar un token
            const token = jwt.sign({ userID: user.id}, JWT_SECRET, { expiresIn: '1h' });

            response.status(200).json({ message: 'Incio de sesion exitoso', token });
        } catch (error) {
            console.log('Error al iniciar sesion', error);
            response.status(500).json({ message: 'Error al iniciar sesion', error: error.message})
        }
    },

    changePassword: async (request, response) => {
        try {
            const { id } = request.params;
            const { oldPassword, newPassword } = request.body;

            //Verificar si el usuario existe

            const user = await User.findByPk(id);
            if (!user) {
                return response.status(404).json({ message: 'Usuario no encontrado'});
            }
            //Verificar la contraseña

            const passwordValid = await bcrypt.compare(oldPassword, user.password);
            if (!passwordValid) {
                return response.status(401).json({ message: 'Contraseña incorrecta'});
            }
            //Hashea la nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            //Actualizar la contraseña en la base de datos
            await user.update({ password: hashedPassword });

            //Respuesta exitosa
            response.status(200).json({ message: 'Contraseña cambiada con exito'});
        } catch (error) {
            console.log('Error al cambiar la contraseña', error);
            response.status(500).json({ message: 'Error al cambiar la contraseña', error: error.message})
        }
    },


    updateProfile: async (request, response) => {
        try {
            const { id } = request.params;
            const { name, lastname, email, profileImg, coverImg } = request.body;

            //Verificar si el usuario existe

            const user = await User.findByPk(id);
            if (!user) {
                return response.status(404).json({ message: 'Usuario no encontrado'});
            }

            //Actualizar los datos del usuario

            await user.update({ name, lastname, email, profileImg, coverImg})

        } catch (error) {
            console.log('Error al actualizar perfil', error);
            response.status(500).json({ message: 'Error al actualizar perfil', error: error.message})
        }
    },


    logout: (request, response) => {
        try {
            response.status(200).json({ message: 'Sesion cerrada con exito'})
        } catch (error) {
            console.log('Error al cerrar sesion', error);
            response.status(500).json({ message: 'Error al cerrar sesion', error: error.message})
        }
    }
}

module.exports = userController;    