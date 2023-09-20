const jwt = require('jsonwebtoken');
const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token'];
    
    if (!token)
        return res.status(401).json({ auth: false, message: 'Nenhum token adicionado.' });

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err)
            return res.status(500).json({ auth: false, message: 'Falha na autenticação do token.' });

        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyJWT;