const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Токен не найден' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Неверный токен' });
    }
};

module.exports = authenticateJWT;
