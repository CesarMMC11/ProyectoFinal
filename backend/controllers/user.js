const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'llave secreta'
const emailServices = require('../utils/emailServices')
const { Op } = require('sequelize');

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

            await emailServices.sendWelcomeEmail(email, name);


            response.status(201).json({ message: 'Usuario registrado con Exito'})
        } catch (error) {
            console.log('Error al registrar el usuario', error);
            response.status(500).json({ message: 'Error al registrar el usuario', error: error.message})
        }
    },

    Login: async (request, response) => {
        try {
            const { email, password } = request.body;
    
            // Verificar si el usuario existe
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return response.status(401).json({ message: 'Usuario no encontrado'});
            }
    
            // Verificar la contraseña
            const passwordValid = await bcrypt.compare(password, user.password);
            if (!passwordValid) {
                return response.status(401).json({ message: 'Contraseña incorrecta'});
            }
    
            // Generar un token
            const token = jwt.sign({ 
                userID: user.id, 
                rol: user.rol 
            }, SECRET_KEY, { expiresIn: '1h' });
    
            response.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 3600000,
            });
    
            // Incluir el rol del usuario en la respuesta
            response.status(200).json({ 
                message: 'Inicio de sesión exitoso', 
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    lastname: user.lastname,
                    email: user.email,
                    rol: user.rol
                }
            });
        } catch (error) {
            console.log('Error al iniciar sesion', error);
            response.status(500).json({ message: 'Error al iniciar sesion', error: error.message})
        }
    },
    

    changePassword: async (request, response) => {
        try {
            const userID = request.user.userID;
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

    forgotPassword: async (req, res) => {
        try {
        const { email } = req.body;
        
        // Verificar si el usuario existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
        // Por seguridad, no revelamos si el email existe o no
        return res.status(200).json({ 
            message: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña' 
        });
        }
        
        // Generar token único
        const resetToken = jwt.sign({ 
        userId: user.id 
        }, SECRET_KEY, { expiresIn: '1h' });
        
        // Guardar el token en la base de datos
        await user.update({
        resetToken: resetToken,
        resetTokenExpiry: Date.now() + 3600000 // 1 hora en milisegundos
        });
        
        // Enviar email con el token
        await emailServices.sendPasswordResetEmail(user.email, user.name, resetToken);
        
        res.status(200).json({ 
        message: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña' 
        });
    } catch (error) {
        console.error('Error al solicitar restablecimiento de contraseña:', error);
        res.status(500).json({ 
        message: 'Error al procesar la solicitud', 
        error: error.message 
        });
    }
    },
    
    resetPassword: async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        // Verificar que el token sea válido
        let decoded;
        try {
        decoded = jwt.verify(token, SECRET_KEY);
        } catch (error) {
        return res.status(400).json({ message: 'El enlace ha expirado o no es válido' });
        }
        
        // Buscar al usuario por el ID en el token
        const user = await User.findOne({ 
        where: { 
            id: decoded.userId,
            resetToken: token,
            resetTokenExpiry: { [Op.gt]: Date.now() } // Verifica que el token no haya expirado
        } 
        });
        
        if (!user) {
        return res.status(400).json({ message: 'El enlace ha expirado o no es válido' });
        }
        
        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Actualizar la contraseña y limpiar el token de restablecimiento
        await user.update({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
        });
        
        res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        res.status(500).json({ 
        message: 'Error al restablecer la contraseña', 
        error: error.message 
        });
    }
    },
    

    updateProfile: async (request, response) => {
        try {
            // Obtener el ID del usuario del token
            const userID = request.user.userID;
            const { nombre, descripcion } = request.body;

            // Verificar si el usuario existe
            const user = await User.findByPk(userID);
            if (!user) {
                return response.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Actualizar los datos del usuario
            await user.update({ 
                name: nombre || user.name,
                description: descripcion || user.description
            });

            response.status(200).json({ 
                message: 'Perfil actualizado con éxito',
                user: {
                    id: user.id,
                    name: user.name,
                    lastname: user.lastname,
                    description: user.description,
                    profileImg: user.profileImg,
                    coverImg: user.coverImg
                }
            });
        } catch (error) {
            console.log('Error al actualizar perfil', error);
            response.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
        }
    },

    getProfile: async (request, response) => {
        try {
            // Obtener el ID del usuario del token
            const userID = request.user.userID;

            // Buscar el usuario en la base de datos
            const user = await User.findByPk(userID);
            if (!user) {
                return response.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Devolver los datos del usuario
            response.status(200).json({
                id: user.id,
                nombre: user.name,
                apellido: user.lastname,
                email: user.email,
                descripcion: user.description,
                fotoPerfil: user.profileImg,
                fotoPortada: user.coverImg
            });
        } catch (error) {
            console.log('Error al obtener perfil', error);
            response.status(500).json({ message: 'Error al obtener perfil', error: error.message });
        }
    },

    uploadProfileImage: async (request, response) => {
        try {
            // Verificar si hay un archivo
            if (!request.file) {
                return response.status(400).json({ message: 'No se ha subido ninguna imagen' });
            }
    
            // Obtener el ID del usuario del token
            const userID = request.user.userID;
    
            // Verificar si el usuario existe
            const user = await User.findByPk(userID);
            if (!user) {
                return response.status(404).json({ message: 'Usuario no encontrado' });
            }
    
            // Ruta relativa del archivo subido
            const filePath = `/uploads/${request.file.filename}`;
            
            // Actualizar la base de datos
            await user.update({ profileImg: filePath });
    
            response.status(200).json({
                message: 'Imagen de perfil actualizada con éxito',
                profileImg: filePath
            });
        } catch (error) {
            console.log('Error al subir imagen de perfil', error);
            response.status(500).json({ message: 'Error al subir imagen de perfil', error: error.message });
        }
    },
    


    uploadCoverImage: async (req, res) => {
        try {
            // Verificar si hay un archivo subido
            if (!req.file) {
                return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
            }
            
            // Obtener el ID del usuario del token (corregido para usar userID)
            const userID = req.user.userID;
            
            // Ruta relativa del archivo subido
            const filePath = `/uploads/${req.file.filename}`;
            
            // Actualizar la ruta de la imagen de portada en la base de datos
            const user = await User.findByPk(userID);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            
            user.coverImg = filePath;
            await user.save();
            
            res.status(200).json({
                message: 'Imagen de portada actualizada con éxito',
                coverImg: filePath
            });
        } catch (error) {
            console.error('Error al subir imagen de portada:', error);
            res.status(500).json({ message: 'Error al subir imagen de portada', error: error.message });
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