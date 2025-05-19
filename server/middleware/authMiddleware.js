const jwt = require('jsonwebtoken');

const JWT_SECRET = 'reno4705';

const authMiddleware = (req, res, next) => {
    const token = req.cookies.userToken;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token found' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId; 
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;