const jwt = require('jsonwebtoken');
JWT_SECRET = 'llave_secreta'

const authToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Decodifica el token
        console.log('Usuario decodificado:', decoded); // Log para depuración
        req.user = decoded; // Adjunta el usuario decodificado a req.user
        next(); // Continúa con el controlador
    } catch (error) {
        console.error('Error al verificar el token:', error); // Log detallado
        res.status(403).json({ message: 'Token inválido o expirado' });
    }
};

module.exports = authToken;
