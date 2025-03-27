// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No autenticado' });
    }
    
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador' });
    }
    
    next();
};

module.exports = isAdmin;
