const jwt = require('jsonwebtoken');
const SECRET_KEY = 'llave secreta'

const auth = (request, response, next) => {
    const authHeader = request.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);


    if (!token) {
        return response.status(401).send("No puedes ver esto, no estas autenticado");
    }

    jwt.verify(token, SECRET_KEY, (error, user) => {
        if (error) {
            console.log(error);
            return response.status(403).send("No puedes ver esto, autenticacion fallida");  
        }
        request.user = user;
        next();
    })
    

}

module.exports = auth